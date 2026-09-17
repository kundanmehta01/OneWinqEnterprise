import bcrypt from 'bcryptjs';
import { env } from '../config/env.config.js';
import { logger } from '../config/logger.config.js';

let argon2 = null;
let argon2Checked = false;

const getArgon2 = async () => {
  if (argon2Checked) return argon2;
  argon2Checked = true;
  if (process.env.VERCEL) {
    // In Vercel serverless functions, avoid loading native C++ binaries
    return null;
  }
  try {
    const mod = await import('argon2');
    argon2 = mod.default || mod;
  } catch (e) {
    logger.warn(`Argon2 unavailable (${e.message}). Falling back to bcryptjs.`);
  }
  return argon2;
};

export const hashPassword = async (password) => {
  const a2 = await getArgon2();
  if (a2) {
    try {
      return await a2.hash(password, {
        type: a2.argon2id,
        memoryCost: env.ARGON2_MEMORY_COST,
        timeCost: env.ARGON2_TIME_COST,
        parallelism: env.ARGON2_PARALLELISM
      });
    } catch (error) {
      logger.warn(`Argon2 hashing fallback to bcrypt: ${error.message}`);
    }
  }
  return await bcrypt.hash(password, env.PASSWORD_SALT_ROUNDS);
};

export const comparePassword = async (password, hash) => {
  if (!password || !hash) return false;

  try {
    if (hash.startsWith('$argon2')) {
      const a2 = await getArgon2();
      if (a2) {
        return await a2.verify(hash, password);
      }
    }
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error(`Password comparison error: ${error.message}`);
    return false;
  }
};
