import { ApiError } from '../utils/ApiError.js';

/**
 * requireRole('SUPER_ADMIN', 'FINANCE_ADMIN')
 * requireRole('SCHOOLADMIN_PRIMARY', 'SCHOOLADMIN_SECONDARY')
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.auth?.role || !allowedRoles.includes(req.auth.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }
    next();
  };
}
