import { Permission } from '../modules/permissions/permission.model.js';
import { ALL_PERMISSIONS } from '../constants/permissions.constant.js';
import { logger } from '../config/logger.config.js';

export const seedPermissions = async () => {
  logger.info('Seeding permissions...');

  const permissionDefinitions = ALL_PERMISSIONS.map((code) => {
    const [module, action] = code.split('.');
    const formattedAction = action.replace(/_/g, ' ').toUpperCase();
    const formattedModule = module.replace(/_/g, ' ').toUpperCase();

    return {
      code,
      name: `${formattedAction} ${formattedModule}`,
      module,
      description: `Allows ${action} operation on ${module} module`
    };
  });

  for (const perm of permissionDefinitions) {
    await Permission.findOneAndUpdate({ code: perm.code }, perm, { upsert: true, new: true });
  }

  logger.info(`✅ Seeded ${permissionDefinitions.length} permissions successfully.`);
};
