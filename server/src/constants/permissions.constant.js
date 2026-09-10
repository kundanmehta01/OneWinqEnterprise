export const PERMISSIONS = {
  // Team Members
  TEAM_READ: 'team.read',
  TEAM_CREATE: 'team.create',
  TEAM_UPDATE: 'team.update',
  TEAM_DELETE: 'team.delete',

  // Departments
  DEPARTMENT_READ: 'department.read',
  DEPARTMENT_CREATE: 'department.create',
  DEPARTMENT_UPDATE: 'department.update',
  DEPARTMENT_DELETE: 'department.delete',

  // Company Profile
  COMPANY_PROFILE_READ: 'company_profile.read',
  COMPANY_PROFILE_UPDATE: 'company_profile.update',

  // Employee Profile Management
  EMPLOYEE_PROFILE_READ: 'employee_profile.read',
  EMPLOYEE_PROFILE_UPDATE: 'employee_profile.update',

  // Templates
  TEMPLATE_READ: 'template.read',
  TEMPLATE_CREATE: 'template.create',
  TEMPLATE_UPDATE: 'template.update',
  TEMPLATE_DELETE: 'template.delete',

  // Profile Approvals
  PROFILE_APPROVAL_READ: 'profile_approval.read',
  PROFILE_APPROVAL_APPROVE: 'profile_approval.approve',
  PROFILE_APPROVAL_REJECT: 'profile_approval.reject',
  PROFILE_APPROVAL_REQUEST_CHANGES: 'profile_approval.request_changes',

  // Invitations
  INVITATION_READ: 'invitation.read',
  INVITATION_CREATE: 'invitation.create',
  INVITATION_RESEND: 'invitation.resend',
  INVITATION_CANCEL: 'invitation.cancel',

  // Roles & Permissions
  ROLE_READ: 'role.read',
  ROLE_CREATE: 'role.create',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',

  // Analytics & Dashboard
  ANALYTICS_READ: 'analytics.read',
  DASHBOARD_READ: 'dashboard.read',

  // Organization Settings
  SETTINGS_READ: 'settings.read',
  SETTINGS_UPDATE: 'settings.update',

  // File / Media Upload
  MEDIA_UPLOAD: 'media.upload',

  // Enterprise Events
  EVENT_READ: 'event.read',
  EVENT_CREATE: 'event.create',
  EVENT_UPDATE: 'event.update',
  EVENT_DELETE: 'event.delete',

  // Smart & Physical NFC Cards
  CARD_READ: 'card.read',
  CARD_CREATE: 'card.create',
  CARD_UPDATE: 'card.update',
  CARD_DELETE: 'card.delete',
  CARD_LINK: 'card.link',
  CARD_UNLINK: 'card.unlink'
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);
