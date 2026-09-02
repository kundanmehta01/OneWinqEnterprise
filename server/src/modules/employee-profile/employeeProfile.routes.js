import { Router } from 'express';
import { employeeProfileController } from './employeeProfile.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  updateDraftProfileSchema,
  submitProfileForApprovalSchema
} from './employeeProfile.validation.js';

const router = Router();

router.use(authenticate);

// Employee self-service routes (/api/v1/me/profile)
router.get('/', employeeProfileController.getMyProfile.bind(employeeProfileController));

router.patch(
  '/',
  validate({ body: updateDraftProfileSchema }),
  employeeProfileController.updateMyDraftProfile.bind(employeeProfileController)
);

router.post(
  '/submit',
  validate({ body: submitProfileForApprovalSchema }),
  employeeProfileController.submitMyProfile.bind(employeeProfileController)
);

router.get('/status', employeeProfileController.getMyApprovalStatus.bind(employeeProfileController));

export const employeeProfileRoutes = router;
