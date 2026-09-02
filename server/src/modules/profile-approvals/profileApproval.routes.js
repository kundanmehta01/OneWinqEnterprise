import { Router } from 'express';
import { profileApprovalController } from './profileApproval.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { requirePermission } from '../../middlewares/authorize.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { reviewApprovalSchema, approvalIdParamSchema } from './profileApproval.validation.js';
import { PERMISSIONS } from '../../constants/permissions.constant.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  requirePermission(PERMISSIONS.PROFILE_APPROVAL_READ),
  profileApprovalController.getAllApprovals.bind(profileApprovalController)
);

router.get(
  '/:id',
  requirePermission(PERMISSIONS.PROFILE_APPROVAL_READ),
  validate({ params: approvalIdParamSchema }),
  profileApprovalController.getApprovalById.bind(profileApprovalController)
);

router.post(
  '/:id/review',
  requirePermission(PERMISSIONS.PROFILE_APPROVAL_APPROVE),
  validate({ params: approvalIdParamSchema, body: reviewApprovalSchema }),
  profileApprovalController.reviewApproval.bind(profileApprovalController)
);

export const profileApprovalRoutes = router;
