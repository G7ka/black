import { prisma } from '../config/prisma.js';

export const emailLogRepository = {
  logSent({ type, recipient, subject }) {
    return prisma.emailLog.create({
      data: { type, recipient, subject, status: 'SENT' },
    });
  },
  logFailed({ type, recipient, subject, error }) {
    return prisma.emailLog.create({
      data: { type, recipient, subject, status: 'FAILED', error: String(error).slice(0, 2000) },
    });
  },
  list({ skip = 0, take = 50 } = {}) {
    return prisma.emailLog.findMany({ orderBy: { createdAt: 'desc' }, skip, take });
  },
};
