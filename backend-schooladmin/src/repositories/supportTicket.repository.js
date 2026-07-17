import { prisma } from '../config/prisma.js';

export const supportTicketRepository = {
  findMany({ status, search, schoolId, skip = 0, take = 20 }) {
    const where = {
      ...(schoolId && { schoolId }),
      ...(status && status !== 'all' && { status: status.toUpperCase().replace('-', '_') }),
      ...(search && {
        OR: [
          { subject: { contains: search, mode: 'insensitive' } },
          { school: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };
    return Promise.all([
      prisma.supportTicket.findMany({
        where,
        skip,
        take,
        include: { school: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.supportTicket.count({ where }),
    ]);
  },
  findById(id) {
    return prisma.supportTicket.findUnique({
      where: { id },
      include: { school: { select: { name: true } }, replies: { orderBy: { createdAt: 'asc' } } },
    });
  },
  create(data) {
    return prisma.supportTicket.create({ data });
  },
  updateStatus(id, status) {
    return prisma.supportTicket.update({ where: { id }, data: { status } });
  },
  addReply(ticketId, data) {
    return prisma.ticketReply.create({ data: { ticketId, ...data } });
  },
  countByStatus() {
    return prisma.supportTicket.groupBy({ by: ['status'], _count: true });
  },
};
