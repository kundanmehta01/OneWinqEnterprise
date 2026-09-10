import { eventBus } from '../appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';
import { notificationService } from '../../modules/notifications/notification.service.js';
import { TeamMember } from '../../modules/team-members/teamMember.model.js';
import { User } from '../../modules/users/user.model.js';
import { Role } from '../../modules/roles/role.model.js';
import { Event } from '../../modules/events/event.model.js';
import { SYSTEM_ROLES } from '../../constants/roles.constant.js';
import { logger } from '../../config/logger.config.js';

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
    let recipientUserId = payload.userId;
    if (!recipientUserId && payload.memberId) {
      const member = await TeamMember.findById(payload.memberId).select('userId name');
      recipientUserId = member?.userId;
    }
    if (recipientUserId) {
      await notificationService.createNotification({
        recipientId: recipientUserId,
        type: 'PROFILE_APPROVED',
        title: 'Profile Changes Approved',
        message: 'Your profile changes have been reviewed, approved, and published to your digital profile.',
        data: { profileId: payload.profileId, approvalId: payload.approvalId }
      });
    }
  });

  // When profile is rejected -> notify employee
  eventBus.subscribeEvent(APP_EVENTS.PROFILE_REJECTED, async (payload) => {
    let recipientUserId = payload.userId;
    if (!recipientUserId && payload.memberId) {
      const member = await TeamMember.findById(payload.memberId).select('userId name');
      recipientUserId = member?.userId;
    }
    if (recipientUserId) {
      await notificationService.createNotification({
        recipientId: recipientUserId,
        type: 'PROFILE_REJECTED',
        title: 'Profile Changes Rejected',
        message: `Your profile submission was rejected. Reason: ${payload.reviewNote || 'No specific note provided.'}`,
        data: { profileId: payload.profileId, approvalId: payload.approvalId, reviewNote: payload.reviewNote }
      });
    }
  });

  // When profile changes requested -> notify employee
  eventBus.subscribeEvent(APP_EVENTS.PROFILE_CHANGES_REQUESTED, async (payload) => {
    let recipientUserId = payload.userId;
    if (!recipientUserId && payload.memberId) {
      const member = await TeamMember.findById(payload.memberId).select('userId name');
      recipientUserId = member?.userId;
    }
    if (recipientUserId) {
      await notificationService.createNotification({
        recipientId: recipientUserId,
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

  // When a new event is created -> notify active team members
  eventBus.subscribeEvent(APP_EVENTS.EVENT_CREATED, async (payload) => {
    try {
      const activeMembers = await TeamMember.find({
        status: 'active',
        userId: { $ne: null }
      }).select('userId').limit(150);

      const creatorId = payload.organizerId || payload.actorId;

      for (const m of activeMembers) {
        if (m.userId && String(m.userId) !== String(creatorId)) {
          await notificationService.createNotification({
            recipientId: m.userId,
            type: 'EVENT_CREATED',
            title: `New Event: ${payload.title}`,
            message: `A new event "${payload.title}" has been scheduled. Check details & register now.`,
            data: { eventId: payload.eventId }
          });
        }
      }
    } catch (e) {
      logger.error('Error in EVENT_CREATED notification listener:', e);
    }
  });

  // When a user registers for an event -> notify user and notify admins
  eventBus.subscribeEvent(APP_EVENTS.EVENT_REGISTERED, async (payload) => {
    try {
      const [event, member, user] = await Promise.all([
        Event.findById(payload.eventId).select('title organizer'),
        TeamMember.findOne({ userId: payload.userId }).select('name designation departmentId').populate('departmentId', 'name'),
        User.findById(payload.userId).select('email')
      ]);

      const attendeeName = member?.name || user?.email || 'A team member';
      const eventTitle = event?.title || 'Enterprise Event';

      // 1. Notify the registering user
      await notificationService.createNotification({
        recipientId: payload.userId,
        type: 'EVENT_REGISTERED',
        title: `Registration Confirmed: ${eventTitle}`,
        message: `You are registered for "${eventTitle}". Your ticket code is ${payload.ticketCode}.`,
        data: { eventId: payload.eventId, ticketCode: payload.ticketCode }
      });

      // 2. Notify Admins & SuperAdmins
      const adminRoles = await Role.find({
        name: { $in: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.HR_ADMIN] }
      }).select('_id');
      const adminRoleIds = adminRoles.map((r) => r._id);

      const adminMembers = await TeamMember.find({
        roleId: { $in: adminRoleIds },
        status: 'active'
      }).select('userId');

      const notifyUserIds = new Set(adminMembers.map((a) => a.userId?.toString()).filter(Boolean));
      if (event?.organizer) notifyUserIds.add(event.organizer.toString());
      notifyUserIds.delete(payload.userId.toString());

      for (const adminUserId of notifyUserIds) {
        await notificationService.createNotification({
          recipientId: adminUserId,
          type: 'EVENT_MEMBER_REGISTERED',
          title: `New Event Registration: ${eventTitle}`,
          message: `${attendeeName} has registered for "${eventTitle}" (Ticket: ${payload.ticketCode}).`,
          data: {
            eventId: payload.eventId,
            userId: payload.userId,
            ticketCode: payload.ticketCode
          }
        });
      }
    } catch (e) {
      logger.error('Error in EVENT_REGISTERED notification listener:', e);
    }
  });

  // When a user cancels event registration -> notify admins
  eventBus.subscribeEvent(APP_EVENTS.EVENT_REGISTRATION_CANCELLED, async (payload) => {
    try {
      const [event, member, user] = await Promise.all([
        Event.findById(payload.eventId).select('title organizer'),
        TeamMember.findOne({ userId: payload.userId }).select('name'),
        User.findById(payload.userId).select('email')
      ]);

      const attendeeName = member?.name || user?.email || 'A team member';
      const eventTitle = event?.title || 'Enterprise Event';

      const adminRoles = await Role.find({
        name: { $in: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.HR_ADMIN] }
      }).select('_id');
      const adminRoleIds = adminRoles.map((r) => r._id);

      const adminMembers = await TeamMember.find({
        roleId: { $in: adminRoleIds },
        status: 'active'
      }).select('userId');

      const notifyUserIds = new Set(adminMembers.map((a) => a.userId?.toString()).filter(Boolean));
      if (event?.organizer) notifyUserIds.add(event.organizer.toString());
      notifyUserIds.delete(payload.userId.toString());

      for (const adminUserId of notifyUserIds) {
        await notificationService.createNotification({
          recipientId: adminUserId,
          type: 'EVENT_REGISTRATION_CANCELLED',
          title: `RSVP Cancelled: ${eventTitle}`,
          message: `${attendeeName} cancelled their registration for "${eventTitle}".`,
          data: {
            eventId: payload.eventId,
            userId: payload.userId
          }
        });
      }
    } catch (e) {
      logger.error('Error in EVENT_REGISTRATION_CANCELLED listener:', e);
    }
  });

  // When a new member joins -> notify admins
  eventBus.subscribeEvent(APP_EVENTS.MEMBER_JOINED, async (payload) => {
    try {
      const adminRoles = await Role.find({
        name: { $in: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.HR_ADMIN] }
      }).select('_id');
      const adminRoleIds = adminRoles.map((r) => r._id);

      const adminMembers = await TeamMember.find({
        roleId: { $in: adminRoleIds },
        status: 'active',
        isArchived: false
      }).select('userId');

      for (const adm of adminMembers) {
        if (adm.userId) {
          await notificationService.createNotification({
            recipientId: adm.userId,
            type: 'MEMBER_JOINED',
            title: 'New Team Member Onboarded',
            message: `${payload.name || 'A new colleague'} (${payload.email}) accepted their invitation and joined the platform.`,
            data: { memberId: payload.memberId, userId: payload.userId }
          });
        }
      }
    } catch (e) {}
  });

  // When a smart NFC card is linked -> notify the member
  eventBus.subscribeEvent(APP_EVENTS.CARD_LINKED, async (payload) => {
    try {
      const member = await TeamMember.findById(payload.memberId).select('userId name');
      if (member && member.userId) {
        await notificationService.createNotification({
          recipientId: member.userId,
          type: 'CARD_LINKED',
          title: 'Physical Smart Card Linked',
          message: `NFC Smart Card (UID: ${payload.cardUid}) has been linked to your digital identity profile.`,
          data: { cardId: payload.cardId, cardUid: payload.cardUid }
        });
      }
    } catch (e) {}
  });

  // When a connection request is sent -> notify recipient
  eventBus.subscribeEvent(APP_EVENTS.CONNECTION_REQUESTED, async (payload) => {
    try {
      if (payload.recipientId) {
        await notificationService.createNotification({
          recipientId: payload.recipientId,
          type: 'CONNECTION_REQUESTED',
          title: 'New Connection Request',
          message: `${payload.requesterName || 'A colleague'} sent you a connection request.`,
          data: { connectionId: payload.connectionId, requesterId: payload.requesterId }
        });
      }
    } catch (e) {}
  });

  // When a connection request is accepted -> notify requester
  eventBus.subscribeEvent(APP_EVENTS.CONNECTION_ACCEPTED, async (payload) => {
    try {
      if (payload.requesterId) {
        await notificationService.createNotification({
          recipientId: payload.requesterId,
          type: 'CONNECTION_ACCEPTED',
          title: 'Connection Accepted',
          message: `${payload.recipientName || 'Your colleague'} accepted your connection request.`,
          data: { connectionId: payload.connectionId }
        });
      }
    } catch (e) {}
  });
};
