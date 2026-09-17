import bcrypt from 'bcryptjs';
import { env } from '../config/env.config.js';
import { logger } from '../config/logger.config.js';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, env.PASSWORD_SALT_ROUNDS || 10);
};

export const comparePassword = async (password, hash) => {
  if (!password || !hash) return false;

  try {
    if (hash.startsWith('$argon2')) {
      try {
        const mod = await import('argon2');
        const argon2 = mod.default || mod;
        return await argon2.verify(hash, password);
      } catch (e) {
        logger.warn(`Argon2 verification unavailable in this runtime: ${e.message}`);
        return false;
      }
    }
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error(`Password comparison error: ${error.message}`);
    return false;
  }
};
