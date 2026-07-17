import { z } from 'zod';

export const reasonSchema = z.object({
  reason: z.string().min(3, 'A reason is required for this action'),
});

export const broadcastSchema = z.object({
  title: z.string().optional(),
  message: z.string().min(1),
});
