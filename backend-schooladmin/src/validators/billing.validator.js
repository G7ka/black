import { z } from 'zod';

// Remove min/max limits - allow any non-negative integer
export const setPriceSchema = z.object({
  pricePerStudent: z.coerce.number().int().min(0),
});