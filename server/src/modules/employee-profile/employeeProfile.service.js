import { EmployeeProfile } from './employeeProfile.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { Card } from '../cards/card.model.js';
import { Template } from '../templates/template.model.js';
import { User } from '../users/user.model.js';
import { Role } from '../roles/role.model.js';
import { ProfileApproval } from '../profile-approvals/profileApproval.model.js';
import { calculateObjectDiff } from '../../utils/objectDiff.util.js';
import { NotFoundError, BadRequestError, ForbiddenError, ConflictError } from '../../errors/index.js';
import { ERROR_CODES } from '../../constants/errorCodes.constant.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';

class EmployeeProfileService {
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
        const defaultTemplate = (await Template.findOne({ isDefault: true })) || (await Template.findOne({}));
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
          templateId: defaultTemplate?._id,
          templateVersion: defaultTemplate?.version || 1,
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
    let profile = await EmployeeProfile.findOne({ userId })
      .populate('memberId', 'name employeeId designation departmentId status')
      .populate('templateId')
      .lean();

    if (!profile) {
      await this._ensureProfileForUser(userId);
      profile = await EmployeeProfile.findOne({ userId })
        .populate('memberId', 'name employeeId designation departmentId status')
        .populate('templateId')
        .lean();
    }

    if (!profile) {
      throw new NotFoundError('Employee profile not found', ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const memberId = profile.memberId?._id || profile.memberId;
    let nfcCard = null;
    if (memberId) {
      const card = await Card.findOne({
        memberId,
        status: { $in: ['active', 'linked', 'activation_pending', 'suspended'] }
      }).select('cardUid serialNumber cardType status tapCount lastTappedAt activatedAt assignedAt').lean();

      if (card) {
        let normalizedStatus = card.status;
        if (card.status === 'linked') normalizedStatus = 'active';
        if (card.status === 'blocked') normalizedStatus = 'suspended';
        nfcCard = { ...card, status: normalizedStatus };
      }
    }

    return {
      ...profile,
      nfcCard
    };
  }

  async getProfileByMemberId(memberId) {
    const profile = await EmployeeProfile.findOne({ memberId })
      .populate('memberId', 'name employeeId designation departmentId status')
      .populate('templateId')
      .lean();

    if (!profile) {
      throw new NotFoundError('Employee profile not found', ERROR_CODES.PROFILE_NOT_FOUND);
    }

    let nfcCard = null;
    const card = await Card.findOne({
      memberId,
      status: { $in: ['active', 'linked', 'activation_pending', 'suspended'] }
    }).select('cardUid serialNumber cardType status tapCount lastTappedAt activatedAt assignedAt').lean();

    if (card) {
      let normalizedStatus = card.status;
      if (card.status === 'linked') normalizedStatus = 'active';
      if (card.status === 'blocked') normalizedStatus = 'suspended';
      nfcCard = { ...card, status: normalizedStatus };
    }

    return {
      ...profile,
      nfcCard
    };
  }

  async updateDraftProfile(userId, updateData, actorContext = {}) {
    let profile = await EmployeeProfile.findOne({ userId });
    if (!profile) {
      profile = await this._ensureProfileForUser(userId);
    }
    if (!profile) {
      throw new NotFoundError('Employee profile not found', ERROR_CODES.PROFILE_NOT_FOUND);
    }

    if (profile.isLocked) {
      throw new ForbiddenError(
        'Your profile changes are currently under review and locked for editing.',
        ERROR_CODES.PROFILE_LOCKED
      );
    }

    // Slug check if updating slug
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
    const directFields = [
      'headline',
      'bio',
      'phone',
      'workEmail',
      'avatarUrl',
      'coverUrl',
      'collaborationNote',
      'overviewStats',
      'location',
      'experience',
      'journey',
      'skills',
      'projects',
      'impactMetrics',
      'achievements',
      'mediaGallery',
      'blogs',
      'socialLinks',
      'customSections'
    ];

    for (const field of directFields) {
      if (updateData[field] !== undefined) {
        draft[field] = updateData[field];
      }
    }

    profile.draft = draft;
    profile.calculateCompletionScore();

    if (profile.approvalStatus === 'approved' || profile.approvalStatus === 'changes_requested') {
      profile.approvalStatus = 'draft';
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

    if (profile.isLocked || profile.approvalStatus === 'pending_review') {
      throw new BadRequestError('A profile submission is already pending review.', ERROR_CODES.PROFILE_ALREADY_PENDING);
    }

    const publishedClean = profile.published ? profile.published.toObject() : {};
    const draftClean = profile.draft ? profile.draft.toObject() : {};

    const diffSummary = calculateObjectDiff(publishedClean, draftClean);

    if (diffSummary.length === 0 && profile.published?.headline) {
      throw new BadRequestError('No changes detected between draft and published profile.', ERROR_CODES.NO_PENDING_CHANGES);
    }

    // Create Approval record
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
    const profile = await EmployeeProfile.findOne({ userId }).select('approvalStatus isLocked lastSubmittedAt lastApprovedAt');
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
