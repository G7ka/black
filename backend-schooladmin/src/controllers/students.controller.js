import { studentService } from '../services/schoolAdmin/student.service.js';
import { toStudentDTO } from '../dtos/schoolAdmin.dto.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';

export const listStudents = asyncHandler(async (req, res) => {
  const students = await studentService.list(req.auth.schoolId, { classId: req.query.classId, search: req.query.search });
  return ok(res, students.map(toStudentDTO));
});

export const getStudent = asyncHandler(async (req, res) => {
  const student = await studentService.getById(req.auth.schoolId, req.params.id);
  return ok(res, toStudentDTO(student));
});

export const enrollStudent = asyncHandler(async (req, res) => {
  const student = await studentService.enroll(req.auth.schoolId, req.body);
  return created(res, toStudentDTO(student), 'Student enrolled');
});

export const relocateStudent = asyncHandler(async (req, res) => {
  const student = await studentService.relocate(req.auth.schoolId, req.params.id, req.body);
  return ok(res, toStudentDTO(student), 'Student relocated');
});

export const promoteStudent = asyncHandler(async (req, res) => {
  const student = await studentService.promote(req.auth.schoolId, req.params.id);
  return ok(res, toStudentDTO(student), 'Student promoted');
});

export const markStudentRepeating = asyncHandler(async (req, res) => {
  const student = await studentService.markRepeating(req.auth.schoolId, req.params.id, req.body.reason);
  return ok(res, toStudentDTO(student), 'Student marked to repeat');
});

export const bulkPromote = asyncHandler(async (req, res) => {
  const results = await studentService.bulkPromote(req.auth.schoolId, req.body.decisions);
  return ok(res, results.map(toStudentDTO), 'Bulk promotion applied');
});
