import { Role } from '../modules/roles/role.model.js';
import { SYSTEM_ROLES, DEFAULT_ROLE_PERMISSIONS } from '../constants/roles.constant.js';
import { PERMISSIONS } from '../constants/permissions.constant.js';
import { logger } from '../config/logger.config.js';

export const seedRoles = async () => {
  logger.info('Seeding system and custom roles...');

  const rolesToSeed = [
    {
      name: SYSTEM_ROLES.SUPER_ADMIN,
      slug: 'super-admin',
      description: 'Full access to all modules and settings',
      permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.SUPER_ADMIN],
      isSystem: true,
      isActive: true
    },
    {
      name: SYSTEM_ROLES.ADMIN,
      slug: 'admin',
      description: 'Comprehensive administrative control across organization operations',
      permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.ADMIN],
      isSystem: true,
      isActive: true
    },
    {
      name: SYSTEM_ROLES.HR_ADMIN,
      slug: 'hr-admin',
      description: 'Manage people, departments, invitations and approvals',
      permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.HR_ADMIN],
      isSystem: false,
      isActive: true
    },
    {
      name: SYSTEM_ROLES.CONTENT_ADMIN,
      slug: 'content-admin',
      description: 'Manage content, templates, media and company profile',
      permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.CONTENT_ADMIN],
      isSystem: false,
      isActive: true
    },
    {
      name: SYSTEM_ROLES.EMPLOYEE,
      slug: 'employee',
      description: 'Standard team member with employee portal, directory, events, and networking access',
      permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.EMPLOYEE],
      isSystem: true,
      isActive: true
    },
    {
      name: 'Team Lead',
      slug: 'team-lead',
      description: 'Team lead with team inspection, events and profile approval review',
      permissions: [
        PERMISSIONS.DASHBOARD_READ,
        PERMISSIONS.TEAM_READ,
        PERMISSIONS.PROFILE_APPROVAL_READ,
        PERMISSIONS.EVENT_READ,
        PERMISSIONS.EVENT_CREATE
      ],
      isSystem: false,
      isActive: true
    },
    {
      name: 'Viewer',
      slug: 'viewer',
      description: 'View-only access to members and profiles',
      permissions: [
        PERMISSIONS.DEPARTMENT_READ,
        PERMISSIONS.TEMPLATE_READ,
        PERMISSIONS.COMPANY_PROFILE_READ,
        PERMISSIONS.EVENT_READ
      ],
      isSystem: true,
      isActive: true
    }
  ];

  for (const roleData of rolesToSeed) {
    await Role.findOneAndUpdate({ slug: roleData.slug }, roleData, { upsert: true, new: true });
  }

  logger.info(`✅ Seeded ${rolesToSeed.length} system & custom roles successfully.`);
};


