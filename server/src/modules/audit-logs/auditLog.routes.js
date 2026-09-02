import { Router } from 'express';
import { auditLogController } from './auditLog.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { requirePermission } from '../../middlewares/authorize.middleware.js';
import { PERMISSIONS } from '../../constants/permissions.constant.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  requirePermission(PERMISSIONS.AUDIT_LOG_READ),
  auditLogController.getAuditLogs.bind(auditLogController)
);

router.get(
  '/:id',
  requirePermission(PERMISSIONS.AUDIT_LOG_READ),
  auditLogController.getAuditLogById.bind(auditLogController)
);

export const auditLogRoutes = router;
