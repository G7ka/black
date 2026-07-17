import { billingService } from '../services/billing.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';

export const listBilling = asyncHandler(async (req, res) => {
  const data = await billingService.listSchoolsWithBilling();
  return ok(res, data);
});

export const setPricePerStudent = asyncHandler(async (req, res) => {
  const price = await billingService.setPricePerStudent(req.body.pricePerStudent);
  return ok(res, { pricePerStudent: price }, 'Price per student updated');
});

export const sendPaymentReminder = asyncHandler(async (req, res) => {
  await billingService.sendReminder(req.params.schoolId);
  return ok(res, { sent: true }, 'Reminder sent');
});
