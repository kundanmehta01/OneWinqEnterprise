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
  'overviewStats', 'location', 'experience', 'journey', 'skills', 'projects',
  'impactMetrics', 'achievements', 'mediaGallery', 'blogs', 'socialLinks', 'customSections'
];

class EmployeeProfileService {
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
      designation: profile.memberId?.designation
    });

    // Keep profile.templateId in sync with the role-resolved template
    if (resolvedTemplate?._id && String(profile.templateId?._id || profile.templateId) !== String(resolvedTemplate._id)) {
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
    const realSkillsCount = (pub.skills || []).length;
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
      : (realSkillsCount > 0 ? `${realSkillsCount}+` : '0');

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

        const baseSlug = member.name ? member.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'profile';
        let slug = baseSlug;
        let count = 1;
        while (await EmployeeProfile.findOne({ slug })) {
          slug = `${baseSlug}-${count++}`;
        }

        profile = await EmployeeProfile.create({
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
            bio: 'Enterprise professional at OneWinq.'
          },
          published: {
            headline: member.designation,
            workEmail: member.email || user?.email,
            avatarUrl: member.avatarUrl || '',
            bio: 'Enterprise professional at OneWinq.'
          }
        });

        member.profileId = profile._id;
        await member.save();
      }
    }
    return profile;
  }

  async getProfileByUserId(userId) {
    let profile = await EmployeeProfile.findOne({ userId }).populate(PROFILE_POPULATE).lean();

    if (!profile) {
      await this._ensureProfileForUser(userId);
      profile = await EmployeeProfile.findOne({ userId }).populate(PROFILE_POPULATE).lean();
    }

    if (!profile) {
      throw new NotFoundError('Employee profile not found', ERROR_CODES.PROFILE_NOT_FOUND);
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

    if (profile.isLocked) {
      throw new ForbiddenError(
        'Profile is currently locked for review and cannot be modified.',
        ERROR_CODES.PROFILE_LOCKED
      );
    }

    if (updateData.slug && updateData.slug !== profile.slug) {
      const existing = await EmployeeProfile.findOne({
        _id: { $ne: profile._id },
        slug: updateData.slug.toLowerCase()
      });
      if (existing) {
        throw new ConflictError(`The profile URL slug '${updateData.slug}' is already taken.`);
      }
      profile.slug = updateData.slug.toLowerCase();
    }

    if (updateData.templateId) {
      const template = await Template.findById(updateData.templateId);
      if (!template) throw new NotFoundError('Selected template not found', ERROR_CODES.TEMPLATE_NOT_FOUND);
      profile.templateId = template._id;
      profile.templateVersion = template.version;
    }

    if (updateData.themeOverrides) {
      profile.themeOverrides = { ...profile.themeOverrides, ...updateData.themeOverrides };
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

    profile.draft = draft;
    profile.calculateCompletionScore();

    const member = await TeamMember.findOne({ userId }).populate('roleId');
    const isSuperOrAdmin = member?.roleId?.slug === 'super-admin' || member?.roleId?.slug === 'admin' || member?.isSystem;

    // Check organization approval policy
    const orgSettings = await OrganizationSettings.findOne().lean();
    const requireApproval = orgSettings?.profileSettings?.requireApprovalForProfileChanges ?? true;

    // If approval is not required OR user is administrator, also promote directly to published
    if (!requireApproval || isSuperOrAdmin || updateData.publishImmediately) {
      profile.published = draft;
      profile.approvalStatus = 'approved';
      profile.isLocked = false;
      profile.lastApprovedAt = new Date();
      profile.lastReviewedBy = userId;
    } else {
      if (profile.approvalStatus === 'approved' || profile.approvalStatus === 'changes_requested') {
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
    const isSuperOrAdmin = member?.roleId?.slug === 'super-admin' || member?.roleId?.slug === 'admin' || member?.isSystem;

    const publishedClean = profile.published ? profile.published.toObject() : {};
    const draftClean = profile.draft ? profile.draft.toObject() : {};
    const diffSummary = calculateObjectDiff(publishedClean, draftClean);

    // If user is administrator or founder, auto-approve and make published immediately
    if (isSuperOrAdmin) {
      profile.published = draftClean;
      profile.approvalStatus = 'approved';
      profile.isLocked = false;
      profile.lastApprovedAt = new Date();
      profile.lastReviewedBy = userId;
      profile.calculateCompletionScore();
      await profile.save();

      return {
        message: 'Profile changes published and live immediately.',
        approvalId: null,
        diffSummary,
        autoApproved: true
      };
    }

    if (profile.isLocked || profile.approvalStatus === 'pending_review') {
      throw new BadRequestError('A profile submission is already pending review.', ERROR_CODES.PROFILE_ALREADY_PENDING);
    }

    // If there are no diffs detected, don't throw 400 error — return friendly success
    if (diffSummary.length === 0) {
      return {
        message: 'Your profile is already up to date with the published version.',
        approvalId: null,
        diffSummary: []
      };
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
