import { ForbiddenError } from '../errors/index.js';
import { ERROR_CODES } from '../constants/errorCodes.constant.js';
import { SYSTEM_ROLES } from '../constants/roles.constant.js';

/**
 * Enforces RBAC permissions on routes
 * @param {string|string[]} required - Single permission string or array of permissions (all required)
 */
export const requirePermission = (required) => {
  const requiredPermissions = Array.isArray(required) ? required : [required];

  return (req, res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('Authentication required before authorization check'));
    }

    // Super Admin bypasses all individual permission checks
    if (req.isSuperAdmin || req.roleName === SYSTEM_ROLES.SUPER_ADMIN) {
      return next();
    }

    const userPermissions = new Set(req.permissions || []);
    const hasAll = requiredPermissions.every((perm) => userPermissions.has(perm));

    if (!hasAll) {
      const missing = requiredPermissions.filter((perm) => !userPermissions.has(perm));
      return next(
        new ForbiddenError(
          `You do not have permission to perform this action. Missing: ${missing.join(', ')}`,
          ERROR_CODES.INSUFFICIENT_PERMISSIONS
        )
      );
    }

    return next();
  };
};

export const requireSuperAdmin = () => {
  return (req, res, next) => {
    if (!req.isSuperAdmin && req.roleName !== SYSTEM_ROLES.SUPER_ADMIN) {
      return next(
        new ForbiddenError(
          'This action is restricted exclusively to Super Administrators',
          ERROR_CODES.INSUFFICIENT_PERMISSIONS
        )
      );
    }
    return next();
  };
};
