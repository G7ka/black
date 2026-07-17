import { notificationService } from '../services/notification.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';

export const sendSchoolMessage = asyncHandler(async (req, res) => {
  const result = await notificationService.sendToSchool(req.body);
  return ok(res, result, `Message sent to ${result.sentTo} school(s)`);
});
