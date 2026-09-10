import multer from 'multer';
import { uploadService } from './upload.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

export class UploadController {
  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return ApiResponse.error(res, { statusCode: 400, message: 'No file uploaded (form field: file)' });
      }

      const entityType = req.body.entityType || 'general';
      const result = await uploadService.uploadFile({
        file: req.file,
        entityType
      });

      return ApiResponse.created(res, {
        message: 'File uploaded successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
