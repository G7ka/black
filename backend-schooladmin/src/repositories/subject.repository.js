import { prisma } from '../config/prisma.js';

export const subjectRepository = {
  findAllForSchool(schoolId) {
    return prisma.subject.findMany({ where: { schoolId }, orderBy: { name: 'asc' } });
  },
  findById(id) {
    return prisma.subject.findUnique({ where: { id } });
  },
  create(schoolId, name) {
    return prisma.subject.create({ data: { schoolId, name } });
  },
  createMany(schoolId, names) {
    return prisma.subject.createMany({ data: names.map((name) => ({ schoolId, name })), skipDuplicates: true });
  },
  delete(id) {
    return prisma.subject.delete({ where: { id } });
  },
};
