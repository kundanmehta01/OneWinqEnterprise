import argon2 from 'argon2';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.config.js';
import { logger } from '../config/logger.config.js';

export const hashPassword = async (password) => {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: env.ARGON2_MEMORY_COST,
      timeCost: env.ARGON2_TIME_COST,
      parallelism: env.ARGON2_PARALLELISM
    });
  } catch (error) {
    logger.warn(`Argon2 hashing fallback to bcrypt: ${error.message}`);
    return await bcrypt.hash(password, env.PASSWORD_SALT_ROUNDS);
  }
};

export const comparePassword = async (password, hash) => {
  if (!password || !hash) return false;

  try {
    if (hash.startsWith('$argon2')) {
      return await argon2.verify(hash, password);
    }
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error(`Password comparison error: ${error.message}`);
    return false;
  }
};
