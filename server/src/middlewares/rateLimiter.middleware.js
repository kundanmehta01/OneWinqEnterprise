import rateLimit from 'express-rate-limit';
import { env } from '../config/env.config.js';
import { ERROR_CODES } from '../constants/errorCodes.constant.js';
import { ApiResponse } from '../utils/apiResponse.util.js';

export const standardRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(res, {
      statusCode: 429,
      errorCode: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: 'Too many requests from this IP, please try again later.'
    });
  }
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.AUTH_RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(res, {
      statusCode: 429,
      errorCode: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: 'Too many authentication attempts. Please try again after 15 minutes.'
    });
  }
});
