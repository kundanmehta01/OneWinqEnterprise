import { Role } from '../modules/roles/role.model.js';
import { SYSTEM_ROLES, DEFAULT_ROLE_PERMISSIONS } from '../constants/roles.constant.js';
import { logger } from '../config/logger.config.js';

export const seedRoles = async () => {
  logger.info('Seeding system roles...');

  const rolesToSeed = [
    {
      name: SYSTEM_ROLES.SUPER_ADMIN,
      slug: 'super-admin',
      description: 'Unrestricted access to all organization and system controls',
      permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.SUPER_ADMIN],
      isSystem: true,
      isActive: true
    },
    {
      name: SYSTEM_ROLES.ADMIN,
      slug: 'admin',
      description: 'Organization administrator with comprehensive management permissions',
      permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.ADMIN],
      isSystem: true,
      isActive: true
    },
    {
      name: SYSTEM_ROLES.HR_ADMIN,
      slug: 'hr-admin',
      description: 'Human Resources admin for team member management and invitations',
      permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.HR_ADMIN],
      isSystem: true,
      isActive: true
    },
    {
      name: SYSTEM_ROLES.CONTENT_ADMIN,
      slug: 'content-admin',
      description: 'Content administrator for company profile, templates, and profile reviews',
      permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.CONTENT_ADMIN],
      isSystem: true,
      isActive: true
    },
    {
      name: SYSTEM_ROLES.EMPLOYEE,
      slug: 'employee',
      description: 'Standard employee identity with access to personal profile management',
      permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.EMPLOYEE],
      isSystem: true,
      isActive: true
    }
  ];

  for (const roleData of rolesToSeed) {
    await Role.findOneAndUpdate({ slug: roleData.slug }, roleData, { upsert: true, new: true });
  }

  logger.info(`✅ Seeded ${rolesToSeed.length} system roles successfully.`);
};
