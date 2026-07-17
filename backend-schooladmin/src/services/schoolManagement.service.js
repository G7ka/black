import { schoolRepository } from '../repositories/school.repository.js';
import { passwordResetRepository } from '../repositories/passwordReset.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { enqueueEmail } from '../emails/emailQueue.js';
import { signAccessToken } from '../utils/jwt.js';
import { hashPassword, generateResetCode, hashResetCode } from '../utils/password.js';
import { env } from '../config/env.js';
import crypto from 'crypto';

function msFromNow(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function suggestUsername(name) {
  return `${name.trim().toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '')}.admin`;
}

export const schoolManagementService = {
  list({ status, level, search, page = 1, pageSize = 20 }) {
    const skip = (page - 1) * pageSize;
    return schoolRepository
      .findMany({ status, level, search, skip, take: pageSize })
      .then(([schools, total]) => ({ schools, total, page, pageSize }));
  },

  async getById(id) {
    const school = await schoolRepository.findById(id);
    if (!school) throw ApiError.notFound('School not found');
    return school;
  },

  async approve(id) {
    const school = await this.getById(id);
    if (school.status !== 'PENDING') throw ApiError.conflict('Only pending applications can be approved');

    const updated = await schoolRepository.updateStatus(id, 'ACTIVE');
    await schoolRepository.activateAllUsers(id);

    const admin = await schoolRepository.firstAdminUser(id);
    await enqueueEmail({
      type: 'ACCOUNT_ACTIVATION',
      to: school.contactEmail,
      params: {
        recipientName: school.contactName,
        contextLabel: `${school.name}'s EduManage portal`,
        loginUrl: `https://${school.subdomain}.edumanage.ug`,
      },
    });

    return { school: updated, admin };
  },

  async reject(id, reason) {
    const school = await this.getById(id);
    if (school.status !== 'PENDING') throw ApiError.conflict('Only pending applications can be rejected');

    const updated = await schoolRepository.updateStatus(id, 'REJECTED', { rejectionReason: reason });
    await enqueueEmail({
      type: 'APPLICATION_REJECTED',
      to: school.contactEmail,
      params: { contactName: school.contactName, schoolName: school.name, reason },
    });
    return updated;
  },

  async suspend(id, reason) {
    const school = await this.getById(id);
    if (school.status !== 'ACTIVE') throw ApiError.conflict('Only active schools can be suspended');

    const updated = await schoolRepository.updateStatus(id, 'SUSPENDED');
    await enqueueEmail({
      type: 'ACCOUNT_SUSPENSION',
      to: school.contactEmail,
      params: { recipientName: school.contactName, contextLabel: school.name, reason },
    });
    return updated;
  },

  async reactivate(id) {
    const school = await this.getById(id);
    if (school.status !== 'SUSPENDED') throw ApiError.conflict('Only suspended schools can be reactivated');
    return schoolRepository.updateStatus(id, 'ACTIVE');
  },

  async remove(id) {
    await this.getById(id);
    await schoolRepository.delete(id);
    return { deleted: true };
  },

  async renameSchool(id, newName) {
    await this.getById(id);
    return schoolRepository.updateName(id, newName);
  },

  // Add School — SASchools.jsx "Add School" modal. Platform-created
  // schools go straight to ACTIVE (no approval queue); the admin user
  // is provisioned with an unusable random password and immediately
  // sent a set-password code via the existing forgot-password flow
  // (never emails the raw password itself).
  async adminCreateSchool(payload) {
    const { available } = await (async () => {
      const taken = await schoolRepository.isSubdomainTaken(payload.subdomain);
      return { available: !taken };
    })();
    if (!available) throw ApiError.conflict('Subdomain is not available');

    const adminRole = payload.level === 'Primary' ? 'SCHOOLADMIN_PRIMARY' : 'SCHOOLADMIN_SECONDARY';
    const throwawayPassword = crypto.randomBytes(24).toString('hex');
    const passwordHash = await hashPassword(throwawayPassword);
    const username = suggestUsername(payload.contactName);

    const { school, admin } = await schoolRepository.createWithAdmin({
      schoolData: {
        name: payload.schoolName,
        level: payload.level.toUpperCase(),
        subdomain: payload.subdomain,
        physicalAddress: payload.physicalAddress,
        district: payload.district,
        contactName: payload.contactName,
        contactPhone: payload.contactPhone,
        contactEmail: payload.contactEmail,
        numStudentsDeclared: payload.numStudents,
        status: 'ACTIVE',
      },
      adminData: {
        role: adminRole,
        fullName: payload.contactName,
        username,
        email: payload.contactEmail,
        recoveryEmail: payload.contactEmail,
        passwordHash,
        status: 'ACTIVE',
      },
    });

    const code = generateResetCode();
    await passwordResetRepository.create({
      ownerType: 'USER',
      ownerId: admin.id,
      codeHash: hashResetCode(code),
      expiresAt: msFromNow(env.resetCodeExpiresMin),
    });

    await enqueueEmail({
      type: 'PASSWORD_RESET_CODE',
      to: payload.contactEmail,
      params: { code, expiresInMinutes: env.resetCodeExpiresMin },
    });

    return { school, admin, username };
  },

  // Issues a short-lived tenant access token for the platform admin to
  // impersonate the school's primary admin. Every call is expected to be
  // audit-logged by the caller (see emergency/audit middleware in the
  // controller layer).
  async impersonate(id) {
    const school = await this.getById(id);
    if (school.status !== 'ACTIVE') throw ApiError.conflict('School is not active');

    const admin = await schoolRepository.firstAdminUser(id);
    if (!admin) throw ApiError.notFound('No school admin account found for this school');

    const accessToken = signAccessToken({
      sub: admin.id,
      type: 'tenant',
      role: admin.role,
      schoolId: school.id,
      impersonatedBy: 'platform_admin',
    });

    return { accessToken, school, admin };
  },
};
