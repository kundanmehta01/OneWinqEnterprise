import { ValidationError } from '../errors/index.js';

/**
 * Validates Express request against Zod schemas
 * @param {Object} schemas - Object containing optional body, query, and params Zod schemas
 * @example validate({ body: loginSchema, query: paginationSchema })
 */
export const validate = (schemas = {}) => {
  return async (req, res, next) => {
    try {
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      return next();
    } catch (error) {
      if (error.issues) {
        const details = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code
        }));
        return next(new ValidationError('Input validation failed', details));
      }
      return next(error);
    }
  };
};
