import winston from 'winston';
import { env } from './env.config.js';

const SENSITIVE_KEYS = ['password', 'passwordHash', 'token', 'refreshToken', 'tokenHash', 'authorization', 'secret', 'apiKey'];

const redactSensitiveData = winston.format((info) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sanitize);

    const copy = { ...obj };
    for (const key of Object.keys(copy)) {
      if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
        copy[key] = '[REDACTED]';
      } else if (typeof copy[key] === 'object') {
        copy[key] = sanitize(copy[key]);
      }
    }
    return copy;
  };

  if (info.meta && typeof info.meta === 'object') {
    info.meta = sanitize(info.meta);
  }
  return info;
});

const consoleFormat = winston.format.combine(
  redactSensitiveData(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ level, message, timestamp, requestId, ...meta }) => {
    const reqStr = requestId ? ` [${requestId}]` : '';
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}]${reqStr} ${level}: ${message}${metaStr}`;
  })
);

const jsonFormat = winston.format.combine(
  redactSensitiveData(),
  winston.format.timestamp(),
  winston.format.json()
);

const transports = [
  new winston.transports.Console({
    format: env.NODE_ENV === 'production' ? jsonFormat : consoleFormat
  })
];

export const logger = winston.createLogger({
  level: env.LOG_LEVEL || 'info',
  format: jsonFormat,
  defaultMeta: { service: 'onewinq-backend' },
  transports,
  exitOnError: false
});
