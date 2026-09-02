import multer from 'multer';
import { mediaService } from './media.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export class MediaController {
  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return ApiResponse.error(res, { statusCode: 400, message: 'No file uploaded in request (form field: file)' });
      }

      const entityType = req.body.entityType || 'general';
      const entityId = req.body.entityId || null;

      const asset = await mediaService.uploadFile({
        file: req.file,
        uploadedBy: req.user._id,
        entityType,
        entityId
      });

      return ApiResponse.created(res, {
        message: 'File uploaded successfully',
        data: asset
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllAssets(req, res, next) {
    try {
      const result = await mediaService.getAllAssets(req.query);
      return ApiResponse.paginated(res, {
        data: result.assets,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAsset(req, res, next) {
    try {
      const result = await mediaService.deleteAsset(req.params.id, { actorId: req.user._id });
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const mediaController = new MediaController();
