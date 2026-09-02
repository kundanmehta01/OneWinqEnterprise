import { Router } from 'express';
import { analyticsController } from './analytics.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { requirePermission } from '../../middlewares/authorize.middleware.js';
import { PERMISSIONS } from '../../constants/permissions.constant.js';

const router = Router();

router.use(authenticate);

// Admin aggregated organization-wide analytics
router.get(
  '/',
  requirePermission(PERMISSIONS.ANALYTICS_READ),
  analyticsController.getMetrics.bind(analyticsController)
);

// Employee own profile analytics
router.get('/my-profile', analyticsController.getMyProfileMetrics.bind(analyticsController));

export const analyticsRoutes = router;
