import { Router } from 'express';
import { userSettingsController } from './userSettings.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateUserSettingsSchema } from './userSettings.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', userSettingsController.getSettings.bind(userSettingsController));
router.patch(
  '/',
  validate({ body: updateUserSettingsSchema }),
  userSettingsController.updateSettings.bind(userSettingsController)
);

router.get('/sessions', userSettingsController.getActiveSessions.bind(userSettingsController));
router.post('/logout-all', userSettingsController.logoutAllOtherSessions.bind(userSettingsController));

export const userSettingsRoutes = router;
