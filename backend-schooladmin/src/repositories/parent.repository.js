import { prisma } from '../config/prisma.js';

export const parentRepository = {
  findAllForSchool(schoolId, { search, status } = {}) {
    return prisma.parent.findMany({
      where: {
        schoolId,
        ...(status && status !== 'All' && { status: status.toUpperCase() }),
        ...(search && {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search } },
          ],
        }),
      },
      include: { students: { include: { student: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },
  findById(id) {
    return prisma.parent.findUnique({
      where: { id },
      include: { students: { include: { student: true } }, user: true },
    });
  },
  findByIdForSchool(schoolId, id) {
    return prisma.parent.findFirst({ where: { id, schoolId } });
  },
  findByEmailInSchool(schoolId, email) {
    return prisma.parent.findFirst({ where: { schoolId, email } });
  },
  create(data) {
    return prisma.parent.create({ data });
  },
  update(id, data) {
    return prisma.parent.update({ where: { id }, data });
  },
};
