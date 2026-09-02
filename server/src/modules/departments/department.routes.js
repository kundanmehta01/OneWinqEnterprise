import { Router } from 'express';
import { departmentController } from './department.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { requirePermission } from '../../middlewares/authorize.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  departmentIdParamSchema
} from './department.validation.js';
import { PERMISSIONS } from '../../constants/permissions.constant.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  requirePermission(PERMISSIONS.DEPARTMENT_READ),
  departmentController.getAllDepartments.bind(departmentController)
);

router.get(
  '/:id',
  requirePermission(PERMISSIONS.DEPARTMENT_READ),
  validate({ params: departmentIdParamSchema }),
  departmentController.getDepartmentById.bind(departmentController)
);

router.post(
  '/',
  requirePermission(PERMISSIONS.DEPARTMENT_CREATE),
  validate({ body: createDepartmentSchema }),
  departmentController.createDepartment.bind(departmentController)
);

router.patch(
  '/:id',
  requirePermission(PERMISSIONS.DEPARTMENT_UPDATE),
  validate({ params: departmentIdParamSchema, body: updateDepartmentSchema }),
  departmentController.updateDepartment.bind(departmentController)
);

router.delete(
  '/:id',
  requirePermission(PERMISSIONS.DEPARTMENT_DELETE),
  validate({ params: departmentIdParamSchema }),
  departmentController.archiveDepartment.bind(departmentController)
);

router.post(
  '/:id/restore',
  requirePermission(PERMISSIONS.DEPARTMENT_UPDATE),
  validate({ params: departmentIdParamSchema }),
  departmentController.restoreDepartment.bind(departmentController)
);

export const departmentRoutes = router;
