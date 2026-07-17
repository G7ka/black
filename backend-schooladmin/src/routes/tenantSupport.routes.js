import { Router } from 'express';
import { listMyTickets, createMyTicket, getMyTicket, replyToMyTicket } from '../controllers/tenantSupport.controller.js';
import { schoolAdminGuard } from './schoolAdminGuard.js';
import { validate } from '../middlewares/validate.js';
import { z } from 'zod';

const createTicketSchema = z.object({
  subject: z.string().min(1),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
});
const replySchema = z.object({ body: z.string().min(1) });

const router = Router();
router.use(...schoolAdminGuard);

router.get('/', listMyTickets);
router.post('/', validate(createTicketSchema), createMyTicket);
router.get('/:id', getMyTicket);
router.post('/:id/reply', validate(replySchema), replyToMyTicket);

export default router;
