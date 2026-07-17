import { platformAdminRepository } from '../repositories/platformAdmin.repository.js';
import { hashPassword, generateResetCode, hashResetCode } from '../utils/password.js';
import { passwordResetRepository } from '../repositories/passwordReset.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { enqueueEmail } from '../emails/emailQueue.js';
import { env } from '../config/env.js';
import crypto from 'crypto';

function msFromNow(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export const platformAdminManagementService = {
  list: () => platformAdminRepository.findAll(),

  // New admin gets an unusable random password + a set-password code
  // emailed via the existing forgot-password infrastructure — never
  // emails a raw generated password.
  async create({ name, email, role }) {
    const existing = await platformAdminRepository.findByEmail(email);
    if (existing) throw ApiError.conflict('An admin with this email already exists');

    const throwawayPassword = crypto.randomBytes(24).toString('hex');
    const passwordHash = await hashPassword(throwawayPassword);
    const admin = await platformAdminRepository.create({ name, email, role, passwordHash });

    const code = generateResetCode();
    await passwordResetRepository.create({
      ownerType: 'PLATFORM_ADMIN',
      ownerId: admin.id,
      codeHash: hashResetCode(code),
      expiresAt: msFromNow(env.resetCodeExpiresMin),
    });

    await enqueueEmail({
      type: 'PASSWORD_RESET_CODE',
      to: email,
      params: { code, expiresInMinutes: env.resetCodeExpiresMin },
    });

    return admin;
  },

  async remove(id, requesterId) {
    if (id === requesterId) throw ApiError.badRequest('You cannot remove your own account');

    const target = await platformAdminRepository.findById(id);
    if (!target) throw ApiError.notFound('Admin not found');

    if (target.role === 'SUPER_ADMIN') {
      const count = await platformAdminRepository.countActiveSuperAdmins();
      if (count <= 1) throw ApiError.conflict('Cannot remove the last active super admin');
    }

    await platformAdminRepository.deleteById(id);
    return { removed: true };
  },
};
