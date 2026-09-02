import { connectDB, disconnectDB } from '../config/db.config.js';
import { logger } from '../config/logger.config.js';
import { seedPermissions } from './permissions.seed.js';
import { seedRoles } from './roles.seed.js';
import { seedDepartments } from './departments.seed.js';
import { seedTemplates } from './templates.seed.js';
import { seedOrganization } from './organization.seed.js';
import { seedSuperAdmin } from './superAdmin.seed.js';
import { seedSampleMembers } from './sampleMembers.seed.js';

const runSeed = async () => {
  try {
    logger.info('====================================================');
    logger.info('🌱 Starting OneWinq Database Seeding Process...');
    logger.info('====================================================');

    await connectDB();

    // 1. Permissions
    await seedPermissions();

    // 2. System Roles
    await seedRoles();

    // 3. Departments
    await seedDepartments();

    // 4. Templates
    await seedTemplates();

    // 5. Organization Settings & Company Profile
    await seedOrganization();

    // 6. Super Admin
    await seedSuperAdmin();

    // 7. Sample Team Members & Profiles
    await seedSampleMembers();

    logger.info('====================================================');
    logger.info('✨ OneWinq Database Seeding Completed Successfully!');
    logger.info('====================================================');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    logger.error(`❌ Seeding failed: ${error.message}`, { error: error.stack });
    await disconnectDB();
    process.exit(1);
  }
};

runSeed();
