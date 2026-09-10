import { Router } from 'express';
import { uploadController, uploadMiddleware } from './upload.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  uploadMiddleware.single('file'),
  uploadController.uploadFile.bind(uploadController)
);

export const uploadRoutes = router;
