import { supportTicketRepository } from '../repositories/supportTicket.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { enqueueEmail } from '../emails/emailQueue.js';
import { schoolRepository } from '../repositories/school.repository.js';

export const supportTicketService = {
  list({ status, search, schoolId, page = 1, pageSize = 20 }) {
    const skip = (page - 1) * pageSize;
    return supportTicketRepository
      .findMany({ status, search, schoolId, skip, take: pageSize })
      .then(([tickets, total]) => ({ tickets, total, page, pageSize }));
  },

  async getById(id) {
    const ticket = await supportTicketRepository.findById(id);
    if (!ticket) throw ApiError.notFound('Ticket not found');
    return ticket;
  },

  // Created by tenant-side support pages in later phases; kept here since
  // the model and repository are scoped to this phase.
  create({ schoolId, subject, priority }) {
    return supportTicketRepository.create({ schoolId, subject, priority });
  },

  async reply(ticketId, { authorType, authorId, body }) {
    const ticket = await this.getById(ticketId);
    const reply = await supportTicketRepository.addReply(ticketId, { authorType, authorId, body });

    if (authorType === 'PLATFORM_ADMIN' && ticket.status === 'OPEN') {
      await supportTicketRepository.updateStatus(ticketId, 'IN_PROGRESS');
    }

    if (authorType === 'PLATFORM_ADMIN') {
      const school = await schoolRepository.findById(ticket.schoolId);
      if (school) {
        await enqueueEmail({
          type: 'SCHOOL_ADMIN_NOTIFICATION',
          to: school.contactEmail,
          params: {
            schoolName: school.name,
            messageType: 'info',
            message: `Support replied to your ticket "${ticket.subject}": ${body}`,
          },
        });
      }
    }

    return reply;
  },

  async resolve(ticketId) {
    await this.getById(ticketId);
    return supportTicketRepository.updateStatus(ticketId, 'RESOLVED');
  },

  async stats() {
    const grouped = await supportTicketRepository.countByStatus();
    const base = { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0 };
    for (const g of grouped) base[g.status] = g._count;
    return base;
  },
};
