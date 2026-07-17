import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let { statusCode, message, details } = err;

  if (!statusCode) {
    statusCode = 500;
    message = message || 'Internal server error';
  }

  if (err.code === 'P2002') {
    statusCode = 409;
    message = `Duplicate value for: ${err.meta?.target?.join(', ') || 'unique field'}`;
  }

  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    details = err.errors;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token';
  }

  const payload = { success: false, message, details: details ?? null };

  if (env.nodeEnv === 'development' && statusCode === 500) {
    payload.stack = err.stack;
    console.error(err);
  }

  res.status(statusCode).json(payload);
}
