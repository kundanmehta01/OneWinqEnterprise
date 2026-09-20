import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import { storageService } from '../../integrations/storage/storage.service.js';
import { env } from '../../config/env.config.js';
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
  'video/quicktime',
  'video/x-m4v',
  'video/m4v',
  'video/x-matroska',
  'video/x-msvideo',
  'video/3gpp',
  'video/mpeg'
]);

const EXT_MIME_MAP = {
  '.mp4': 'video/mp4',
  '.m4v': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.ogv': 'video/ogg',
  '.mov': 'video/quicktime',
  '.mkv': 'video/x-matroska',
  '.avi': 'video/x-msvideo',
  '.3gp': 'video/3gpp',
  '.mpg': 'video/mpeg',
  '.mpeg': 'video/mpeg',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf'
};

class UploadService {
  async uploadFile({ file, entityType = 'general' }) {
    if (!file || !file.buffer) {
      throw new BadRequestError('No file buffer provided', ERROR_CODES.FILE_UPLOAD_FAILED);
    }

    // Fallback: If browser or OS sent application/octet-stream or empty mime type, detect from extension
    const ext = path.extname(file.originalname || '').toLowerCase();
    if ((!file.mimetype || file.mimetype === 'application/octet-stream' || !ALLOWED_MIME_TYPES.has(file.mimetype)) && EXT_MIME_MAP[ext]) {
      file.mimetype = EXT_MIME_MAP[ext];
    }

    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestError(`Unsupported file type: ${file.mimetype}. Allowed types: JPEG, PNG, WEBP, SVG, GIF, PDF, MP4, WEBM, OGG, MOV, MKV, AVI`, ERROR_CODES.UNSUPPORTED_FILE_TYPE);
    }

    const maxSizeBytes = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSizeBytes) {
      throw new BadRequestError('File size exceeds maximum limit of 50MB', ERROR_CODES.FILE_SIZE_EXCEEDED);
    }

    const fileExtension = ext || '.bin';
    const uniqueFilename = `${uuidv4()}${fileExtension}`;

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

  getUploadSignature({ entityType = 'general' }) {
    const isCloudinaryActive =
      (env.STORAGE_PROVIDER === 'cloudinary' || (process.env.VERCEL && env.CLOUDINARY_CLOUD_NAME)) &&
      env.CLOUDINARY_CLOUD_NAME &&
      env.CLOUDINARY_API_KEY &&
      env.CLOUDINARY_API_SECRET;

    if (isCloudinaryActive) {
      cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
        secure: true
      });

      const timestamp = Math.round(Date.now() / 1000);
      const baseFolder = env.CLOUDINARY_FOLDER || 'onewinq';
      const folder = `${baseFolder}/${entityType}`;
      const paramsToSign = {
        folder,
        timestamp
      };
      const signature = cloudinary.utils.api_sign_request(paramsToSign, env.CLOUDINARY_API_SECRET);

      return {
        provider: 'cloudinary',
        cloudName: env.CLOUDINARY_CLOUD_NAME,
        apiKey: env.CLOUDINARY_API_KEY,
        folder,
        timestamp,
        signature
      };
    }

    return {
      provider: env.STORAGE_PROVIDER || 'local'
    };
  }
}

export const uploadService = new UploadService();
