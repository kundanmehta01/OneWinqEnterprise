import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  APP_NAME: z.string().default('OneWinq'),
  APP_URL: z.string().default('http://localhost:5000'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  PUBLIC_PROFILE_BASE_URL: z.string().default('http://localhost:3000/p'),

  // Database
  MONGODB_URI: z.string().default('mongodb://localhost:27017/onewinq_db'),
  MONGODB_DEBUG: z.coerce.boolean().default(false),

  // Auth / JWT
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 chars').default('onewinq_default_access_secret_key_32_chars_min!'),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 chars').default('onewinq_default_refresh_secret_key_32_chars_min!'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
  PASSWORD_SALT_ROUNDS: z.coerce.number().default(12),
  ARGON2_MEMORY_COST: z.coerce.number().default(65536),
  ARGON2_TIME_COST: z.coerce.number().default(3),
  ARGON2_PARALLELISM: z.coerce.number().default(4),

  // Rate limits
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(500),
  AUTH_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(20),

  // Email
  EMAIL_PROVIDER: z.enum(['smtp', 'console', 'mock']).default('console'),
  SMTP_HOST: z.string().optional().default('smtp.mailtrap.io'),
  SMTP_PORT: z.coerce.number().optional().default(2525),
  SMTP_SECURE: z.coerce.boolean().optional().default(false),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASSWORD: z.string().optional().default(''),
  EMAIL_FROM_NAME: z.string().default('OneWinq Team'),
  EMAIL_FROM_ADDRESS: z.string().default('no-reply@onewinq.com'),

  // Storage
  STORAGE_PROVIDER: z.enum(['local', 's3', 'cloudinary']).default('local'),
  STORAGE_LOCAL_UPLOAD_DIR: z.string().default('./uploads'),
  AWS_S3_BUCKET: z.string().optional().default(''),
  AWS_S3_REGION: z.string().optional().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().optional().default(''),
  AWS_SECRET_ACCESS_KEY: z.string().optional().default(''),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),
  CLOUDINARY_FOLDER: z.string().optional().default('onewinq'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  LOG_TO_FILE: z.coerce.boolean().default(false),
  LOG_DIR: z.string().default('./logs')
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Environment configuration error:');
    result.error.issues.forEach((issue) => {
      console.error(`   - ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
  }
  return result.data;
};

export const env = parseEnv();
