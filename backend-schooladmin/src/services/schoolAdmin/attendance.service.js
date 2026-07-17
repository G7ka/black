import { attendanceRepository } from '../../repositories/attendance.repository.js';

export const attendanceService = {
  // Returns real per-class breakdown for the date. Will be all-zero
  // until the Teacher module (per-student marking) ships — that's
  // accurate, not a bug; we don't fabricate attendance data here.
  async overviewForDate(schoolId, date) {
    const classes = await attendanceRepository.classBreakdownForDate(schoolId, date);
    const totals = classes.reduce(
      (acc, c) => ({ total: acc.total + c.total, present: acc.present + c.present, absent: acc.absent + c.absent }),
      { total: 0, present: 0, absent: 0 }
    );
    return {
      classes,
      summary: {
        totalStudents: totals.total,
        present: totals.present,
        absent: totals.absent,
        overallRate: totals.total > 0 ? `${((totals.present / totals.total) * 100).toFixed(1)}%` : '—',
      },
    };
  },
};
