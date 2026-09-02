import { ProfileApproval } from './profileApproval.model.js';
import { EmployeeProfile } from '../employee-profile/employeeProfile.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { User } from '../users/user.model.js';
import { NotFoundError, BadRequestError } from '../../errors/index.js';
import { ERROR_CODES } from '../../constants/errorCodes.constant.js';
import { parsePagination, formatPaginationMeta } from '../../utils/pagination.util.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';
import { emailService } from '../../integrations/email/email.service.js';

class ProfileApprovalService {
  async getAllApprovals(query = {}) {
    const { page, limit, skip, sort } = parsePagination(query, 20);
    const filter = {};

    if (query.status) {
      filter.status = query.status;
    }

    const [approvals, totalItems] = await Promise.all([
      ProfileApproval.find(filter)
        .populate({
          path: 'memberId',
          select: 'name employeeId designation departmentId',
          populate: { path: 'departmentId', select: 'name' }
        })
        .populate('submittedBy', 'email')
        .populate('reviewerId', 'email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ProfileApproval.countDocuments(filter)
    ]);

    return {
      approvals,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }

  async getApprovalById(id) {
    const approval = await ProfileApproval.findById(id)
      .populate({
        path: 'memberId',
        select: 'name employeeId designation departmentId',
        populate: { path: 'departmentId', select: 'name' }
      })
      .populate('profileId')
      .populate('submittedBy', 'email')
      .populate('reviewerId', 'email')
      .lean();

    if (!approval) {
      throw new NotFoundError('Profile approval request not found', ERROR_CODES.APPROVAL_NOT_FOUND);
    }
    return approval;
  }

  async reviewApproval(id, { action, reviewNote = '', requestedChanges = [] }, reviewerContext = {}) {
    const approval = await ProfileApproval.findById(id);
    if (!approval) {
      throw new NotFoundError('Profile approval request not found', ERROR_CODES.APPROVAL_NOT_FOUND);
    }

    if (approval.status !== 'pending') {
      throw new BadRequestError(`This approval request has already been ${approval.status}.`, ERROR_CODES.INVALID_APPROVAL_ACTION);
    }

    const profile = await EmployeeProfile.findById(approval.profileId);
    if (!profile) {
      throw new NotFoundError('Associated employee profile not found', ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const member = await TeamMember.findById(approval.memberId);
    const submitter = await User.findById(approval.submittedBy);

    approval.reviewerId = reviewerContext.actorId;
    approval.reviewedAt = new Date();
    approval.reviewNote = reviewNote;
    approval.requestedChanges = requestedChanges;

    if (action === 'approve') {
      approval.status = 'approved';

      // Promote draft to published
      profile.published = approval.draftSnapshot;
      profile.approvalStatus = 'approved';
      profile.isLocked = false;
      profile.lastApprovedAt = new Date();
      profile.lastReviewedBy = reviewerContext.actorId;
      const score = profile.calculateCompletionScore();
      await profile.save();

      // Update TeamMember completion score
      if (member) {
        member.profileCompletionScore = score;
        await member.save();
      }

      eventBus.emitEvent(APP_EVENTS.PROFILE_APPROVED, {
        actorId: reviewerContext.actorId,
        memberId: profile.memberId,
        profileId: profile._id,
        approvalId: approval._id,
        context: reviewerContext
      });
    } else if (action === 'reject') {
      approval.status = 'rejected';
      profile.approvalStatus = 'rejected';
      profile.isLocked = false;
      await profile.save();

      eventBus.emitEvent(APP_EVENTS.PROFILE_REJECTED, {
        actorId: reviewerContext.actorId,
        memberId: profile.memberId,
        profileId: profile._id,
        approvalId: approval._id,
        reviewNote,
        context: reviewerContext
      });
    } else if (action === 'request_changes') {
      approval.status = 'changes_requested';
      profile.approvalStatus = 'changes_requested';
      profile.isLocked = false;
      await profile.save();

      eventBus.emitEvent(APP_EVENTS.PROFILE_CHANGES_REQUESTED, {
        actorId: reviewerContext.actorId,
        memberId: profile.memberId,
        profileId: profile._id,
        approvalId: approval._id,
        requestedChanges,
        reviewNote,
        context: reviewerContext
      });
    } else {
      throw new BadRequestError('Invalid review action', ERROR_CODES.INVALID_APPROVAL_ACTION);
    }

    await approval.save();

    // Send email notification to employee
    if (submitter && member) {
      emailService.sendProfileStatusNotification({
        to: submitter.email,
        name: member.name,
        status: action === 'request_changes' ? 'changes requested' : action,
        reviewNote
      }).catch(() => {});
    }

    return approval;
  }
}

export const profileApprovalService = new ProfileApprovalService();
