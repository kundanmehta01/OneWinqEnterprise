export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ACCEPT_INVITATION: '/accept-invitation',

  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    COMPANY_PROFILE: '/admin/company-profile',
    TEAM_MEMBERS: '/admin/team-members',
    DEPARTMENTS: '/admin/departments',
    EMPLOYEE_PROFILES: '/admin/employee-profiles',
    INVITATIONS: '/admin/invitations',
    ROLES: '/admin/roles',
    PERMISSIONS: '/admin/permissions',
    TEMPLATES: '/admin/templates',
    PROFILE_APPROVALS: '/admin/profile-approvals',
    ANALYTICS: '/admin/analytics',
    AUDIT_LOGS: '/admin/audit-logs',
    NOTIFICATIONS: '/admin/notifications',
    SETTINGS: '/admin/settings',
  },

  USER: {
    ROOT: '/me',
    DASHBOARD: '/me/dashboard',
    PROFILE: '/me/profile',
    NOTIFICATIONS: '/me/notifications'
  },

  PUBLIC: {
    COMPANY: '/p/company',
    PROFILE: (slug) => `/p/${slug}`
  }
};
