import { Router } from 'express';
import {
  platformLogin,
  tenantLogin,
  refresh,
  logout,
  forgotPasswordRequest,
  forgotPasswordVerify,
  forgotPasswordReset,
  me,
} from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  platformLoginSchema,
  tenantLoginSchema,
  refreshTokenSchema,
  forgotPasswordRequestSchema,
  forgotPasswordVerifySchema,
  forgotPasswordResetSchema,
} from '../validators/auth.validator.js';
import { authLimiter, passwordResetLimiter } from '../middlewares/rateLimiter.js';
import { resolveTenantFromSubdomain, resolveTenantOptional } from '../middlewares/resolveTenant.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

// ── Platform (main domain) — MainLogin.jsx ──
router.post('/platform/login', authLimiter, validate(platformLoginSchema), platformLogin);

// ── Tenant (subdomain) — TenantLogin.jsx ──
router.post(
  '/tenant/login',
  authLimiter,
  resolveTenantFromSubdomain,
  validate(tenantLoginSchema),
  tenantLogin
);

// ── Shared ──
router.post('/refresh', validate(refreshTokenSchema), refresh);
router.post('/logout', validate(refreshTokenSchema), logout);
router.get('/me', authenticate, me);

// ── Forgot password — ForgotPassword.jsx (audience: 'platform' | 'tenant') ──
router.post(
  '/forgot-password/request',
  passwordResetLimiter,
  resolveTenantOptional,
  validate(forgotPasswordRequestSchema),
  forgotPasswordRequest
);
router.post(
  '/forgot-password/verify',
  passwordResetLimiter,
  resolveTenantOptional,
  validate(forgotPasswordVerifySchema),
  forgotPasswordVerify
);
router.post(
  '/forgot-password/reset',
  passwordResetLimiter,
  resolveTenantOptional,
  validate(forgotPasswordResetSchema),
  forgotPasswordReset
);

export default router;
