import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../constants/errorCodes.constant.js';
import { logger } from '../config/logger.config.js';
import { env } from '../config/env.config.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || ERROR_CODES.INTERNAL_SERVER_ERROR;
  let message = err.message || 'An unexpected internal server error occurred';
  let details = err.details || null;

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    errorCode = ERROR_CODES.BAD_REQUEST;
    message = `Invalid format for field: ${err.path}`;
    details = { path: err.path, value: err.value };
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    errorCode = ERROR_CODES.CONFLICT;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const val = err.keyValue ? err.keyValue[field] : '';
    message = `Duplicate value '${val}' for field '${field}'. A record already exists with this value.`;
    details = { field, value: val };
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 422;
    errorCode = ERROR_CODES.VALIDATION_ERROR;
    message = 'Validation failed';
    details = Object.keys(err.errors).map((k) => ({
      field: k,
      message: err.errors[k].message
    }));
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = ERROR_CODES.INVALID_TOKEN;
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = ERROR_CODES.TOKEN_EXPIRED;
    message = 'Authentication token has expired';
  }

  // Handle JSON parse syntax error in body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    errorCode = ERROR_CODES.BAD_REQUEST;
    message = 'Malformed JSON payload in request body';
  }

  // Structured Logging
  const logData = {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    statusCode,
    errorCode,
    message,
    ip: req.ip,
    userId: req.user?._id
  };

  if (statusCode >= 500) {
    logger.error(`[500 Server Error] ${message}`, { ...logData, stack: err.stack });
  } else {
    logger.warn(`[${statusCode} Client Error] ${message}`, logData);
  }

  const response = {
    success: false,
    error: {
      code: errorCode,
      message
    }
  };

  if (details) {
    response.error.details = details;
  }

  if (env.NODE_ENV === 'development' && statusCode >= 500) {
    response.error.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: `Endpoint not found: ${req.method} ${req.originalUrl}`
    }
  });
};
