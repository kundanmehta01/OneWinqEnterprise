import { EmployeeProfile } from './employeeProfile.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { Template } from '../templates/template.model.js';
import { ProfileApproval } from '../profile-approvals/profileApproval.model.js';
import { calculateObjectDiff } from '../../utils/objectDiff.util.js';
import { NotFoundError, BadRequestError, ForbiddenError, ConflictError } from '../../errors/index.js';
import { ERROR_CODES } from '../../constants/errorCodes.constant.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';

class EmployeeProfileService {
  async getProfileByUserId(userId) {
    const profile = await EmployeeProfile.findOne({ userId })
      .populate('memberId', 'name employeeId designation departmentId status')
      .populate('templateId')
      .lean();

    if (!profile) {
      throw new NotFoundError('Employee profile not found', ERROR_CODES.PROFILE_NOT_FOUND);
    }
    return profile;
  }

  async getProfileByMemberId(memberId) {
    const profile = await EmployeeProfile.findOne({ memberId })
      .populate('memberId', 'name employeeId designation departmentId status')
      .populate('templateId')
      .lean();

    if (!profile) {
      throw new NotFoundError('Employee profile not found', ERROR_CODES.PROFILE_NOT_FOUND);
    }
    return profile;
  }

  async updateDraftProfile(userId, updateData, actorContext = {}) {
    const profile = await EmployeeProfile.findOne({ userId });
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
