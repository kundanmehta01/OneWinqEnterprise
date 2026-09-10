import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { storageService } from '../../integrations/storage/storage.service.js';
import { BadRequestError } from '../../errors/index.js';
import { ERROR_CODES } from '../../constants/errorCodes.constant.js';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'application/pdf'
]);

class UploadService {
  async uploadFile({ file, entityType = 'general' }) {
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

    return {
      url: uploadResult.url,
      filename: uniqueFilename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    };
  }
}

export const uploadService = new UploadService();
