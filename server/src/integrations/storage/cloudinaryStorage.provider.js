import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { env } from '../../config/env.config.js';
import { logger } from '../../config/logger.config.js';

export class CloudinaryStorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true
    });

    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
      logger.warn('[CloudinaryStorageProvider] Cloudinary credentials are not fully set in environment variables.');
    } else {
      logger.info('[CloudinaryStorageProvider] Initialized successfully.');
    }
  }

  /**
   * Upload buffer directly to Cloudinary using a stream.
   * Supports both images and raw files (like PDFs).
   *
   * @param {Object} params
   * @param {Buffer} params.buffer
   * @param {string} params.filename
   * @param {string} params.mimeType
   * @param {string} params.subfolder
   * @returns {Promise<{url: string, key: string, provider: string, size: number, mimeType: string, publicId: string}>}
   */
  async saveFile({ buffer, filename, mimeType, subfolder = 'general' }) {
    return new Promise((resolve, reject) => {
      try {
        const baseFolder = env.CLOUDINARY_FOLDER || 'onewinq';
        const folder = `${baseFolder}/${subfolder}`;
        
        // Strip extension from public_id to allow Cloudinary clean routing
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

        const isRawType = mimeType === 'application/pdf' || mimeType.startsWith('application/');
        const resourceType = isRawType ? 'raw' : 'auto';

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: nameWithoutExt,
            resource_type: resourceType,
            use_filename: true,
            unique_filename: false,
            overwrite: true
          },
          (error, result) => {
            if (error) {
              logger.error(`[CloudinaryStorageProvider] Upload failed for ${filename}: ${error.message}`, { error });
              return reject(error);
            }

            logger.debug(`[CloudinaryStorageProvider] Successfully uploaded to Cloudinary: ${result.secure_url}`);
            
            resolve({
              url: result.secure_url,
              key: result.public_id,
              provider: 'cloudinary',
              size: result.bytes || buffer.length,
              mimeType: result.format ? `${result.resource_type}/${result.format}` : mimeType,
              publicId: result.public_id,
              resourceType: result.resource_type
            });
          }
        );

        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      } catch (err) {
        logger.error(`[CloudinaryStorageProvider] Stream setup failed: ${err.message}`, { error: err });
        reject(err);
      }
    });
  }

  /**
   * Delete asset from Cloudinary by public ID (key)
   *
   * @param {string} key - Cloudinary public_id
   * @returns {Promise<boolean>}
   */
  async deleteFile(key) {
    try {
      // First attempt deleting as image/auto
      let result = await cloudinary.uploader.destroy(key);
      
      // If not found as image, attempt raw deletion (for PDFs/documents)
      if (result.result !== 'ok') {
        result = await cloudinary.uploader.destroy(key, { resource_type: 'raw' });
      }

      logger.debug(`[CloudinaryStorageProvider] Deleted asset ${key}: ${result.result}`);
      return result.result === 'ok' || result.result === 'not found';
    } catch (error) {
      logger.error(`[CloudinaryStorageProvider] Failed to delete file ${key}: ${error.message}`, { error });
      return false;
    }
  }
}
