import { schoolReportsService } from '../services/schoolAdmin/schoolReports.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';

export const getSchoolOverviewReport = asyncHandler(async (req, res) => {
  const report = await schoolReportsService.overview(req.auth.schoolId, req.query.term);
  return ok(res, report);
});
