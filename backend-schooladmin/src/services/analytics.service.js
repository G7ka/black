import { prisma } from '../config/prisma.js';
import { billingService } from './billing.service.js';

/**
 * Every number here is derived from real rows. Metrics the frontend
 * mockups show that we cannot yet back with real data (teacher counts,
 * actual enrolled-student counts, churn rate, CAC/LTV) are intentionally
 * omitted rather than fabricated — they depend on entities introduced in
 * later phases (Phase 4: academic data) or external accounting data.
 */
export const analyticsService = {
  async overview() {
    const [totalSchools, byStatus, byLevel, byDistrictRaw, declaredStudents] = await Promise.all([
      prisma.school.count(),
      prisma.school.groupBy({ by: ['status'], _count: true }),
      prisma.school.groupBy({ by: ['level'], _count: true }),
      prisma.school.groupBy({ by: ['district'], _count: true, where: { status: 'ACTIVE' } }),
      prisma.school.aggregate({ _sum: { numStudentsDeclared: true }, where: { status: 'ACTIVE' } }),
    ]);

    const statusMap = Object.fromEntries(byStatus.map((s) => [s.status, s._count]));
    const levelMap = Object.fromEntries(byLevel.map((l) => [l.level, l._count]));

    const { summary: billingSummary } = await billingService.listSchoolsWithBilling();

    return {
      totalSchools,
      activeSchools: statusMap.ACTIVE || 0,
      pendingApplications: statusMap.PENDING || 0,
      suspendedSchools: statusMap.SUSPENDED || 0,
      rejectedSchools: statusMap.REJECTED || 0,
      primarySchools: levelMap.PRIMARY || 0,
      secondarySchools: levelMap.SECONDARY || 0,
      declaredStudents: declaredStudents._sum.numStudentsDeclared || 0,
      schoolsByDistrict: byDistrictRaw.map((d) => ({ district: d.district, count: d._count })),
      monthlyRevenue: billingSummary.monthlyRevenue,
      pricePerStudent: billingSummary.pricePerStudent,
      overdueInvoices: billingSummary.overdueCount,
    };
  },

  // Real registration growth curve — grouped by the school's actual
  // createdAt month. Returns however many months of real data exist;
  // does not backfill or invent earlier months.
  async schoolGrowthByMonth() {
    const schools = await prisma.school.findMany({ select: { createdAt: true } });
    const counts = {};
    for (const s of schools) {
      const key = `${s.createdAt.getFullYear()}-${String(s.createdAt.getMonth() + 1).padStart(2, '0')}`;
      counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([period, newSchools]) => ({ period, newSchools }));
  },
};
