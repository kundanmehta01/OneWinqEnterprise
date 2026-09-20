import { EmployeeProfile } from './employeeProfile.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { Department } from '../departments/department.model.js';
import { Card } from '../cards/card.model.js';
import { Template } from '../templates/template.model.js';
import { templateResolverService } from '../templates/templateResolver.service.js';
import { User } from '../users/user.model.js';
import { Role } from '../roles/role.model.js';
import { ProfileApproval } from '../profile-approvals/profileApproval.model.js';
import { CompanyProfile } from '../company-profile/companyProfile.model.js';
import { OrganizationSettings } from '../settings/organizationSettings.model.js';
import { Connection } from '../connections/connection.model.js';
import { calculateObjectDiff } from '../../utils/objectDiff.util.js';
import { NotFoundError, BadRequestError, ForbiddenError, ConflictError } from '../../errors/index.js';
import { ERROR_CODES } from '../../constants/errorCodes.constant.js';
import { eventBus } from '../../events/appEventBus.js';
import { slugService } from './slug.service.js';
import { ProfileSlugHistory } from './profileSlugHistory.model.js';
import { APP_EVENTS } from '../../constants/events.constant.js';

/** Shared populate options for profile queries */
const PROFILE_POPULATE = [
  {
    path: 'memberId',
    select: 'name employeeId designation departmentId roleId status',
    populate: [
      { path: 'departmentId', select: 'name slug description templateId', populate: { path: 'templateId' } },
      { path: 'roleId', select: 'name slug permissions' }
    ]
  },
  { path: 'templateId' }
];

/** Direct-editable draft fields allowed from user input */
const DRAFT_FIELDS = [
  'headline', 'bio', 'phone', 'workEmail', 'avatarUrl', 'collaborationNote',
  'overviewStats', 'location', 'about', 'connectAndContact', 'experience', 'journey',
  'projects', 'impactMetrics', 'achievements', 'mediaGallery', 'blogs',
  'socialLinks', 'customSections'
];

const sanitizeLocation = (loc) => {
  if (!loc) return { city: '', country: '' };
  if (typeof loc === 'string') {
    const s = loc.trim();
    if (s === '[object Object]' || !s) return { city: '', country: '' };
    const parts = s.split(',').map((p) => p.trim()).filter((p) => p && p !== '[object Object]');
    return { city: (parts[0] || '').slice(0, 100), country: (parts[1] || '').slice(0, 100) };
  }
  const city = (loc.city && typeof loc.city === 'string' && loc.city.trim() !== '[object Object]') ? loc.city.trim().slice(0, 100) : '';
  const country = (loc.country && typeof loc.country === 'string' && loc.country.trim() !== '[object Object]') ? loc.country.trim().slice(0, 100) : '';
  return { city, country };
};

class EmployeeProfileService {
  /** Check if actor or member has administrator privileges */
  _checkIsAdmin(userDoc, memberDoc, actorContext = {}) {
    if (actorContext?.isSuperAdmin) return true;
    if (userDoc?.email === 'superadmin@onewinq.com') return true;
    if (memberDoc?.isSystem) return true;

    const roleName = (memberDoc?.roleId?.name || actorContext?.roleName || '').toLowerCase();
    const roleSlug = (memberDoc?.roleId?.slug || '').toLowerCase();
    if (roleName.includes('admin') || roleSlug.includes('admin')) return true;

    const perms = [
      ...(memberDoc?.roleId?.permissions || []),
      ...(actorContext?.permissions || [])
    ];
    if (
      perms.includes('all') ||
      perms.includes('profile_approval.approve') ||
      perms.includes('profile_approval.read') ||
      perms.includes('team.manage') ||
      perms.includes('company_profile.update')
    ) {
      return true;
    }
    return false;
  }

  /** Normalize raw card status to frontend-friendly values */
  _normalizeCard(card) {
    if (!card) return null;
    let status = card.status;
    if (status === 'linked') status = 'active';
    if (status === 'blocked') status = 'suspended';
    return { ...card, status };
  }

  /**
   * Shared response builder: attaches NFC card, company branding, and resolved template
   * to an already-populated, lean profile document.
   */
  async _buildProfileResponse(profile) {
    if (profile.draft?.location) {
      profile.draft.location = sanitizeLocation(profile.draft.location);
    }
    if (profile.published?.location) {
      profile.published.location = sanitizeLocation(profile.published.location);
    }
    if (profile.location) {
      profile.location = sanitizeLocation(profile.location);
    }

    const memberId = profile.memberId?._id || profile.memberId;

    // NFC card lookup
    let nfcCard = null;
    if (memberId) {
      const card = await Card.findOne({
        memberId,
        status: { $in: ['active', 'linked', 'activation_pending', 'suspended'] }
      }).select('cardUid serialNumber cardType status tapCount lastTappedAt activatedAt assignedAt').lean();
      nfcCard = this._normalizeCard(card);
    }

    // Company branding
    const company = await CompanyProfile.findOne().select('name branding').lean();

    // Template resolution
    const resolvedTemplate = await templateResolverService.resolveTemplateForMember({
      role: profile.memberId?.roleId,
      department: profile.memberId?.departmentId,
      designation: profile.memberId?.designation,
      templateId: profile.templateId,
      themeOverrides: profile.themeOverrides
    });

    // Keep profile.templateId in sync if missing
    if (!profile.templateId && resolvedTemplate?._id) {
      await EmployeeProfile.findByIdAndUpdate(profile._id, {
        templateId: resolvedTemplate._id,
        templateVersion: resolvedTemplate.version || 1
      });
    }

    // Dynamically calculate overview stats if not custom entered or if filled with legacy seed defaults
    const pub = profile.published || profile.draft || {};
    const legacyConnections = ['248', '248+', '150', '150+', '500+'];
    const legacyProjects = ['25+', '25', '10+', '10'];
    const legacyYears = ['8+', '8', '5+', '5'];
    const legacyServices = ['5+', '5', '6+', '6'];

    const isLegacySeed = (val, legacyDefaults) => {
      if (!val) return true;
      const str = String(val).trim();
      return legacyDefaults.includes(str);
    };

    let realConnections = 0;
    try {
      const userOrMemberId = profile.userId?._id || profile.userId;
      const memberQueryId = profile.memberId?._id || profile.memberId;
      const queryIds = [userOrMemberId, memberQueryId].filter(Boolean);
      if (queryIds.length > 0) {
        realConnections = await Connection.countDocuments({
          $or: [
            { requesterId: { $in: queryIds }, status: 'accepted' },
            { recipientId: { $in: queryIds }, status: 'accepted' }
          ]
        });
      }
    } catch (e) {
      realConnections = 0;
    }

    let realYears = 0;
    const experienceList = pub.experience || [];
    if (experienceList.length > 0) {
      experienceList.forEach((exp) => {
        const start = exp.startDate ? new Date(exp.startDate) : null;
        const end = exp.endDate ? new Date(exp.endDate) : (exp.isCurrent ? new Date() : null);
        if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const diff = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24 * 365.25)));
          realYears += diff;
        } else {
          realYears += 1;
        }
      });
    }

    const realProjectsCount = (pub.projects || []).length;
    const tapCount = nfcCard?.tapCount || 0;

    const rawConn = pub.overviewStats?.connectionsCount || pub.overviewStats?.connections;
    const connectionsVal = (!isLegacySeed(rawConn, legacyConnections))
      ? String(rawConn)
      : (realConnections > 0 ? `${realConnections}+` : (tapCount > 0 ? `${tapCount}+` : '0'));

    const rawProj = pub.overviewStats?.projectsCount || pub.overviewStats?.projects;
    const projectsVal = (!isLegacySeed(rawProj, legacyProjects))
      ? String(rawProj)
      : (realProjectsCount > 0 ? `${realProjectsCount}+` : '0');

    const rawYears = pub.overviewStats?.yearsOfExperience || pub.overviewStats?.years;
    const yearsVal = (!isLegacySeed(rawYears, legacyYears))
      ? String(rawYears)
      : (realYears > 0 ? `${realYears}+` : '0');

    const rawServ = pub.overviewStats?.servicesCount || pub.overviewStats?.services;
    const servicesVal = (!isLegacySeed(rawServ, legacyServices))
      ? String(rawServ)
      : '0';

    const dynamicOverviewStats = {
      connectionsCount: connectionsVal,
      connections: connectionsVal,
      projectsCount: projectsVal,
      projects: projectsVal,
      yearsOfExperience: yearsVal,
      years: yearsVal,
      servicesCount: servicesVal,
      services: servicesVal
    };

    return {
      ...profile,
      coverUrl: company?.branding?.coverUrl || '',
      orgLogoUrl: company?.branding?.logoUrl || '',
      companyBranding: company?.branding || null,
      overviewStats: dynamicOverviewStats,
      template: {
        id: resolvedTemplate.key,
        key: resolvedTemplate.key,
        name: resolvedTemplate.name,
        category: resolvedTemplate.category,
        layoutConfig: resolvedTemplate.layoutConfig,
        predefinedDetails: resolvedTemplate.predefinedDetails || {},
        themeOverrides: profile.themeOverrides
      },
      nfcCard
    };
  }

  async _ensureProfileForUser(userId) {
    let profile = await EmployeeProfile.findOne({ userId });
    if (!profile) {
      let member = await TeamMember.findOne({ userId });
      const user = await User.findById(userId);

      if (!member && user) {
        const adminRole = (await Role.findOne({ slug: 'super-admin' })) || (await Role.findOne({}));
        member = await TeamMember.create({
          userId: user._id,
          name: user.email ? user.email.split('@')[0].replace('.', ' ') : 'Enterprise User',
          email: user.email,
          employeeId: `EMP-${Date.now().toString().slice(-4)}`,
          designation: 'Enterprise Member',
          roleId: adminRole?._id,
          status: 'active'
        });
      }

      if (member) {
        let assignedTemplate = null;
        const roleDoc = member.roleId ? await Role.findById(member.roleId) : null;
        const deptDoc = member.departmentId
          ? await Department.findById(member.departmentId).populate('templateId')
          : null;
        const resolved = await templateResolverService.resolveTemplateForMember({
          role: roleDoc,
          department: deptDoc,
          designation: member.designation
        });

        if (resolved?._id) {
          assignedTemplate = await Template.findById(resolved._id);
        } else if (resolved?.category || resolved?.key) {
          const cat = resolved.category || resolved.key;
          assignedTemplate = await Template.findOne({
            $or: [{ category: cat }, { slug: `${cat}-profile` }, { slug: cat }]
          });
        }
        if (!assignedTemplate) {
          assignedTemplate = (await Template.findOne({ isDefault: true })) || (await Template.findOne({}));
        }

        const candidateName = member.name || user?.name || 'profile';
        let slug = await slugService.generateUniqueSlug(candidateName);
        let createdProfile = null;
        let retries = 3;

        while (retries > 0 && !createdProfile) {
          try {
            createdProfile = await EmployeeProfile.create({
              userId,
              memberId: member._id,
              slug,
              templateId: assignedTemplate?._id,
              templateVersion: assignedTemplate?.version || 1,
              approvalStatus: 'approved',
              draft: {
                headline: member.designation,
                workEmail: member.email || user?.email,
                avatarUrl: member.avatarUrl || '',
                bio: 'Enterprise professional at OneWinq.',
                about: {
                  title: `About ${member.name?.trim().split(' ')[0] || 'Member'}`,
                  introduction: 'Dedicated enterprise professional passionate about driving technology excellence and collaborative growth.',
                  expertise: `Specialized in ${member.designation}, process optimization, and scalable enterprise execution.`,
                  experienceSummary: `Proven background in driving impact, cross-functional collaboration, and enterprise digital transformation.`
                }
              },
              published: {
                headline: member.designation,
                workEmail: member.email || user?.email,
                avatarUrl: member.avatarUrl || '',
                bio: 'Enterprise professional at OneWinq.',
                about: {
                  title: `About ${member.name?.trim().split(' ')[0] || 'Member'}`,
                  introduction: 'Dedicated enterprise professional passionate about driving technology excellence and collaborative growth.',
                  expertise: `Specialized in ${member.designation}, process optimization, and scalable enterprise execution.`,
                  experienceSummary: `Proven background in driving impact, cross-functional collaboration, and enterprise digital transformation.`
                }
              }
            });
            profile = createdProfile;
          } catch (createErr) {
            if (createErr.code === 11000 && createErr.keyPattern?.slug) {
              retries--;
              slug = await slugService.generateUniqueSlug(candidateName);
              if (retries === 0) throw createErr;
            } else {
              throw createErr;
            }
          }
        }

        if (profile) {
          member.profileId = profile._id;
          await member.save();
        }
      }
    }
    return profile;
  }

  async getProfileByUserId(userId, actorContext = {}) {
    let profile = await EmployeeProfile.findOne({ userId }).populate(PROFILE_POPULATE).lean();

    if (!profile) {
      await this._ensureProfileForUser(userId);
      profile = await EmployeeProfile.findOne({ userId }).populate(PROFILE_POPULATE).lean();
    }

    if (!profile) {
      throw new NotFoundError('Employee profile not found', ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const member = profile.memberId;
    const userDoc = await User.findById(userId).select('email').lean();
    const isSuperOrAdmin = this._checkIsAdmin(userDoc, member, actorContext);

    if (isSuperOrAdmin) {
      profile.isLocked = false;
      if (profile.approvalStatus === 'pending_review') {
        profile.approvalStatus = 'approved';
      }
    }

    return this._buildProfileResponse(profile);
  }

  async getProfileByMemberId(memberId) {
    const profile = await EmployeeProfile.findOne({ memberId }).populate(PROFILE_POPULATE).lean();

    if (!profile) {
      throw new NotFoundError('Employee profile not found', ERROR_CODES.PROFILE_NOT_FOUND);
    }

    return this._buildProfileResponse(profile);
  }

  async updateDraftProfile(userId, updateData, actorContext = {}) {
    let profile = await EmployeeProfile.findOne({ userId });
    if (!profile) {
      profile = await this._ensureProfileForUser(userId);
    }

    const member = await TeamMember.findOne({ userId }).populate('roleId');
    const userDoc = await User.findById(userId).select('email').lean();
    const isSuperOrAdmin = this._checkIsAdmin(userDoc, member, actorContext);

    if (profile.isLocked && !isSuperOrAdmin) {
      throw new ForbiddenError(
        'Profile is currently locked for review and cannot be modified.',
        ERROR_CODES.PROFILE_LOCKED
      );
    }

    if (isSuperOrAdmin) {
      profile.isLocked = false;
    }

    if (updateData.slug && updateData.slug !== profile.slug) {
      const normalizedNewSlug = slugService.normalizeSlug(updateData.slug);
      if (normalizedNewSlug !== profile.slug) {
        const availability = await slugService.isSlugAvailable(normalizedNewSlug, profile._id);
        if (!availability.available) {
          throw new ConflictError(availability.reason || `The profile URL slug '${updateData.slug}' is not available.`);
        }

        const oldSlug = profile.slug;
        if (oldSlug) {
          // Record old slug into ProfileSlugHistory so all existing QR codes/links redirect permanently
          await ProfileSlugHistory.findOneAndUpdate(
            { slug: oldSlug.toLowerCase() },
            { slug: oldSlug.toLowerCase(), profileId: profile._id },
            { upsert: true, new: true }
          );
        }

        profile.slug = normalizedNewSlug;
      }
    }

    if (updateData.templateId) {
      const template = await Template.findById(updateData.templateId);
      if (!template) throw new NotFoundError('Selected template not found', ERROR_CODES.TEMPLATE_NOT_FOUND);
      profile.templateId = template._id;
      profile.templateVersion = template.version;
    }

    if (updateData.themeOverrides) {
      profile.themeOverrides = { ...profile.themeOverrides, ...updateData.themeOverrides };
      profile.markModified('themeOverrides');
    }

    if (updateData.visibility) {
      profile.visibility = updateData.visibility;
    }

    const draft = profile.draft ? profile.draft.toObject() : {};
    for (const field of DRAFT_FIELDS) {
      if (updateData[field] !== undefined) {
        draft[field] = updateData[field];
      }
    }

    if (updateData.about !== undefined) {
      const existingAbout = draft.about || {};
      draft.about = {
        ...existingAbout,
        ...updateData.about,
        title: updateData.about.title !== undefined ? updateData.about.title : (existingAbout.title || ''),
        introduction: updateData.about.introduction !== undefined ? updateData.about.introduction : (existingAbout.introduction || ''),
        expertise: updateData.about.expertise !== undefined ? updateData.about.expertise : (existingAbout.expertise || ''),
        experienceSummary: updateData.about.experienceSummary !== undefined
          ? updateData.about.experienceSummary
          : (updateData.about.experience !== undefined ? updateData.about.experience : (existingAbout.experienceSummary || existingAbout.experience || ''))
      };
    }

    // Keep experience and journey synchronized in draft so there are no stale seed milestones
    if (updateData.experience !== undefined) {
      draft.experience = updateData.experience;
      draft.journey = updateData.experience;
    } else if (updateData.journey !== undefined && (draft.experience === undefined || draft.experience.length === 0)) {
      draft.experience = updateData.journey;
      draft.journey = updateData.journey;
    }

    // Keep connectAndContact and direct contact fields (workEmail, phone, collaborationNote, linkedin, twitter, socialLinks) bidirectional synchronized
    if (updateData.connectAndContact !== undefined) {
      const existingConnect = draft.connectAndContact || {};
      draft.connectAndContact = {
        title: updateData.connectAndContact.title || existingConnect.title || "Let's Connect",
        note: updateData.connectAndContact.note || existingConnect.note || draft.collaborationNote || 'Open to collaboration, speaking opportunities and new ideas.',
        workEmail: updateData.connectAndContact.workEmail !== undefined ? updateData.connectAndContact.workEmail : (existingConnect.workEmail || draft.workEmail || ''),
        phone: updateData.connectAndContact.phone !== undefined ? updateData.connectAndContact.phone : (existingConnect.phone || draft.phone || ''),
        linkedin: updateData.connectAndContact.linkedin !== undefined ? updateData.connectAndContact.linkedin : (existingConnect.linkedin || draft.linkedin || ''),
        twitter: updateData.connectAndContact.twitter !== undefined ? updateData.connectAndContact.twitter : (existingConnect.twitter || draft.twitter || ''),
        socialLinks: updateData.connectAndContact.socialLinks !== undefined ? updateData.connectAndContact.socialLinks : (existingConnect.socialLinks || draft.socialLinks || []),
        ctaButtonText: updateData.connectAndContact.ctaButtonText || existingConnect.ctaButtonText || 'Connect With Me'
      };
      if (updateData.connectAndContact.workEmail !== undefined) draft.workEmail = updateData.connectAndContact.workEmail;
      if (updateData.connectAndContact.phone !== undefined) draft.phone = updateData.connectAndContact.phone;
      if (updateData.connectAndContact.note !== undefined) draft.collaborationNote = updateData.connectAndContact.note;
    } else {
      draft.connectAndContact = draft.connectAndContact || {
        title: "Let's Connect",
        note: draft.collaborationNote || 'Open to collaboration, speaking opportunities and new ideas.',
        workEmail: draft.workEmail || '',
        phone: draft.phone || '',
        linkedin: '',
        twitter: '',
        socialLinks: draft.socialLinks || [],
        ctaButtonText: 'Connect With Me'
      };
      if (updateData.workEmail !== undefined) draft.connectAndContact.workEmail = updateData.workEmail;
      if (updateData.phone !== undefined) draft.connectAndContact.phone = updateData.phone;
      if (updateData.collaborationNote !== undefined) draft.connectAndContact.note = updateData.collaborationNote;
    }

    if (draft.location !== undefined) {
      draft.location = sanitizeLocation(draft.location);
    }

    profile.draft = draft;
    profile.calculateCompletionScore();
    profile.markModified('draft');

    // Check organization approval policy
    const orgSettings = await OrganizationSettings.findOne().lean();
    const requireApproval = orgSettings?.profileSettings?.requireApprovalForProfileChanges ?? true;

    // If approval is not required OR user is administrator OR publishImmediately requested, promote directly to published
    if (!requireApproval || isSuperOrAdmin || updateData.publishImmediately) {
      profile.published = draft;
      profile.markModified('published');
      profile.approvalStatus = 'approved';
      profile.isLocked = false;
      profile.lastApprovedAt = new Date();
      profile.lastReviewedBy = userId;

      // Clean any pending approval records for this profile so admin count resets
      await ProfileApproval.updateMany(
        { profileId: profile._id, status: 'pending' },
        { status: 'approved', reviewedBy: userId, reviewedAt: new Date() }
      );
    } else {
      // Profile draft modified by employee awaiting review:
      // DO NOT overwrite profile.published! profile.published must remain the previous live state
      // so diffs correctly compare [old published state] -> [new draft state].
      //
      // Reset status to draft if previously approved, rejected, or changes_requested
      if (
        profile.approvalStatus === 'approved' ||
        profile.approvalStatus === 'rejected' ||
        profile.approvalStatus === 'changes_requested' ||
        profile.approvalStatus === 'pending_review'
      ) {
        profile.approvalStatus = 'draft';
      }
    }

    await profile.save();

    eventBus.emitEvent(APP_EVENTS.PROFILE_DRAFT_UPDATED, {
      actorId: userId,
      memberId: profile.memberId,
      profileId: profile._id,
      context: actorContext
    });

    return profile;
  }

  async submitDraftForApproval(userId, note = '', actorContext = {}) {
    const profile = await EmployeeProfile.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Employee profile not found', ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const member = await TeamMember.findOne({ userId }).populate('roleId');
    const userDoc = await User.findById(userId).select('email').lean();
    const isSuperOrAdmin = this._checkIsAdmin(userDoc, member, actorContext);

    const publishedClean = profile.published ? profile.published.toObject() : {};
    const draftClean = profile.draft ? profile.draft.toObject() : {};

    if (draftClean.location !== undefined) {
      draftClean.location = sanitizeLocation(draftClean.location);
      if (profile.draft) {
        profile.draft.location = draftClean.location;
      }
    }
    if (publishedClean.location !== undefined) {
      publishedClean.location = sanitizeLocation(publishedClean.location);
    }

    // Synchronize draft experience & journey
    if (draftClean.experience !== undefined) {
      draftClean.journey = draftClean.experience;
    }

    // If published profile has stale seed journey (e.g. "Joined OneWinq as...") while experience was empty or different,
    // sync published journey with published experience so diff reflects true experience changes accurately.
    if (publishedClean.experience !== undefined) {
      publishedClean.journey = publishedClean.experience;
    }

    let diffSummary = calculateObjectDiff(publishedClean, draftClean);

    // If both experience and journey are in diffSummary, deduplicate so experience is the primary diff
    const hasExpDiff = diffSummary.some((d) => d.field === 'experience');
    if (hasExpDiff) {
      diffSummary = diffSummary.filter((d) => d.field !== 'journey');
    } else {
      diffSummary = diffSummary.map((d) => (d.field === 'journey' ? { ...d, field: 'experience' } : d));
    }

    // If user is administrator or founder, auto-approve and make published immediately
    if (isSuperOrAdmin) {
      profile.published = draftClean;
      profile.markModified('published');
      profile.markModified('draft');
      profile.approvalStatus = 'approved';
      profile.isLocked = false;
      profile.lastApprovedAt = new Date();
      profile.lastReviewedBy = userId;
      profile.calculateCompletionScore();
      await profile.save();

      // Clean any pending approval
      await ProfileApproval.updateMany(
        { profileId: profile._id, status: 'pending' },
        { status: 'approved', reviewedBy: userId, reviewedAt: new Date() }
      );

      return {
        message: 'Profile changes published and live immediately.',
        approvalId: null,
        diffSummary,
        autoApproved: true
      };
    }

    // Check if there is an active pending approval in the system
    const hasPendingApproval = await ProfileApproval.findOne({
      profileId: profile._id,
      status: 'pending'
    });

    if (hasPendingApproval) {
      throw new BadRequestError('A profile submission is already pending review.', ERROR_CODES.PROFILE_ALREADY_PENDING);
    }

    // If no approval is actively pending, ensure any stale lock is cleared
    if (profile.isLocked || profile.approvalStatus === 'pending_review') {
      profile.isLocked = false;
      profile.approvalStatus = 'draft';
    }

    // When diffSummary is empty it means draft == published.
    // This legitimately happens after a rejection or changes_requested cycle where
    // profile.published was never updated, and the user is re-submitting the same
    // (or only slightly changed) draft. In that case, treat the full draft as the
    // submission so it reaches the admin instead of silently returning 'up to date'.
    if (diffSummary.length === 0) {
      const resubmitStatuses = ['rejected', 'changes_requested', 'draft'];
      const canResubmit = resubmitStatuses.includes(profile.approvalStatus);
      if (!canResubmit) {
        return {
          message: 'Your profile is already up to date with the published version.',
          approvalId: null,
          diffSummary: []
        };
      }
      // Build a concise synthetic diff so the admin can review
      diffSummary = [{ field: 'profile', oldValue: 'Published version', newValue: 'Updated profile draft' }];
    }

    const approval = await ProfileApproval.create({
      memberId: profile.memberId,
      profileId: profile._id,
      submittedBy: userId,
      submittedAt: new Date(),
      status: 'pending',
      diffSummary,
      draftSnapshot: draftClean,
      reviewNote: note
    });

    profile.approvalStatus = 'pending_review';
    profile.isLocked = true;
    profile.lastSubmittedAt = new Date();
    profile.markModified('draft');
    await profile.save();

    eventBus.emitEvent(APP_EVENTS.PROFILE_SUBMITTED, {
      actorId: userId,
      memberId: profile.memberId,
      profileId: profile._id,
      approvalId: approval._id,
      diffCount: diffSummary.length,
      context: actorContext
    });

    return {
      message: 'Profile submitted successfully for review',
      approvalId: approval._id,
      diffSummary
    };
  }

  async getApprovalStatus(userId) {
    const profile = await EmployeeProfile.findOne({ userId }).select(
      'approvalStatus isLocked lastSubmittedAt lastApprovedAt'
    );
    if (!profile) {
      throw new NotFoundError('Profile not found', ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const latestApproval = await ProfileApproval.findOne({ profileId: profile._id })
      .sort({ createdAt: -1 })
      .populate('reviewerId', 'email')
      .lean();

    return {
      approvalStatus: profile.approvalStatus,
      isLocked: profile.isLocked,
      lastSubmittedAt: profile.lastSubmittedAt,
      lastApprovedAt: profile.lastApprovedAt,
      latestApproval
    };
  }
}

export const employeeProfileService = new EmployeeProfileService();
