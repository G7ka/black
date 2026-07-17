import { prisma } from '../config/prisma.js';

export const auditLogRepository = {
  record({ action, performedById, performedByName, reason, metadata }) {
    return prisma.emergencyAuditLog.create({
      data: { action, performedById, performedByName, reason, metadata },
    });
  },
  list({ skip = 0, take = 50 } = {}) {
    return prisma.emergencyAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  },
};
