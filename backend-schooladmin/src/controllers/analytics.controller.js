import { analyticsService } from '../services/analytics.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';

export const getOverview = asyncHandler(async (req, res) => {
  const data = await analyticsService.overview();
  return ok(res, data);
});

export const getGrowth = asyncHandler(async (req, res) => {
  const data = await analyticsService.schoolGrowthByMonth();
  return ok(res, data);
});
