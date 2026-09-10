import { Role } from '../modules/roles/role.model.js';
import { SYSTEM_ROLES } from '../constants/roles.constant.js';
import { ALL_PERMISSIONS, PERMISSIONS } from '../constants/permissions.constant.js';
import { logger } from '../config/logger.config.js';

export const seedRoles = async () => {
  logger.info('Seeding system and custom roles...');

  // All active permissions (dot notation)
  const allPerms = ALL_PERMISSIONS;

  const rolesToSeed = [
    {
      name: 'Super Admin',
      slug: 'super-admin',
      description: 'Full access to all modules and settings',
      permissions: allPerms,
      isSystem: true,
      isActive: true
    },
    {
      name: 'Admin',
      slug: 'admin',
      description: 'Comprehensive administrative control across organization operations',
      permissions: [
        PERMISSIONS.DASHBOARD_READ,
        PERMISSIONS.TEAM_READ, PERMISSIONS.TEAM_CREATE, PERMISSIONS.TEAM_UPDATE, PERMISSIONS.TEAM_DELETE,
        PERMISSIONS.DEPARTMENT_READ, PERMISSIONS.DEPARTMENT_CREATE, PERMISSIONS.DEPARTMENT_UPDATE, PERMISSIONS.DEPARTMENT_DELETE,
        PERMISSIONS.COMPANY_PROFILE_READ, PERMISSIONS.COMPANY_PROFILE_UPDATE,
        PERMISSIONS.EMPLOYEE_PROFILE_READ, PERMISSIONS.EMPLOYEE_PROFILE_UPDATE,
        PERMISSIONS.TEMPLATE_READ, PERMISSIONS.TEMPLATE_CREATE, PERMISSIONS.TEMPLATE_UPDATE, PERMISSIONS.TEMPLATE_DELETE,
        PERMISSIONS.PROFILE_APPROVAL_READ, PERMISSIONS.PROFILE_APPROVAL_APPROVE, PERMISSIONS.PROFILE_APPROVAL_REJECT, PERMISSIONS.PROFILE_APPROVAL_REQUEST_CHANGES,
        PERMISSIONS.INVITATION_READ, PERMISSIONS.INVITATION_CREATE, PERMISSIONS.INVITATION_RESEND, PERMISSIONS.INVITATION_CANCEL,
        PERMISSIONS.ROLE_READ, PERMISSIONS.ROLE_CREATE, PERMISSIONS.ROLE_UPDATE,
        PERMISSIONS.ANALYTICS_READ,
        PERMISSIONS.SETTINGS_READ, PERMISSIONS.SETTINGS_UPDATE,
        PERMISSIONS.MEDIA_UPLOAD,
        PERMISSIONS.EVENT_READ, PERMISSIONS.EVENT_CREATE, PERMISSIONS.EVENT_UPDATE, PERMISSIONS.EVENT_DELETE,
        PERMISSIONS.CARD_READ, PERMISSIONS.CARD_CREATE, PERMISSIONS.CARD_UPDATE, PERMISSIONS.CARD_DELETE, PERMISSIONS.CARD_LINK, PERMISSIONS.CARD_UNLINK
      ],
      isSystem: true,
      isActive: true
    },
    {
      name: 'HR Admin',
      slug: 'hr-admin',
      description: 'Manage people, departments, invitations and approvals',
      permissions: [
        PERMISSIONS.DASHBOARD_READ,
        PERMISSIONS.TEAM_READ, PERMISSIONS.TEAM_CREATE, PERMISSIONS.TEAM_UPDATE, PERMISSIONS.TEAM_DELETE,
        PERMISSIONS.DEPARTMENT_READ, PERMISSIONS.DEPARTMENT_CREATE, PERMISSIONS.DEPARTMENT_UPDATE,
        PERMISSIONS.INVITATION_READ, PERMISSIONS.INVITATION_CREATE, PERMISSIONS.INVITATION_RESEND, PERMISSIONS.INVITATION_CANCEL,
        PERMISSIONS.PROFILE_APPROVAL_READ, PERMISSIONS.PROFILE_APPROVAL_APPROVE, PERMISSIONS.PROFILE_APPROVAL_REJECT,
        PERMISSIONS.ANALYTICS_READ,
        PERMISSIONS.EVENT_READ, PERMISSIONS.EVENT_CREATE
      ],
      isSystem: false,
      isActive: true
    },
    {
      name: 'Content Admin',
      slug: 'content-admin',
      description: 'Manage content, templates, media and company profile',
      permissions: [
        PERMISSIONS.DASHBOARD_READ,
        PERMISSIONS.COMPANY_PROFILE_READ, PERMISSIONS.COMPANY_PROFILE_UPDATE,
        PERMISSIONS.TEMPLATE_READ, PERMISSIONS.TEMPLATE_CREATE, PERMISSIONS.TEMPLATE_UPDATE,
        PERMISSIONS.PROFILE_APPROVAL_READ, PERMISSIONS.PROFILE_APPROVAL_APPROVE,
        PERMISSIONS.MEDIA_UPLOAD,
        PERMISSIONS.EVENT_READ, PERMISSIONS.EVENT_CREATE
      ],
      isSystem: false,
      isActive: true
    },
    {
      name: 'Employee',
      slug: 'employee',
      description: 'Standard team member with employee portal, directory, events, and networking access',
      permissions: [
        PERMISSIONS.DEPARTMENT_READ,
        PERMISSIONS.TEMPLATE_READ,
        PERMISSIONS.MEDIA_UPLOAD,
        PERMISSIONS.EVENT_READ
      ],
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


