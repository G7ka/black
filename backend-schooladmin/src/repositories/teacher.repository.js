import { prisma } from '../config/prisma.js';

export const teacherRepository = {
  findAllForSchool(schoolId, { status } = {}) {
    return prisma.teacherProfile.findMany({
      where: { schoolId, ...(status && status !== 'All' && { status }) },
      include: { user: true, classAssignments: true },
      orderBy: { createdAt: 'desc' },
    });
  },
  findById(id) {
    return prisma.teacherProfile.findUnique({
      where: { id },
      include: { user: true, classAssignments: true, absenceReports: true },
    });
  },
  findByIdForSchool(schoolId, id) {
    return prisma.teacherProfile.findFirst({ where: { id, schoolId }, include: { user: true } });
  },
  createWithUser({ userData, profileData }) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data: userData });
      const profile = await tx.teacherProfile.create({
        data: { ...profileData, userId: user.id },
        include: { user: true },
      });
      return profile;
    });
  },
  updateStatus(id, data) {
    return prisma.teacherProfile.update({ where: { id }, data });
  },
  setClassAssignments(teacherProfileId, assignments) {
    // assignments: [{ classId, subjectId }]
    return prisma.$transaction([
      prisma.teacherClassSubject.deleteMany({ where: { teacherProfileId } }),
      prisma.teacherClassSubject.createMany({
        data: assignments.map((a) => ({ teacherProfileId, classId: a.classId, subjectId: a.subjectId ?? null })),
        skipDuplicates: true,
      }),
    ]);
  },
  listAbsenceReports(schoolId) {
    return prisma.teacherAbsenceReport.findMany({
      where: { schoolId },
      include: { teacherProfile: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },
  markReportReviewed(id) {
    return prisma.teacherAbsenceReport.update({ where: { id }, data: { status: 'REVIEWED' } });
  },
};
