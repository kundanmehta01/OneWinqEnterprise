import { Router } from 'express';
import { roleController } from './role.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { requirePermission } from '../../middlewares/authorize.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createRoleSchema, updateRoleSchema, roleIdParamSchema } from './role.validation.js';
import { PERMISSIONS } from '../../constants/permissions.constant.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  requirePermission(PERMISSIONS.ROLE_READ),
  roleController.getAllRoles.bind(roleController)
);

router.get(
  '/:id',
  requirePermission(PERMISSIONS.ROLE_READ),
  validate({ params: roleIdParamSchema }),
  roleController.getRoleById.bind(roleController)
);

router.post(
  '/',
  requirePermission(PERMISSIONS.ROLE_CREATE),
  validate({ body: createRoleSchema }),
  roleController.createRole.bind(roleController)
);

router.patch(
  '/:id',
  requirePermission(PERMISSIONS.ROLE_UPDATE),
  validate({ params: roleIdParamSchema, body: updateRoleSchema }),
  roleController.updateRole.bind(roleController)
);

router.delete(
  '/:id',
  requirePermission(PERMISSIONS.ROLE_DELETE),
  validate({ params: roleIdParamSchema }),
  roleController.deleteRole.bind(roleController)
);

export const roleRoutes = router;
