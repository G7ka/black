import { verifyAccessToken } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Verifies the Bearer access token and attaches the decoded payload to
 * req.auth = { sub, type: 'platform' | 'tenant', role, schoolId? }
 */
export function authenticate(req, res, next) {
  const header = req.get('Authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(ApiError.unauthorized('Missing or malformed Authorization header'));
  }

  try {
    const payload = verifyAccessToken(token);
    req.auth = payload;
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}

// Ensures the caller authenticated on the platform (main domain) side.
export function requirePlatformAuth(req, res, next) {
  if (req.auth?.type !== 'platform') {
    return next(ApiError.forbidden('Platform admin authentication required'));
  }
  next();
}

// Ensures the caller authenticated on a tenant (school) side.
export function requireTenantAuth(req, res, next) {
  if (req.auth?.type !== 'tenant') {
    return next(ApiError.forbidden('Tenant user authentication required'));
  }
  next();
}
