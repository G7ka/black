import { teacherService } from '../services/schoolAdmin/teacher.service.js';
import { toTeacherDTO } from '../dtos/schoolAdmin.dto.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';

export const listTeachers = asyncHandler(async (req, res) => {
  const teachers = await teacherService.list(req.auth.schoolId, { status: req.query.status });
  return ok(res, teachers.map(toTeacherDTO));
});

export const getTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.getById(req.auth.schoolId, req.params.id);
  return ok(res, toTeacherDTO(teacher));
});

export const createTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.create(req.auth.schoolId, req.auth.role, req.body);
  return created(res, toTeacherDTO(teacher), 'Teacher added — a set-password code was emailed to them');
});

export const setTeacherOnLeave = asyncHandler(async (req, res) => {
  const teacher = await teacherService.setOnLeave(req.auth.schoolId, req.params.id, req.body);
  return ok(res, toTeacherDTO(teacher), 'Marked as on leave');
});

export const setTeacherActive = asyncHandler(async (req, res) => {
  const teacher = await teacherService.setActive(req.auth.schoolId, req.params.id);
  return ok(res, toTeacherDTO(teacher), 'Marked as active');
});

export const setTeacherInactive = asyncHandler(async (req, res) => {
  const teacher = await teacherService.setInactive(req.auth.schoolId, req.params.id);
  return ok(res, toTeacherDTO(teacher), 'Marked as inactive');
});

export const assignTeacherClasses = asyncHandler(async (req, res) => {
  const teacher = await teacherService.assignClasses(req.auth.schoolId, req.params.id, req.body.assignments);
  return ok(res, toTeacherDTO(teacher), 'Class assignments updated');
});

export const listAbsenceReports = asyncHandler(async (req, res) => {
  const reports = await teacherService.listAbsenceReports(req.auth.schoolId);
  return ok(res, reports);
});

export const reviewAbsenceReport = asyncHandler(async (req, res) => {
  const report = await teacherService.reviewAbsenceReport(req.params.id);
  return ok(res, report, 'Report marked reviewed');
});
