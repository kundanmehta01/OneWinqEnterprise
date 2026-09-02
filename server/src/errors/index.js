import { ERROR_CODES } from '../constants/errorCodes.constant.js';

export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', errorCode = ERROR_CODES.BAD_REQUEST, details = null) {
    super(message, 400, errorCode, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required', errorCode = ERROR_CODES.UNAUTHORIZED, details = null) {
    super(message, 401, errorCode, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied: Insufficient permissions', errorCode = ERROR_CODES.FORBIDDEN, details = null) {
    super(message, 403, errorCode, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', errorCode = ERROR_CODES.RESOURCE_NOT_FOUND, details = null) {
    super(message, 404, errorCode, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists or conflict occurred', errorCode = ERROR_CODES.CONFLICT, details = null) {
    super(message, 409, errorCode, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 422, ERROR_CODES.VALIDATION_ERROR, details);
  }
}
