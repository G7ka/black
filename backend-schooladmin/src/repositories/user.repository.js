import { prisma } from '../config/prisma.js';

export const userRepository = {
  /**
   * Resolves a login identifier within a single school's scope.
   * Tries email, then username, then studentCode — matches the
   * TenantLogin.jsx UX where the same input field accepts any of these.
   */
  async findByIdentifierInSchool(schoolId, identifier) {
    return prisma.user.findFirst({
      where: {
        schoolId,
        OR: [
          { email: identifier },
          { username: identifier },
          { studentCode: identifier },
        ],
      },
    });
  },
  findById(id) {
    return prisma.user.findUnique({ where: { id } });
  },
  findByEmailInSchool(schoolId, email) {
    return prisma.user.findFirst({ where: { schoolId, email } });
  },
  updateLastLogin(id) {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  },
  updatePassword(id, passwordHash) {
    return prisma.user.update({ where: { id }, data: { passwordHash } });
  },
  create(data) {
    return prisma.user.create({ data });
  },
};
