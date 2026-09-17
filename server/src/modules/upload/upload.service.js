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
  'application/pdf',
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime'
]);

class UploadService {
  async uploadFile({ file, entityType = 'general' }) {
    if (!file || !file.buffer) {
      throw new BadRequestError('No file buffer provided', ERROR_CODES.FILE_UPLOAD_FAILED);
    }

    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestError(`Unsupported file type: ${file.mimetype}. Allowed types: JPEG, PNG, WEBP, SVG, GIF, PDF, MP4, WEBM, OGG, MOV`, ERROR_CODES.UNSUPPORTED_FILE_TYPE);
    }

    const maxSizeBytes = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSizeBytes) {
      throw new BadRequestError('File size exceeds maximum limit of 50MB', ERROR_CODES.FILE_SIZE_EXCEEDED);
    }

    const ext = path.extname(file.originalname).toLowerCase() || '.bin';
    const uniqueFilename = `${uuidv4()}${ext}`;

    try {
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
    } catch (storageError) {
      // In serverless environments, if cloud storage is unconfigured or rejected, gracefully fallback to Data URL for images under 5MB
      if (file.mimetype.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        const base64Str = file.buffer.toString('base64');
        const dataUrl = `data:${file.mimetype};base64,${base64Str}`;
        return {
          url: dataUrl,
          filename: uniqueFilename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          provider: 'data-url'
        };
      }
      throw storageError;
    }
  }
}

export const uploadService = new UploadService();
