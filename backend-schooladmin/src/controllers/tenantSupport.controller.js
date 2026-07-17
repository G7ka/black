import { supportTicketService } from '../services/supportTicket.service.js';
import { toTicketDTO } from '../dtos/supportTicket.dto.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

async function assertOwnedByTenant(req, ticketId) {
  const ticket = await supportTicketService.getById(ticketId);
  if (ticket.schoolId !== req.auth.schoolId) throw ApiError.forbidden('This ticket does not belong to your school');
  return ticket;
}

export const listMyTickets = asyncHandler(async (req, res) => {
  const { tickets } = await supportTicketService.list({ schoolId: req.auth.schoolId, page: 1, pageSize: 100 });
  return ok(res, tickets.map(toTicketDTO));
});

export const createMyTicket = asyncHandler(async (req, res) => {
  const ticket = await supportTicketService.create({
    schoolId: req.auth.schoolId,
    subject: req.body.subject,
    priority: req.body.priority || 'MEDIUM',
  });
  return created(res, toTicketDTO(ticket), 'Ticket submitted to EduManage support');
});

export const getMyTicket = asyncHandler(async (req, res) => {
  const ticket = await assertOwnedByTenant(req, req.params.id);
  return ok(res, toTicketDTO(ticket));
});

export const replyToMyTicket = asyncHandler(async (req, res) => {
  await assertOwnedByTenant(req, req.params.id);
  await supportTicketService.reply(req.params.id, {
    authorType: 'SCHOOL',
    authorId: req.auth.sub,
    body: req.body.body,
  });
  const ticket = await supportTicketService.getById(req.params.id);
  return ok(res, toTicketDTO(ticket), 'Reply sent');
});
