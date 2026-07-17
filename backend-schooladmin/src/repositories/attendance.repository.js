import { prisma } from '../config/prisma.js';

export const attendanceRepository = {
  // Aggregate present/absent per class for a given date — powers the
  // School Admin attendance overview (per-student marking is a Teacher
  // module concern, not built here).
  async classBreakdownForDate(schoolId, date) {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const classes = await prisma.schoolClass.findMany({
      where: { schoolId },
      orderBy: { order: 'asc' },
      include: { _count: { select: { students: true } } },
    });

    const records = await prisma.attendanceRecord.findMany({
      where: { schoolId, date: { gte: dayStart, lte: dayEnd } },
    });

    return classes.map((cls) => {
      const classRecords = records.filter((r) => r.classId === cls.id);
      const present = classRecords.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
      const absent = classRecords.filter((r) => r.status === 'ABSENT').length;
      const total = cls._count.students;
      return {
        classId: cls.id,
        name: cls.name,
        total,
        present,
        absent,
        rate: total > 0 ? `${((present / total) * 100).toFixed(1)}%` : '—',
      };
    });
  },
};
