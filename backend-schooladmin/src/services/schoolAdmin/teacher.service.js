import crypto from 'crypto';
import { teacherRepository } from '../../repositories/teacher.repository.js';
import { userRepository } from '../../repositories/user.repository.js';
import { passwordResetRepository } from '../../repositories/passwordReset.repository.js';
import { hashPassword, generateResetCode, hashResetCode } from '../../utils/password.js';
import { ApiError } from '../../utils/ApiError.js';
import { enqueueEmail } from '../../emails/emailQueue.js';
import { env } from '../../config/env.js';

function msFromNow(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function suggestUsername(name) {
  return `${name.trim().toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '')}.teacher`;
}

export const teacherService = {
  list: (schoolId, opts) => teacherRepository.findAllForSchool(schoolId, opts),

  async getById(schoolId, id) {
    const teacher = await teacherRepository.findByIdForSchool(schoolId, id);
    if (!teacher) throw ApiError.notFound('Teacher not found');
    return teacherRepository.findById(id);
  },

  // Mirrors the established pattern (adminCreateSchool, platformAdminManagement.create):
  // unusable random password, set-password code emailed — never a raw password.
  async create(schoolId, schoolLevelRole, { fullName, email, phone, subjectSpecialization }) {
    const existing = await userRepository.findByEmailInSchool(schoolId, email);
    if (existing) throw ApiError.conflict('A staff member with this email already exists');

    const throwawayPassword = crypto.randomBytes(24).toString('hex');
    const passwordHash = await hashPassword(throwawayPassword);
    const username = suggestUsername(fullName);

    const profile = await teacherRepository.createWithUser({
      userData: {
        schoolId,
        role: 'TEACHER',
        fullName,
        email,
        username,
        recoveryEmail: email,
        passwordHash,
        status: 'ACTIVE',
      },
      profileData: { schoolId, subjectSpecialization, status: 'ACTIVE' },
    });

    const code = generateResetCode();
    await passwordResetRepository.create({
      ownerType: 'USER',
      ownerId: profile.userId,
      codeHash: hashResetCode(code),
      expiresAt: msFromNow(env.resetCodeExpiresMin),
    });

    await enqueueEmail({
      type: 'PASSWORD_RESET_CODE',
      to: email,
      params: { code, expiresInMinutes: env.resetCodeExpiresMin },
    });

    return profile;
  },

  async setOnLeave(schoolId, id, { leaveReason, leaveStart, leaveEnd, leaveNotes }) {
    await this.getById(schoolId, id);
    return teacherRepository.updateStatus(id, { status: 'ON_LEAVE', leaveReason, leaveStart, leaveEnd, leaveNotes });
  },

  async setActive(schoolId, id) {
    await this.getById(schoolId, id);
    return teacherRepository.updateStatus(id, {
      status: 'ACTIVE',
      leaveReason: null,
      leaveStart: null,
      leaveEnd: null,
      leaveNotes: null,
    });
  },

  async setInactive(schoolId, id) {
    await this.getById(schoolId, id);
    return teacherRepository.updateStatus(id, { status: 'INACTIVE' });
  },

  async assignClasses(schoolId, id, assignments) {
    await this.getById(schoolId, id);
    await teacherRepository.setClassAssignments(id, assignments);
    return teacherRepository.findById(id);
  },

  listAbsenceReports: (schoolId) => teacherRepository.listAbsenceReports(schoolId),
  reviewAbsenceReport: (id) => teacherRepository.markReportReviewed(id),
};
