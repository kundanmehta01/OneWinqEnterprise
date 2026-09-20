import multer from 'multer';
import { uploadService } from './upload.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
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

  async getUploadSignature(req, res, next) {
    try {
      const entityType = req.query.entityType || req.query.folder || 'general';
      const signatureData = uploadService.getUploadSignature({ entityType });
      return ApiResponse.success(res, {
        message: 'Upload signature generated successfully',
        data: signatureData
      });
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
