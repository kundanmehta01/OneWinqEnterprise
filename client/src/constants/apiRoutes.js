export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    ME: '/auth/me'
  },

  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    TEAM: '/admin/team',
    DEPARTMENTS: '/admin/departments',
    ROLES: '/admin/roles',
    PERMISSIONS: '/admin/permissions',
    PERMISSIONS_BY_MODULE: '/admin/permissions/by-module',
    TEMPLATES: '/admin/templates',
    APPROVALS: '/admin/approvals',
    INVITATIONS: '/admin/invitations',
    ANALYTICS: '/admin/analytics',
    AUDIT_LOGS: '/admin/audit-logs',
    COMPANY_PROFILE: '/admin/company-profile',
    SETTINGS: '/admin/settings',
    MEDIA: '/admin/media'
  },

  // User / Employee self-service
  ME: {
    PROFILE: '/me/profile',
    SUBMIT_PROFILE: '/me/profile/submit',
    PROFILE_STATUS: '/me/profile/status',
    NOTIFICATIONS: '/me/notifications',
    NOTIFICATIONS_UNREAD: '/me/notifications/unread-count',
    NOTIFICATIONS_MARK_ALL: '/me/notifications/mark-all-read'
  },

  // Public
  PUBLIC: {
    COMPANY: '/public/company',
    PROFILES: '/public/profiles',
    EVENTS: '/public/events',
    INVITATIONS_VERIFY: '/invitations/verify',
    INVITATIONS_ACCEPT: '/invitations/accept'
  }
};
