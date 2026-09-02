import { Router } from 'express';
import { templateController } from './template.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { requirePermission } from '../../middlewares/authorize.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createTemplateSchema,
  updateTemplateSchema,
  templateIdParamSchema
} from './template.validation.js';
import { PERMISSIONS } from '../../constants/permissions.constant.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  requirePermission(PERMISSIONS.TEMPLATE_READ),
  templateController.getAllTemplates.bind(templateController)
);

router.get(
  '/:id',
  requirePermission(PERMISSIONS.TEMPLATE_READ),
  validate({ params: templateIdParamSchema }),
  templateController.getTemplateById.bind(templateController)
);

router.post(
  '/',
  requirePermission(PERMISSIONS.TEMPLATE_CREATE),
  validate({ body: createTemplateSchema }),
  templateController.createTemplate.bind(templateController)
);

router.patch(
  '/:id',
  requirePermission(PERMISSIONS.TEMPLATE_UPDATE),
  validate({ params: templateIdParamSchema, body: updateTemplateSchema }),
  templateController.updateTemplate.bind(templateController)
);

router.post(
  '/:id/duplicate',
  requirePermission(PERMISSIONS.TEMPLATE_CREATE),
  validate({ params: templateIdParamSchema }),
  templateController.duplicateTemplate.bind(templateController)
);

router.delete(
  '/:id',
  requirePermission(PERMISSIONS.TEMPLATE_DELETE),
  validate({ params: templateIdParamSchema }),
  templateController.archiveTemplate.bind(templateController)
);

export const templateRoutes = router;
