import { eventBus } from '../appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';
import { notificationService } from '../../modules/notifications/notification.service.js';
import { TeamMember } from '../../modules/team-members/teamMember.model.js';
import { User } from '../../modules/users/user.model.js';
import { Role } from '../../modules/roles/role.model.js';
import { SYSTEM_ROLES } from '../../constants/roles.constant.js';

export const registerNotificationListeners = () => {
  // When a profile is submitted -> notify admins
  eventBus.subscribeEvent(APP_EVENTS.PROFILE_SUBMITTED, async (payload) => {
    const adminRoles = await Role.find({
      name: { $in: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.HR_ADMIN] }
    }).select('_id');
    const adminRoleIds = adminRoles.map((r) => r._id);

    const adminMembers = await TeamMember.find({
      roleId: { $in: adminRoleIds },
      status: 'active',
      isArchived: false
    }).select('userId');

    const member = await TeamMember.findById(payload.memberId).select('name');
    const memberName = member ? member.name : 'A team member';

    for (const adm of adminMembers) {
      if (adm.userId) {
        await notificationService.createNotification({
          recipientId: adm.userId,
          type: 'PROFILE_SUBMITTED',
          title: 'Profile Changes Submitted',
          message: `${memberName} submitted profile updates for review.`,
          data: {
            approvalId: payload.approvalId,
            memberId: payload.memberId,
            profileId: payload.profileId
          }
        });
      }
    }
  });

  // When profile is approved -> notify employee
  eventBus.subscribeEvent(APP_EVENTS.PROFILE_APPROVED, async (payload) => {
    const member = await TeamMember.findById(payload.memberId).select('userId name');
    if (member && member.userId) {
      await notificationService.createNotification({
        recipientId: member.userId,
        type: 'PROFILE_APPROVED',
        title: 'Profile Changes Approved',
        message: 'Your profile changes have been reviewed, approved, and published to your digital profile.',
        data: { profileId: payload.profileId, approvalId: payload.approvalId }
      });
    }
  });

  // When profile is rejected -> notify employee
  eventBus.subscribeEvent(APP_EVENTS.PROFILE_REJECTED, async (payload) => {
    const member = await TeamMember.findById(payload.memberId).select('userId name');
    if (member && member.userId) {
      await notificationService.createNotification({
        recipientId: member.userId,
        type: 'PROFILE_REJECTED',
        title: 'Profile Changes Rejected',
        message: `Your profile submission was rejected. Reason: ${payload.reviewNote || 'No specific note provided.'}`,
        data: { profileId: payload.profileId, approvalId: payload.approvalId, reviewNote: payload.reviewNote }
      });
    }
  });

  // When profile changes requested -> notify employee
  eventBus.subscribeEvent(APP_EVENTS.PROFILE_CHANGES_REQUESTED, async (payload) => {
    const member = await TeamMember.findById(payload.memberId).select('userId name');
    if (member && member.userId) {
      await notificationService.createNotification({
        recipientId: member.userId,
        type: 'CHANGES_REQUESTED',
        title: 'Changes Requested on Profile',
        message: 'The reviewer requested changes before your profile can be published.',
        data: {
          profileId: payload.profileId,
          approvalId: payload.approvalId,
          requestedChanges: payload.requestedChanges,
          reviewNote: payload.reviewNote
        }
      });
    }
  });
};
