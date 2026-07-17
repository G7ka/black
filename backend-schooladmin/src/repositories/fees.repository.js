import { prisma } from '../config/prisma.js';

export const feesRepository = {
  findAllStructuresForSchool(schoolId) {
    return prisma.classFeeStructure.findMany({
      where: { schoolId },
      include: { class: true },
      orderBy: { class: { order: 'asc' } },
    });
  },
  upsertStructure({ schoolId, classId, term, tuition, lunch, activities }) {
    return prisma.classFeeStructure.upsert({
      where: { classId },
      update: { term, tuition, lunch, activities },
      create: { schoolId, classId, term, tuition, lunch, activities },
    });
  },
  findStructureForClass(classId) {
    return prisma.classFeeStructure.findUnique({ where: { classId } });
  },
  recordPayment(data) {
    return prisma.studentFeePayment.create({ data });
  },
  paymentsForSchool(schoolId, { term } = {}) {
    return prisma.studentFeePayment.findMany({
      where: { schoolId, ...(term && { term }) },
      include: { student: { include: { class: true, parents: { include: { parent: true } } } } },
      orderBy: { paidAt: 'desc' },
    });
  },
  sumPaidForStudent(studentId, term) {
    return prisma.studentFeePayment
      .aggregate({ where: { studentId, term }, _sum: { amount: true } })
      .then((r) => r._sum.amount || 0);
  },
};
