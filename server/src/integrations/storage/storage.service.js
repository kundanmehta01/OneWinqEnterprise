import { env } from '../../config/env.config.js';
import { LocalStorageProvider } from './localStorage.provider.js';
import { logger } from '../../config/logger.config.js';

class StorageService {
  constructor() {
    this.providerType = env.STORAGE_PROVIDER;
    if (this.providerType === 'local') {
      this.provider = new LocalStorageProvider();
    } else {
      // S3 provider or fallback
      this.provider = new LocalStorageProvider();
      logger.info(`Storage provider set to '${this.providerType}'. Defaulting to LocalStorageProvider.`);
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
