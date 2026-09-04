import { Router } from 'express';
import { companyProfileController } from './companyProfile.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { requirePermission } from '../../middlewares/authorize.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateCompanyProfileSchema } from './companyProfile.validation.js';
import { PERMISSIONS } from '../../constants/permissions.constant.js';

const router = Router();

// Publicly accessible company profile (Company Identity Flow)
router.get(
  '/public',
  companyProfileController.getPublicProfile.bind(companyProfileController)
);

router.use(authenticate);

router.get(
  '/',
  requirePermission(PERMISSIONS.COMPANY_PROFILE_READ),
  companyProfileController.getProfile.bind(companyProfileController)
);

router.patch(
  '/',
  requirePermission(PERMISSIONS.COMPANY_PROFILE_UPDATE),
  validate({ body: updateCompanyProfileSchema }),
  companyProfileController.updateProfile.bind(companyProfileController)
);

export const companyProfileRoutes = router;
