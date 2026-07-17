import { Router } from 'express';
import {
  listTickets,
  getTicket,
  replyTicket,
  resolveTicket,
  ticketStats,
} from '../controllers/supportTicket.controller.js';
import { authenticate, requirePlatformAuth } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';
import { validate } from '../middlewares/validate.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import { listTicketsQuerySchema, replyTicketSchema } from '../validators/supportTicket.validator.js';

const router = Router();

router.use(authenticate, requirePlatformAuth, requireRole('SUPER_ADMIN', 'SUPPORT_AGENT'));

router.get('/', validateQuery(listTicketsQuerySchema), listTickets);
router.get('/stats', ticketStats);
router.get('/:id', getTicket);
router.post('/:id/reply', validate(replyTicketSchema), replyTicket);
router.post('/:id/resolve', resolveTicket);

export default router;
