import { feesService } from '../services/schoolAdmin/fees.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';

export const listFeeStructures = asyncHandler(async (req, res) => {
  const structures = await feesService.listStructures(req.auth.schoolId);
  return ok(res, structures);
});

export const saveFeeStructure = asyncHandler(async (req, res) => {
  const structure = await feesService.saveStructure(req.auth.schoolId, req.body);
  return ok(res, structure, 'Fee structure saved');
});

export const listPaymentStatus = asyncHandler(async (req, res) => {
  const rows = await feesService.listPaymentStatus(req.auth.schoolId, req.query.term);
  return ok(res, rows);
});

export const recordPayment = asyncHandler(async (req, res) => {
  const payment = await feesService.recordPayment(req.auth.schoolId, { ...req.body, recordedByUserId: req.auth.sub });
  return ok(res, payment, 'Payment recorded');
});

export const sendFeeReminder = asyncHandler(async (req, res) => {
  const result = await feesService.sendReminder(req.auth.schoolId, req.params.studentId, req.query.term || req.body.term);
  return ok(res, result, 'Reminder sent');
});
