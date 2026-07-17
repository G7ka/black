import { prisma } from '../config/prisma.js';

export const schoolAlertRepository = {
  create(data) {
    return prisma.schoolAlert.create({ data });
  },
  listForSchool(schoolId, { take = 20 } = {}) {
    return prisma.schoolAlert.findMany({ where: { schoolId }, orderBy: { createdAt: 'desc' }, take });
  },
};
