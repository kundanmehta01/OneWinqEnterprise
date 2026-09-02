import { Router } from 'express';
import { permissionController } from './permission.service.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { requirePermission } from '../../middlewares/authorize.middleware.js';
import { PERMISSIONS } from '../../constants/permissions.constant.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  requirePermission(PERMISSIONS.ROLE_READ),
  permissionController.getAllPermissions.bind(permissionController)
);

router.get(
  '/by-module',
  requirePermission(PERMISSIONS.ROLE_READ),
  permissionController.getPermissionsByModule.bind(permissionController)
);

export const permissionRoutes = router;
