import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MediaAsset } from './mediaAsset.model.js';
import { storageService } from '../../integrations/storage/storage.service.js';
import { NotFoundError, BadRequestError } from '../../errors/index.js';
import { ERROR_CODES } from '../../constants/errorCodes.constant.js';
import { parsePagination, formatPaginationMeta } from '../../utils/pagination.util.js';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'application/pdf'
]);

class MediaService {
  async uploadFile({ file, uploadedBy, entityType = 'general', entityId = null }) {
    if (!file || !file.buffer) {
      throw new BadRequestError('No file buffer provided', ERROR_CODES.FILE_UPLOAD_FAILED);
    }

    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestError(`Unsupported file type: ${file.mimetype}. Allowed types: JPEG, PNG, WEBP, SVG, GIF, PDF`, ERROR_CODES.UNSUPPORTED_FILE_TYPE);
    }

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      throw new BadRequestError('File size exceeds maximum limit of 10MB', ERROR_CODES.FILE_SIZE_EXCEEDED);
    }

    const ext = path.extname(file.originalname).toLowerCase() || '.bin';
    const uniqueFilename = `${uuidv4()}${ext}`;

    const uploadResult = await storageService.uploadFile({
      buffer: file.buffer,
      filename: uniqueFilename,
      mimeType: file.mimetype,
      subfolder: entityType
    });

    const asset = await MediaAsset.create({
      originalName: file.originalname,
      filename: uniqueFilename,
      mimeType: file.mimetype,
      size: file.size,
      url: uploadResult.url,
      key: uploadResult.key,
      provider: uploadResult.provider,
      uploadedBy,
      entityType,
      entityId
    });

    return asset;
  }

  async getAllAssets(query = {}) {
    const { page, limit, skip, sort } = parsePagination(query, 20);
    const filter = {};

    if (query.entityType) filter.entityType = query.entityType;
    if (query.uploadedBy) filter.uploadedBy = query.uploadedBy;

    const [assets, totalItems] = await Promise.all([
      MediaAsset.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      MediaAsset.countDocuments(filter)
    ]);

    return {
      assets,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }

  async deleteAsset(id, actorContext = {}) {
    const asset = await MediaAsset.findById(id);
    if (!asset) {
      throw new NotFoundError('Media asset not found', ERROR_CODES.FILE_NOT_FOUND);
    }

    await storageService.deleteFile(asset.key);
    await MediaAsset.findByIdAndDelete(id);

    return { message: 'Media asset deleted successfully' };
  }
}

export const mediaService = new MediaService();
