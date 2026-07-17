import { attendanceService } from '../services/schoolAdmin/attendance.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';

export const getAttendanceOverview = asyncHandler(async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const overview = await attendanceService.overviewForDate(req.auth.schoolId, date);
  return ok(res, overview);
});
