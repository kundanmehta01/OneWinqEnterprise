import { eventBus } from '../appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';
import { notificationService } from '../../modules/notifications/notification.service.js';
import { TeamMember } from '../../modules/team-members/teamMember.model.js';
import { User } from '../../modules/users/user.model.js';
import { Role } from '../../modules/roles/role.model.js';
import { Event } from '../../modules/events/event.model.js';
import { SYSTEM_ROLES } from '../../constants/roles.constant.js';
import { logger } from '../../config/logger.config.js';

/** Returns all admin/HR user IDs (excludes the given actorId) */
const getAdminUserIds = async (excludeUserId = null) => {
  const adminRoles = await Role.find({
    name: { $in: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.HR_ADMIN] }
  }).select('_id');
  const adminRoleIds = adminRoles.map((r) => r._id);

  const adminMembers = await TeamMember.find({
    roleId: { $in: adminRoleIds },
    status: 'active',
    isArchived: false
  }).select('userId');

  return adminMembers
    .map((m) => m.userId?.toString())
    .filter((id) => id && id !== excludeUserId?.toString());
};

/** Notify a list of user IDs with the same notification payload */
const notifyMany = async (userIds, payload) => {
  for (const uid of userIds) {
    await notificationService.createNotification({ recipientId: uid, ...payload });
  }
};

/** Resolve userId from payload, optionally looking up the member document */
const resolveUserId = async (payload) => {
  if (payload.userId) return payload.userId;
  if (payload.memberId) {
    const member = await TeamMember.findById(payload.memberId).select('userId');
    return member?.userId;
  }
  return null;
};

export const registerNotificationListeners = () => {
  // Profile submitted → notify admins
  eventBus.subscribeEvent(APP_EVENTS.PROFILE_SUBMITTED, async (payload) => {
    const member = await TeamMember.findById(payload.memberId).select('name');
    const memberName = member?.name || 'A team member';
    const adminIds = await getAdminUserIds();

    await notifyMany(adminIds, {
      type: 'PROFILE_SUBMITTED',
      title: 'Profile Changes Submitted',
      message: `${memberName} submitted profile updates for review.`,
      data: { approvalId: payload.approvalId, memberId: payload.memberId, profileId: payload.profileId }
    });
  });

  // Profile approved → notify employee
  eventBus.subscribeEvent(APP_EVENTS.PROFILE_APPROVED, async (payload) => {
    const recipientId = await resolveUserId(payload);
    if (recipientId) {
      await notificationService.createNotification({
        recipientId,
        type: 'PROFILE_APPROVED',
        title: 'Profile Changes Approved',
        message: 'Your profile changes have been reviewed, approved, and published to your digital profile.',
        data: { profileId: payload.profileId, approvalId: payload.approvalId }
      });
    }
  });

  // Profile rejected → notify employee
  eventBus.subscribeEvent(APP_EVENTS.PROFILE_REJECTED, async (payload) => {
    const recipientId = await resolveUserId(payload);
    if (recipientId) {
      await notificationService.createNotification({
        recipientId,
        type: 'PROFILE_REJECTED',
        title: 'Profile Changes Rejected',
        message: `Your profile submission was rejected. Reason: ${payload.reviewNote || 'No specific note provided.'}`,
        data: { profileId: payload.profileId, approvalId: payload.approvalId, reviewNote: payload.reviewNote }
      });
    }
  });

  // Profile changes requested → notify employee
  eventBus.subscribeEvent(APP_EVENTS.PROFILE_CHANGES_REQUESTED, async (payload) => {
    const recipientId = await resolveUserId(payload);
    if (recipientId) {
      await notificationService.createNotification({
        recipientId,
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

  // Event created → notify all active members except creator
  eventBus.subscribeEvent(APP_EVENTS.EVENT_CREATED, async (payload) => {
    try {
      const creatorId = payload.organizerId || payload.actorId;
      const activeMembers = await TeamMember.find({
        status: 'active',
        userId: { $ne: null }
      }).select('userId').limit(150);

      const recipientIds = activeMembers
        .map((m) => m.userId?.toString())
        .filter((id) => id && id !== creatorId?.toString());

      await notifyMany(recipientIds, {
        type: 'EVENT_CREATED',
        title: `New Event: ${payload.title}`,
        message: `A new event "${payload.title}" has been scheduled. Check details & register now.`,
        data: { eventId: payload.eventId }
      });
    } catch (e) {
      logger.error('Error in EVENT_CREATED notification listener:', e);
    }
  });

  // Event registered → notify user + admins + organizer
  eventBus.subscribeEvent(APP_EVENTS.EVENT_REGISTERED, async (payload) => {
    try {
      const [event, member, user] = await Promise.all([
        Event.findById(payload.eventId).select('title organizer'),
        TeamMember.findOne({ userId: payload.userId }).select('name designation').populate('departmentId', 'name'),
        User.findById(payload.userId).select('email')
      ]);

      const attendeeName = member?.name || user?.email || 'A team member';
      const eventTitle = event?.title || 'Enterprise Event';

      // Notify the registering user
      await notificationService.createNotification({
        recipientId: payload.userId,
        type: 'EVENT_REGISTERED',
        title: `Registration Confirmed: ${eventTitle}`,
        message: `You are registered for "${eventTitle}". Your ticket code is ${payload.ticketCode}.`,
        data: { eventId: payload.eventId, ticketCode: payload.ticketCode }
      });

      // Notify admins + organizer (exclude the registrant)
      const adminIds = await getAdminUserIds(payload.userId);
      const notifySet = new Set(adminIds);
      if (event?.organizer) notifySet.add(event.organizer.toString());
      notifySet.delete(payload.userId.toString());

      await notifyMany([...notifySet], {
        type: 'EVENT_MEMBER_REGISTERED',
        title: `New Event Registration: ${eventTitle}`,
        message: `${attendeeName} has registered for "${eventTitle}" (Ticket: ${payload.ticketCode}).`,
        data: { eventId: payload.eventId, userId: payload.userId, ticketCode: payload.ticketCode }
      });
    } catch (e) {
      logger.error('Error in EVENT_REGISTERED notification listener:', e);
    }
  });

  // Event registration cancelled → notify admins + organizer
  eventBus.subscribeEvent(APP_EVENTS.EVENT_REGISTRATION_CANCELLED, async (payload) => {
    try {
      const [event, member, user] = await Promise.all([
        Event.findById(payload.eventId).select('title organizer'),
        TeamMember.findOne({ userId: payload.userId }).select('name'),
        User.findById(payload.userId).select('email')
      ]);

      const attendeeName = member?.name || user?.email || 'A team member';
      const eventTitle = event?.title || 'Enterprise Event';

      const adminIds = await getAdminUserIds(payload.userId);
      const notifySet = new Set(adminIds);
      if (event?.organizer) notifySet.add(event.organizer.toString());
      notifySet.delete(payload.userId.toString());

      await notifyMany([...notifySet], {
        type: 'EVENT_REGISTRATION_CANCELLED',
        title: `RSVP Cancelled: ${eventTitle}`,
        message: `${attendeeName} cancelled their registration for "${eventTitle}".`,
        data: { eventId: payload.eventId, userId: payload.userId }
      });
    } catch (e) {
      logger.error('Error in EVENT_REGISTRATION_CANCELLED listener:', e);
    }
  });

  // New member joined → notify admins
  eventBus.subscribeEvent(APP_EVENTS.MEMBER_JOINED, async (payload) => {
    try {
      const adminIds = await getAdminUserIds();
      await notifyMany(adminIds, {
        type: 'MEMBER_JOINED',
        title: 'New Team Member Onboarded',
        message: `${payload.name || 'A new colleague'} (${payload.email}) accepted their invitation and joined the platform.`,
        data: { memberId: payload.memberId, userId: payload.userId }
      });
    } catch (_) {}
  });

  // Card linked → notify the member
  eventBus.subscribeEvent(APP_EVENTS.CARD_LINKED, async (payload) => {
    try {
      const member = await TeamMember.findById(payload.memberId).select('userId');
      if (member?.userId) {
        await notificationService.createNotification({
          recipientId: member.userId,
          type: 'CARD_LINKED',
          title: 'Physical Smart Card Linked',
          message: `NFC Smart Card (UID: ${payload.cardUid}) has been linked to your digital identity profile.`,
          data: { cardId: payload.cardId, cardUid: payload.cardUid }
        });
      }
    } catch (_) {}
  });

  // Connection requested → notify recipient
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
    } catch (_) {}
  });

  // Connection accepted → notify requester
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
    } catch (_) {}
  });
};
