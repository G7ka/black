import { prisma } from '../config/prisma.js';

export const timetableRepository = {
  findForClass(classId, streamId) {
    return prisma.timetableEntry.findMany({
      where: { classId, streamId: streamId || null },
      include: { subject: true, teacherProfile: { include: { user: true } } },
    });
  },
  upsertEntry({ schoolId, classId, streamId, dayOfWeek, timeSlot, subjectId, teacherProfileId, room }) {
    return prisma.timetableEntry.upsert({
      where: {
        classId_streamId_dayOfWeek_timeSlot: {
          classId,
          streamId: streamId || null,
          dayOfWeek,
          timeSlot,
        },
      },
      update: { subjectId, teacherProfileId, room },
      create: { schoolId, classId, streamId, dayOfWeek, timeSlot, subjectId, teacherProfileId, room },
    });
  },
  deleteEntry(id) {
    return prisma.timetableEntry.delete({ where: { id } });
  },
  findEntry(classId, streamId, dayOfWeek, timeSlot) {
    return prisma.timetableEntry.findUnique({
      where: { classId_streamId_dayOfWeek_timeSlot: { classId, streamId: streamId || null, dayOfWeek, timeSlot } },
    });
  },
};
