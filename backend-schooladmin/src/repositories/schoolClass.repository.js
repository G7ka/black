import { prisma } from '../config/prisma.js';

export const schoolClassRepository = {
  findAllForSchool(schoolId) {
    return prisma.schoolClass.findMany({
      where: { schoolId },
      orderBy: { order: 'asc' },
      include: {
        streams: true,
        classSubjects: { include: { subject: true } },
        _count: { select: { students: true } },
      },
    });
  },
  findById(id) {
    return prisma.schoolClass.findUnique({
      where: { id },
      include: { streams: true, classSubjects: { include: { subject: true } } },
    });
  },
  findByIdForSchool(schoolId, id) {
    return prisma.schoolClass.findFirst({ where: { id, schoolId } });
  },
  create(data) {
    return prisma.schoolClass.create({ data });
  },
  nextOrder(schoolId) {
    return prisma.schoolClass
      .aggregate({ where: { schoolId }, _max: { order: true } })
      .then((r) => (r._max.order ?? 0) + 1);
  },
  setSubjects(classId, subjectIds) {
    return prisma.$transaction([
      prisma.classSubject.deleteMany({ where: { classId } }),
      prisma.classSubject.createMany({
        data: subjectIds.map((subjectId) => ({ classId, subjectId })),
        skipDuplicates: true,
      }),
    ]);
  },
  addStream(classId, name) {
    return prisma.schoolClassStream.create({ data: { classId, name } });
  },
  removeStream(streamId) {
    return prisma.schoolClassStream.delete({ where: { id: streamId } });
  },
  findStreamById(id) {
    return prisma.schoolClassStream.findUnique({ where: { id } });
  },
  // Used to resolve "next class" during promotion — classes ordered
  // sequentially within a school.
  findNextClass(schoolId, currentOrder) {
    return prisma.schoolClass.findFirst({
      where: { schoolId, order: { gt: currentOrder } },
      orderBy: { order: 'asc' },
    });
  },
  countStudents(classId) {
    return prisma.student.count({ where: { classId, status: 'ACTIVE' } });
  },
};
