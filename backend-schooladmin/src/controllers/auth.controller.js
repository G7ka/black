import { authService } from '../services/auth.service.js';
import { schoolRepository } from '../repositories/school.repository.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import { toAuthResultDTO } from '../dtos/auth.dto.js';
import { ApiError } from '../utils/ApiError.js';
import { resolveRequestSubdomain } from '../utils/tenant.js';

// POST /api/v1/auth/platform/login  — MainLogin.jsx
export const platformLogin = asyncHandler(async (req, res) => {
  const result = await authService.loginPlatformAdmin({ ...req.body, ipAddress: req.ip });
  return ok(res, toAuthResultDTO(result), 'Login successful');
});

// POST /api/v1/auth/tenant/login  — TenantLogin.jsx
// Requires subdomain resolution (via resolveTenantFromSubdomain middleware -> req.school)
export const tenantLogin = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const result = await authService.loginTenantUser({
    school: req.school,
    identifier,
    password,
    ipAddress: req.ip,
  });
  return ok(res, toAuthResultDTO(result), 'Login successful');
});

// POST /api/v1/auth/refresh
export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refresh(refreshToken);
  return ok(res, tokens, 'Token refreshed');
});

// POST /api/v1/auth/logout
export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
  return ok(res, null, 'Logged out');
});

// ── Forgot password (3 steps) — ForgotPassword.jsx ──

// POST /api/v1/auth/forgot-password/request
export const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email, audience } = req.body;
  const schoolId = audience === 'tenant' ? req.school?.id : undefined;
  if (audience === 'tenant' && !schoolId) {
    throw ApiError.badRequest('Unable to resolve school from request');
  }
  await authService.requestPasswordReset({ email, audience, schoolId });
  return ok(res, { sent: true }, 'If the account exists, a verification code has been sent');
});

// POST /api/v1/auth/forgot-password/verify
export const forgotPasswordVerify = asyncHandler(async (req, res) => {
  const { email, audience, code } = req.body;
  const schoolId = audience === 'tenant' ? req.school?.id : undefined;
  const { ownerType, principal } = await authService.resolvePrincipal(audience, email, schoolId);
  if (!principal) throw ApiError.badRequest('Invalid verification code');

  await authService.verifyResetCode({ ownerType, ownerId: principal.id, code });
  return ok(res, { verified: true }, 'Code verified');
});

// POST /api/v1/auth/forgot-password/reset
export const forgotPasswordReset = asyncHandler(async (req, res) => {
  const { email, audience, code, newPassword } = req.body;
  const schoolId = audience === 'tenant' ? req.school?.id : undefined;
  const { ownerType, principal } = await authService.resolvePrincipal(audience, email, schoolId);
  if (!principal) throw ApiError.badRequest('Invalid verification code');

  await authService.resetPassword({ ownerType, ownerId: principal.id, code, newPassword });
  return ok(res, { reset: true }, 'Password reset successfully');
});

// GET /api/v1/auth/me — resolves profile from access token (both audiences)
export const me = asyncHandler(async (req, res) => {
  return ok(res, req.auth, 'Current session');
});

// Helper export used by routes needing subdomain-only resolution
// (e.g. forgot-password on tenant side before login exists).
export const resolveSubdomainOrThrow = (req) => {
  const subdomain = resolveRequestSubdomain(req);
  if (!subdomain) throw ApiError.badRequest('No tenant subdomain resolved from request');
  return subdomain;
};
