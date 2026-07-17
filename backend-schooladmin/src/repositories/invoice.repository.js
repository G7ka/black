import { prisma } from '../config/prisma.js';

export const invoiceRepository = {
  findBySchoolAndPeriod(schoolId, period) {
    return prisma.invoice.findUnique({ where: { schoolId_period: { schoolId, period } } });
  },
  create(data) {
    return prisma.invoice.create({ data });
  },
  createMany(data) {
    return prisma.invoice.createMany({ data, skipDuplicates: true });
  },
  findManyBySchoolAndPeriod(schoolIds, period) {
    return prisma.invoice.findMany({ where: { schoolId: { in: schoolIds }, period } });
  },
  listActiveSchoolsWithCurrentInvoice(period) {
    return prisma.school.findMany({
      where: { status: 'ACTIVE' },
      include: {
        invoices: { where: { period }, take: 1 },
      },
      orderBy: { name: 'asc' },
    });
  },
  markOverdue(id) {
    return prisma.invoice.update({ where: { id }, data: { status: 'OVERDUE' } });
  },
  markPaid(id) {
    return prisma.invoice.update({ where: { id }, data: { status: 'PAID', paidAt: new Date() } });
  },
};
