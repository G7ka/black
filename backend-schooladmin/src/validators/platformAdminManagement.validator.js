import { z } from 'zod';

export const createPlatformAdminSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['SUPER_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_AGENT', 'CONTENT_MANAGER']),
});
