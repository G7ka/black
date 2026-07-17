import { schoolAlertService } from '../services/schoolAdmin/schoolAlert.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';

export const listAlerts = asyncHandler(async (req, res) => {
  const alerts = await schoolAlertService.list(req.auth.schoolId);
  return ok(res, alerts);
});

export const sendAlert = asyncHandler(async (req, res) => {
  const alert = await schoolAlertService.send(req.auth.schoolId, { ...req.body, sentByUserId: req.auth.sub });
  return created(res, alert, `Sent to ${alert.recipientCount} recipient(s) by email`);
});
