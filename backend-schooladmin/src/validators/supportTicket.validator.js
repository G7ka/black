import { z } from 'zod';

export const listTicketsQuerySchema = z.object({
  status: z.enum(['all', 'open', 'in-progress', 'resolved']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const replyTicketSchema = z.object({
  body: z.string().min(1),
});
