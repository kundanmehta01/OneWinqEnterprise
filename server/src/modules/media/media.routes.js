import { Router } from 'express';
import { mediaController, uploadMiddleware } from './media.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { requirePermission } from '../../middlewares/authorize.middleware.js';
import { PERMISSIONS } from '../../constants/permissions.constant.js';

const router = Router();

router.use(authenticate);

router.post(
  '/upload',
  requirePermission(PERMISSIONS.MEDIA_UPLOAD),
  uploadMiddleware.single('file'),
  mediaController.uploadFile.bind(mediaController)
);

router.get(
  '/',
  requirePermission(PERMISSIONS.MEDIA_READ),
  mediaController.getAllAssets.bind(mediaController)
);

router.delete(
  '/:id',
  requirePermission(PERMISSIONS.MEDIA_DELETE),
  mediaController.deleteAsset.bind(mediaController)
);

export const mediaRoutes = router;
