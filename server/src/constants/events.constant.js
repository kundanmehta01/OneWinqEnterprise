export const APP_EVENTS = {
  // Auth & Identity
  USER_LOGGED_IN: 'user.logged_in',
  USER_PASSWORD_RESET_REQUESTED: 'user.password_reset_requested',
  USER_PASSWORD_RESET: 'user.password_reset',
  USER_EMAIL_VERIFIED: 'user.email_verified',

  // Team & Invitations
  MEMBER_INVITED: 'member.invited',
  MEMBER_INVITATION_RESENT: 'member.invitation_resent',
  MEMBER_INVITATION_CANCELLED: 'member.invitation_cancelled',
  MEMBER_JOINED: 'member.joined',
  MEMBER_UPDATED: 'member.updated',
  MEMBER_ARCHIVED: 'member.archived',
  MEMBER_RESTORED: 'member.restored',
  MEMBER_DELETED: 'member.deleted',

  // Roles & Departments
  ROLE_CREATED: 'role.created',
  ROLE_UPDATED: 'role.updated',
  ROLE_DELETED: 'role.deleted',
  DEPARTMENT_CREATED: 'department.created',
  DEPARTMENT_UPDATED: 'department.updated',
  DEPARTMENT_ARCHIVED: 'department.archived',

  // Company Profile
  COMPANY_PROFILE_UPDATED: 'company_profile.updated',

  // Employee Profile & Approvals
  PROFILE_DRAFT_UPDATED: 'profile.draft_updated',
  PROFILE_SUBMITTED: 'profile.submitted',
  PROFILE_APPROVED: 'profile.approved',
  PROFILE_REJECTED: 'profile.rejected',
  PROFILE_CHANGES_REQUESTED: 'profile.changes_requested',

  // Templates
  TEMPLATE_CREATED: 'template.created',
  TEMPLATE_UPDATED: 'template.updated',
  TEMPLATE_DELETED: 'template.deleted',

  // Settings
  SETTINGS_UPDATED: 'settings.updated',

  // Analytics & Media
  ANALYTICS_EVENT_RECORDED: 'analytics.event_recorded',
  MEDIA_UPLOADED: 'media.uploaded',
  MEDIA_DELETED: 'media.deleted',

  // Networking & Connections
  CONNECTION_REQUESTED: 'connection.requested',
  CONNECTION_ACCEPTED: 'connection.accepted',
  CONNECTION_DECLINED: 'connection.declined',
  CONNECTION_REMOVED: 'connection.removed',

  // Enterprise Events
  EVENT_CREATED: 'event.created',
  EVENT_UPDATED: 'event.updated',
  EVENT_CANCELLED: 'event.cancelled',
  EVENT_REGISTERED: 'event.registered',
  EVENT_REGISTRATION_CANCELLED: 'event.registration_cancelled',

  // Support & Helpdesk
  SUPPORT_TICKET_CREATED: 'support.ticket_created',
  SUPPORT_TICKET_UPDATED: 'support.ticket_updated'
};
