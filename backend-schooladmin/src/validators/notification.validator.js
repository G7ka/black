import { z } from 'zod';

export const sendSchoolMessageSchema = z.object({
  schoolId: z.string().min(1), // school UUID, or literal "all" for broadcast
  messageType: z.enum(['info', 'warning', 'urgent']).default('info'),
  message: z.string().min(1),
});
