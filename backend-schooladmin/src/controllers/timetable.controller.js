import { timetableService } from '../services/schoolAdmin/timetable.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';

export const getClassTimetable = asyncHandler(async (req, res) => {
  const entries = await timetableService.getForClass(req.auth.schoolId, req.params.classId, req.query.streamId);
  return ok(res, entries);
});

export const saveTimetableSlot = asyncHandler(async (req, res) => {
  const entry = await timetableService.saveSlot(req.auth.schoolId, req.body);
  return ok(res, entry, 'Slot saved');
});

export const deleteTimetableSlot = asyncHandler(async (req, res) => {
  await timetableService.deleteSlot(req.auth.schoolId, req.params.classId, req.query.streamId, req.query.dayOfWeek, req.query.timeSlot);
  return ok(res, null, 'Slot removed');
});
