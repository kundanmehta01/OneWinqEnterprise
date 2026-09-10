export const ROLE_KEYS = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  HR_ADMIN: 'HR_ADMIN',
  CONTENT_ADMIN: 'CONTENT_ADMIN',
  EMPLOYEE: 'EMPLOYEE',
  TEAM_MEMBER: 'TEAM_MEMBER',
  MANAGER: 'MANAGER',
  USER: 'USER',
  NORMAL_USER: 'NORMAL_USER'
};

const ROLE_ALIASES = {
  SUPERADMIN: ROLE_KEYS.SUPER_ADMIN,
  'SUPER ADMIN': ROLE_KEYS.SUPER_ADMIN,
  ADMINISTRATOR: ROLE_KEYS.ADMIN,
  'HR ADMIN': ROLE_KEYS.HR_ADMIN,
  'CONTENT ADMIN': ROLE_KEYS.CONTENT_ADMIN,
  'TEAM MEMBER': ROLE_KEYS.TEAM_MEMBER,
  'TEAM LEAD': ROLE_KEYS.TEAM_MEMBER,
  MEMBER: ROLE_KEYS.TEAM_MEMBER,
  NORMALUSER: ROLE_KEYS.NORMAL_USER,
  'NORMAL USER': ROLE_KEYS.NORMAL_USER
};

export const normalizeRole = (value) => {
  if (!value) return null;
  const roleValue = typeof value === 'object' ? value.name || value.code : value;
  const normalized = String(roleValue).trim().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').toUpperCase();
  return ROLE_ALIASES[normalized] || normalized.replace(/ /g, '_');
};

export const getRoleFromAuthData = (data = {}) =>
  normalizeRole(
    data.role ||
      data.user?.role ||
      data.member?.roleId?.name ||
      data.member?.roleId ||
      data.member?.role
  ) || ROLE_KEYS.EMPLOYEE;

export const isSuperAdminRole = (role) => normalizeRole(role) === ROLE_KEYS.SUPER_ADMIN;

export const getDashboardPath = (role) => {
  switch (normalizeRole(role)) {
    case ROLE_KEYS.SUPER_ADMIN:
      return '/super-admin/dashboard';
    case ROLE_KEYS.EMPLOYEE:
      return '/employee/dashboard';
    case ROLE_KEYS.TEAM_MEMBER:
      return '/team/dashboard';
    case ROLE_KEYS.MANAGER:
      return '/manager/dashboard';
    default:
      return '/dashboard';
  }
};

export const getUserDisplayName = (user, member) =>
  user?.name || member?.name || user?.email?.split('@')[0] || 'User';
