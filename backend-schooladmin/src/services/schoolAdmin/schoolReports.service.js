import { prisma } from '../../config/prisma.js';
import { feesService } from './fees.service.js';

export const schoolReportsService = {
  async overview(schoolId, term) {
    const [totalStudents, totalTeachers, classes] = await Promise.all([
      prisma.student.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.teacherProfile.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.schoolClass.count({ where: { schoolId } }),
    ]);

    const paymentRows = term ? await feesService.listPaymentStatus(schoolId, term) : [];
    const totalExpected = paymentRows.reduce((s, r) => s + r.expected, 0);
    const totalCollected = paymentRows.reduce((s, r) => s + r.paid, 0);

    return {
      totalStudents,
      totalTeachers,
      totalClasses: classes,
      feeCollection: {
        term: term || null,
        expected: totalExpected,
        collected: totalCollected,
        collectionRate: totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0,
      },
    };
  },
};
