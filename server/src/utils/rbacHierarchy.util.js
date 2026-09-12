import { ForbiddenError } from '../errors/index.js';
import { ERROR_CODES } from '../constants/errorCodes.constant.js';
import { SYSTEM_ROLES } from '../constants/roles.constant.js';

/**
 * Generic Role Hierarchy and Capability Protection Utility
 *
 * Tiers:
 * - Tier 1: Super Admin (Rank 100) - Unrestricted root authority
 * - Tier 2: Admin (Rank 80) - Broad organization admin
 * - Tier 3: Functional Admins (Rank 50) - e.g. HR Admin, Content Admin, Event Manager, Team Lead, etc.
 * - Tier 4: Normal Users (Rank 10) - e.g. Employee, Viewer, Guest
 */

export const ROLE_RANKS = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  FUNCTIONAL_ADMIN: 50,
  NORMAL_USER: 10
};

/**
 * Computes the numerical hierarchy rank of a role.
 * @param {Object|string} role - Role document, role object, or role name string
 * @returns {number} Rank value
 */
export const getRoleRank = (role) => {
  if (!role) return ROLE_RANKS.NORMAL_USER;

  const roleName = typeof role === 'string' ? role : (role.name || '');
  const roleSlug = typeof role === 'string' ? role.toLowerCase() : (role.slug || roleName.toLowerCase());
  const permissions = Array.isArray(role.permissions) ? role.permissions : [];

  if (
    roleName === SYSTEM_ROLES.SUPER_ADMIN ||
    roleSlug === 'super-admin' ||
    roleSlug === 'super_admin'
  ) {
    return ROLE_RANKS.SUPER_ADMIN;
  }

  if (
    roleName === SYSTEM_ROLES.ADMIN ||
    roleSlug === 'admin'
  ) {
    return ROLE_RANKS.ADMIN;
  }

  // Functional admin if role possesses any administrative / management permissions
  const hasAdminPerms = permissions.some((p) =>
    p.startsWith('team.') ||
    p.startsWith('invitation.') ||
    p.startsWith('profile_approval.') ||
    p.startsWith('role.') ||
    p.startsWith('settings.') ||
    p.startsWith('analytics.') ||
    p.startsWith('card.') ||
    p.startsWith('company_profile.update') ||
    p.startsWith('department.create') ||
    p.startsWith('department.update') ||
    p.startsWith('department.delete')
  );

  if (
    hasAdminPerms ||
    roleName === SYSTEM_ROLES.HR_ADMIN ||
    roleName === SYSTEM_ROLES.CONTENT_ADMIN ||
    roleSlug.includes('admin') ||
    roleSlug.includes('lead') ||
    roleSlug.includes('manager')
  ) {
    return ROLE_RANKS.FUNCTIONAL_ADMIN;
  }

  return ROLE_RANKS.NORMAL_USER;
};

/**
 * Asserts whether an actor is authorized to assign a target role to a user.
 *
 * Universal Mathematical Rule:
 * 1. Super Admin can assign any role.
 * 2. Non-Super-Admins can NEVER assign Super Admin or Admin roles.
 * 3. Non-Super-Admins can only assign roles whose permissions are a STRICT SUBSET of the actor's permissions.
 * 4. Non-Super-Admins can only assign roles whose rank is strictly less than or equal to their own.
 *
 * @param {Object} actorContext - { actorId, isSuperAdmin, roleName, permissions }
 * @param {Object} targetRole - Role document to be assigned
 */
export const assertCanAssignRole = (actorContext = {}, targetRole) => {
  if (!targetRole) return;

  // Super Admin has unrestricted role delegation authority
  if (actorContext.isSuperAdmin || actorContext.roleName === SYSTEM_ROLES.SUPER_ADMIN) {
    return;
  }

  const targetRank = getRoleRank(targetRole);

  // Non-Super-Admins cannot assign Super Admin or Admin roles
  if (targetRank >= ROLE_RANKS.ADMIN) {
    throw new ForbiddenError(
      `You do not have sufficient authority to assign the privileged role '${targetRole.name}'. Only Super Administrators can grant administrative roles.`,
      ERROR_CODES.INSUFFICIENT_PERMISSIONS
    );
  }

  const actorRank = getRoleRank({ name: actorContext.roleName, permissions: actorContext.permissions });

  if (targetRank > actorRank) {
    throw new ForbiddenError(
      `Privilege Escalation Blocked: You cannot assign a role with higher authority ('${targetRole.name}') than your own.`,
      ERROR_CODES.INSUFFICIENT_PERMISSIONS
    );
  }

  // Permission subset validation: Target role cannot grant ANY permission the actor does not hold
  const actorPermissionsSet = new Set(actorContext.permissions || []);
  const targetPermissions = Array.isArray(targetRole.permissions) ? targetRole.permissions : [];

  const unheldPermissions = targetPermissions.filter((perm) => !actorPermissionsSet.has(perm));

  if (unheldPermissions.length > 0) {
    throw new ForbiddenError(
      `Privilege Escalation Blocked: Target role '${targetRole.name}' grants capabilities you do not possess: [${unheldPermissions.join(', ')}].`,
      ERROR_CODES.INSUFFICIENT_PERMISSIONS
    );
  }
};

/**
 * Asserts whether an actor is authorized to modify, deactivate, or delete a target team member.
 *
 * Universal Mathematical Rule:
 * 1. Super Admin can mutate any account.
 * 2. Non-Super-Admins CANNOT mutate, deactivate, or delete a Super Admin account.
 * 3. Non-Super-Admins CANNOT mutate an account with equal or higher hierarchy rank than themselves.
 * 4. Users cannot modify their own role / elevation via member mutation endpoints.
 *
 * @param {Object} actorContext - { actorId, isSuperAdmin, roleName, permissions }
 * @param {Object} targetMember - TeamMember document to be mutated (populated with roleId)
 */
export const assertCanMutateMember = (actorContext = {}, targetMember) => {
  if (!targetMember) return;

  // Super Admin can mutate any account
  if (actorContext.isSuperAdmin || actorContext.roleName === SYSTEM_ROLES.SUPER_ADMIN) {
    return;
  }

  const targetRole = targetMember.roleId || {};
  const targetRank = getRoleRank(targetRole);

  // Prevent modifying Super Admin or root accounts
  if (
    targetRank >= ROLE_RANKS.SUPER_ADMIN ||
    targetRole.name === SYSTEM_ROLES.SUPER_ADMIN ||
    targetMember.isSystem === true
  ) {
    throw new ForbiddenError(
      'Access Denied: Super Administrator accounts are protected and cannot be modified or deleted by non-super-administrators.',
      ERROR_CODES.INSUFFICIENT_PERMISSIONS
    );
  }

  const actorRank = getRoleRank({ name: actorContext.roleName, permissions: actorContext.permissions });

  // Cannot modify an account with equal or higher rank (unless actor is Super Admin)
  if (targetRank >= actorRank && String(targetMember.userId) !== String(actorContext.actorId)) {
    // If target is Admin tier and actor is functional admin
    if (targetRank >= ROLE_RANKS.ADMIN) {
      throw new ForbiddenError(
        `Access Denied: You cannot modify or delete administrative account '${targetMember.name}'.`,
        ERROR_CODES.INSUFFICIENT_PERMISSIONS
      );
    }
  }
};

/**
 * Asserts whether an actor is authorized to create or update a custom role definition.
 *
 * @param {Object} actorContext - { actorId, isSuperAdmin, roleName, permissions }
 * @param {string[]} requestedPermissions - Array of permission strings for the role
 */
export const assertCanDefineRole = (actorContext = {}, requestedPermissions = []) => {
  if (actorContext.isSuperAdmin || actorContext.roleName === SYSTEM_ROLES.SUPER_ADMIN) {
    return;
  }

  const actorPermissionsSet = new Set(actorContext.permissions || []);
  const unheld = requestedPermissions.filter((p) => !actorPermissionsSet.has(p));

  if (unheld.length > 0) {
    throw new ForbiddenError(
      `Privilege Escalation Blocked: You cannot create or modify a role with permissions you do not hold: [${unheld.join(', ')}].`,
      ERROR_CODES.INSUFFICIENT_PERMISSIONS
    );
  }
};
