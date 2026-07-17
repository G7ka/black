import { platformAdminRepository } from '../repositories/platformAdmin.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { passwordResetRepository } from '../repositories/passwordReset.repository.js';
import { refreshTokenRepository } from '../repositories/refreshToken.repository.js';
import { comparePassword, generateResetCode, hashResetCode, hashPassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';
import { enqueueEmail } from '../emails/emailQueue.js';

function msFromNow(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

async function issueTokenPair({ sub, type, role, schoolId }) {
  const accessToken = signAccessToken({ sub, type, role, ...(schoolId && { schoolId }) });
  const refreshToken = signRefreshToken({ sub, type });

  const decoded = verifyRefreshToken(refreshToken);
  await refreshTokenRepository.store({
    token: refreshToken,
    ownerType: type === 'platform' ? 'PLATFORM_ADMIN' : 'USER',
    ownerId: sub,
    schoolId: schoolId ?? null,
    expiresAt: new Date(decoded.exp * 1000),
  });

  return { accessToken, refreshToken };
}

async function resolvePrincipal(audience, email, schoolId) {
  const ownerType = audience === 'platform' ? 'PLATFORM_ADMIN' : 'USER';
  const principal =
    audience === 'platform'
      ? await platformAdminRepository.findByEmail(email)
      : await userRepository.findByEmailInSchool(schoolId, email);
  return { ownerType, principal };
}

export const authService = {
  resolvePrincipal,

  // ── Platform (main-domain) login — MainLogin.jsx ──
  async loginPlatformAdmin({ email, password, ipAddress }) {
    const admin = await platformAdminRepository.findByEmail(email);
    if (!admin) throw ApiError.unauthorized('Invalid email or password');
    if (admin.status !== 'ACTIVE') throw ApiError.forbidden('This admin account is disabled');

    const valid = await comparePassword(password, admin.passwordHash);
    if (!valid) throw ApiError.unauthorized('Invalid email or password');

    await platformAdminRepository.updateLastLogin(admin.id);
    const tokens = await issueTokenPair({ sub: admin.id, type: 'platform', role: admin.role });

    enqueueEmail({
      type: 'LOGIN_SECURITY_NOTIFICATION',
      to: admin.email,
      params: { fullName: admin.name, occurredAt: new Date().toISOString(), ipAddress: ipAddress || 'unknown' },
    }).catch(() => {}); // fire-and-forget — never block login on mail delivery

    return { ...tokens, principal: admin, principalType: 'platform' };
  },

  // ── Tenant (subdomain) login — TenantLogin.jsx ──
  async loginTenantUser({ school, identifier, password, ipAddress }) {
    if (school.status !== 'ACTIVE') {
      throw ApiError.forbidden(`This school account is ${school.status.toLowerCase()}`);
    }

    const user = await userRepository.findByIdentifierInSchool(school.id, identifier);
    if (!user) throw ApiError.unauthorized('Invalid credentials');
    if (user.status !== 'ACTIVE') throw ApiError.forbidden('Your account is not active. Contact your school admin.');

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw ApiError.unauthorized('Invalid credentials');

    await userRepository.updateLastLogin(user.id);
    const tokens = await issueTokenPair({
      sub: user.id,
      type: 'tenant',
      role: user.role,
      schoolId: school.id,
    });

    const notifyEmail = user.email || user.recoveryEmail;
    if (notifyEmail) {
      enqueueEmail({
        type: 'LOGIN_SECURITY_NOTIFICATION',
        to: notifyEmail,
        params: { fullName: user.fullName, occurredAt: new Date().toISOString(), ipAddress: ipAddress || 'unknown' },
      }).catch(() => {}); // fire-and-forget — never block login on mail delivery
    }

    return { ...tokens, principal: user, principalType: 'tenant' };
  },

  // ── Refresh ──
  async refresh(refreshToken) {
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const stored = await refreshTokenRepository.findValid(refreshToken);
    if (!stored) throw ApiError.unauthorized('Refresh token has been revoked or expired');

    await refreshTokenRepository.revoke(refreshToken); // rotate

    if (decoded.type === 'platform') {
      const admin = await platformAdminRepository.findById(decoded.sub);
      if (!admin || admin.status !== 'ACTIVE') throw ApiError.unauthorized('Account no longer active');
      return issueTokenPair({ sub: admin.id, type: 'platform', role: admin.role });
    }

    const user = await userRepository.findById(decoded.sub);
    if (!user || user.status !== 'ACTIVE') throw ApiError.unauthorized('Account no longer active');
    return issueTokenPair({ sub: user.id, type: 'tenant', role: user.role, schoolId: user.schoolId });
  },

  async logout(refreshToken) {
    await refreshTokenRepository.revoke(refreshToken);
  },

  // ── Forgot password — ForgotPassword.jsx (3-step: email -> code -> new password) ──
  // `schoolId` is required (and ignored) when audience === 'platform'; it is
  // resolved by the controller from the request subdomain for tenant audience.
  async requestPasswordReset({ email, audience, schoolId }) {
    const { ownerType, principal } = await resolvePrincipal(audience, email, schoolId);

    // Always respond success even if not found, to avoid account enumeration.
    if (!principal) return { sent: true };

    const code = generateResetCode();
    await passwordResetRepository.invalidateAllForOwner(ownerType, principal.id);
    await passwordResetRepository.create({
      ownerType,
      ownerId: principal.id,
      codeHash: hashResetCode(code),
      expiresAt: msFromNow(env.resetCodeExpiresMin),
    });

    await enqueueEmail({
      type: 'PASSWORD_RESET_CODE',
      to: email,
      params: { code, expiresInMinutes: env.resetCodeExpiresMin },
    });

    return { sent: true };
  },

  async verifyResetCode({ ownerType, ownerId, code }) {
    const token = await passwordResetRepository.findLatestActive(ownerType, ownerId);
    if (!token) throw ApiError.badRequest('No active reset request found');
    if (token.expiresAt < new Date()) throw ApiError.badRequest('Verification code has expired');
    if (token.codeHash !== hashResetCode(code)) throw ApiError.badRequest('Invalid verification code');
    return token;
  },

  async resetPassword({ ownerType, ownerId, code, newPassword }) {
    const token = await this.verifyResetCode({ ownerType, ownerId, code });
    const passwordHash = await hashPassword(newPassword);

    let recipientEmail;
    if (ownerType === 'PLATFORM_ADMIN') {
      const admin = await platformAdminRepository.findById(ownerId);
      recipientEmail = admin?.email;
      await platformAdminRepository.updatePassword(ownerId, passwordHash);
    } else {
      const user = await userRepository.findById(ownerId);
      recipientEmail = user?.email || user?.recoveryEmail;
      await userRepository.updatePassword(ownerId, passwordHash);
    }

    await passwordResetRepository.markConsumed(token.id);
    await refreshTokenRepository.revokeAllForOwner(ownerType, ownerId);

    if (recipientEmail) {
      await enqueueEmail({
        type: 'PASSWORD_RESET_COMPLETED',
        to: recipientEmail,
        params: { occurredAt: new Date().toISOString() },
      });
    }

    return { reset: true };
  },
};
