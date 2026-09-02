import { Router } from 'express';
import { settingsController } from './settings.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { requirePermission } from '../../middlewares/authorize.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateSettingsSchema } from './settings.validation.js';
import { PERMISSIONS } from '../../constants/permissions.constant.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  requirePermission(PERMISSIONS.SETTINGS_READ),
  settingsController.getSettings.bind(settingsController)
);

router.patch(
  '/',
  requirePermission(PERMISSIONS.SETTINGS_UPDATE),
  validate({ body: updateSettingsSchema }),
  settingsController.updateSettings.bind(settingsController)
);

export const settingsRoutes = router;
