import { supportTicketService } from '../services/supportTicket.service.js';
import { toTicketDTO } from '../dtos/supportTicket.dto.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';

export const listTickets = asyncHandler(async (req, res) => {
  const { tickets, total, page, pageSize } = await supportTicketService.list(req.query);
  return ok(res, { tickets: tickets.map(toTicketDTO), total, page, pageSize });
});

export const getTicket = asyncHandler(async (req, res) => {
  const ticket = await supportTicketService.getById(req.params.id);
  return ok(res, toTicketDTO(ticket));
});

export const replyTicket = asyncHandler(async (req, res) => {
  await supportTicketService.reply(req.params.id, {
    authorType: 'PLATFORM_ADMIN',
    authorId: req.auth.sub,
    body: req.body.body,
  });
  const ticket = await supportTicketService.getById(req.params.id);
  return ok(res, toTicketDTO(ticket), 'Reply sent');
});

export const resolveTicket = asyncHandler(async (req, res) => {
  const ticket = await supportTicketService.resolve(req.params.id);
  return ok(res, toTicketDTO(ticket), 'Ticket resolved');
});

export const ticketStats = asyncHandler(async (req, res) => {
  const stats = await supportTicketService.stats();
  return ok(res, stats);
});
