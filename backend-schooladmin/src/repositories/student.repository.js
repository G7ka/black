import { prisma } from '../config/prisma.js';

export const studentRepository = {
  findAllForSchool(schoolId, { classId, search } = {}) {
    return prisma.student.findMany({
      where: {
        schoolId,
        ...(classId && { classId }),
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { studentCode: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        class: true,
        stream: true,
        parents: { include: { parent: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
  findById(id) {
    return prisma.student.findUnique({
      where: { id },
      include: { class: true, stream: true, parents: { include: { parent: true } }, feePayments: true },
    });
  },
  findByIdForSchool(schoolId, id) {
    return prisma.student.findFirst({ where: { id, schoolId }, include: { class: true, stream: true } });
  },
  countForSchool(schoolId) {
    return prisma.student.count({ where: { schoolId, status: 'ACTIVE' } });
  },
  create(data) {
    return prisma.student.create({ data, include: { class: true } });
  },
  update(id, data) {
    return prisma.student.update({ where: { id }, data });
  },
  linkParent(studentId, parentId, relationship) {
    return prisma.studentParent.upsert({
      where: { studentId_parentId: { studentId, parentId } },
      update: {},
      create: { studentId, parentId, relationship: relationship || 'Parent/Guardian' },
    });
  },
  countCodesLike(schoolId, prefix) {
    return prisma.student.count({ where: { schoolId, studentCode: { startsWith: prefix } } });
  },
};
