import fs from 'fs';
import path from 'path';
import { env } from '../../config/env.config.js';
import { logger } from '../../config/logger.config.js';

export class LocalStorageProvider {
  constructor() {
    this.uploadDir = path.resolve(process.cwd(), env.STORAGE_LOCAL_UPLOAD_DIR);
    this.ensureDirectoryExists(this.uploadDir);
  }

  ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async saveFile({ buffer, filename, mimeType, subfolder = 'general' }) {
    try {
      const targetDir = path.join(this.uploadDir, subfolder);
      this.ensureDirectoryExists(targetDir);

      const filePath = path.join(targetDir, filename);
      await fs.promises.writeFile(filePath, buffer);

      const relativePath = `/uploads/${subfolder}/${filename}`.replace(/\\/g, '/');
      const url = `${env.APP_URL}${relativePath}`;

      logger.debug(`[LocalStorageProvider] Saved file to ${filePath}`);
      return {
        url,
        key: `${subfolder}/${filename}`,
        provider: 'local',
        size: buffer.length,
        mimeType
      };
    } catch (error) {
      logger.error(`[LocalStorageProvider] Failed to save file: ${error.message}`, { error });
      throw error;
    }
  }

  async deleteFile(key) {
    try {
      const filePath = path.join(this.uploadDir, key);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        logger.debug(`[LocalStorageProvider] Deleted file ${filePath}`);
      }
      return true;
    } catch (error) {
      logger.error(`[LocalStorageProvider] Failed to delete file ${key}: ${error.message}`, { error });
      return false;
    }
  }
}
