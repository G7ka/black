import { schoolConfigService } from '../services/schoolAdmin/schoolConfig.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';

export const getSchoolConfig = asyncHandler(async (req, res) => {
  const config = await schoolConfigService.get(req.auth.schoolId);
  return ok(res, config);
});

export const updateSchoolInfo = asyncHandler(async (req, res) => {
  await schoolConfigService.updateSchoolInfo(req.auth.schoolId, req.body);
  return ok(res, req.body, 'School info updated');
});

export const updateTerms = asyncHandler(async (req, res) => {
  await schoolConfigService.updateTerms(req.auth.schoolId, req.body);
  return ok(res, req.body, 'Terms updated');
});

export const updateNotificationSettings = asyncHandler(async (req, res) => {
  await schoolConfigService.updateNotificationSettings(req.auth.schoolId, req.body);
  return ok(res, req.body, 'Notification settings updated');
});

export const getBillingStatus = asyncHandler(async (req, res) => {
  const status = await schoolConfigService.getBillingStatus(req.auth.schoolId);
  return ok(res, status);
});
