import { prisma } from '../config/prisma.js';

export const platformAdminRepository = {
  findByEmail(email) {
    return prisma.platformAdmin.findUnique({ where: { email } });
  },
  findById(id) {
    return prisma.platformAdmin.findUnique({ where: { id } });
  },
  updateLastLogin(id) {
    return prisma.platformAdmin.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  },
  updatePassword(id, passwordHash) {
    return prisma.platformAdmin.update({
      where: { id },
      data: { passwordHash },
    });
  },
  findActiveSuperAdmins() {
    return prisma.platformAdmin.findMany({
      where: { role: 'SUPER_ADMIN', status: 'ACTIVE' },
      select: { email: true },
    });
  },
  findAll() {
    return prisma.platformAdmin.findMany({ orderBy: { createdAt: 'desc' } });
  },
  countActiveSuperAdmins() {
    return prisma.platformAdmin.count({ where: { role: 'SUPER_ADMIN', status: 'ACTIVE' } });
  },
  deleteById(id) {
    return prisma.platformAdmin.delete({ where: { id } });
  },
  create(data) {
    return prisma.platformAdmin.create({ data });
  },
};
