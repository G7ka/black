import { z } from 'zod';

export const refundSchema = z.object({
  amount: z.coerce.number().positive(),
  remarks: z.string().min(3, 'A reason for the refund is required'),
});

// Pesapal's IPN can arrive as GET (query params) or POST (JSON body) —
// this validates whichever shape the controller pulls the fields into.
export const ipnPayloadSchema = z.object({
  OrderTrackingId: z.string().min(1),
  OrderMerchantReference: z.string().min(1),
  OrderNotificationType: z.string().min(1),
});

export const callbackQuerySchema = z.object({
  OrderTrackingId: z.string().min(1),
  OrderMerchantReference: z.string().optional(),
  OrderNotificationType: z.string().optional(),
});
