import { env } from '../../config/env.config.js';
import { LocalStorageProvider } from './localStorage.provider.js';
import { CloudinaryStorageProvider } from './cloudinaryStorage.provider.js';
import { logger } from '../../config/logger.config.js';

class StorageService {
  constructor() {
    this.providerType = env.STORAGE_PROVIDER;
    
    switch (this.providerType) {
      case 'cloudinary':
        this.provider = new CloudinaryStorageProvider();
        logger.info('[StorageService] Active storage provider: Cloudinary');
        break;
      case 'local':
        this.provider = new LocalStorageProvider();
        logger.info('[StorageService] Active storage provider: Local Disk Storage');
        break;
      case 's3':
      default:
        this.provider = new LocalStorageProvider();
        logger.info(`[StorageService] Storage provider set to '${this.providerType}'. Defaulting to LocalStorageProvider.`);
        break;
    }
  }

  async uploadFile({ buffer, filename, mimeType, subfolder = 'general' }) {
    return await this.provider.saveFile({ buffer, filename, mimeType, subfolder });
  }

  async deleteFile(key) {
    return await this.provider.deleteFile(key);
  }
}

export const storageService = new StorageService();
