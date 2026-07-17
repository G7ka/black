import { classesService } from '../services/schoolAdmin/classes.service.js';
import { toClassDTO, toSubjectDTO } from '../dtos/schoolAdmin.dto.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';

export const listClasses = asyncHandler(async (req, res) => {
  const classes = await classesService.list(req.auth.schoolId);
  return ok(res, classes.map(toClassDTO));
});

export const createClass = asyncHandler(async (req, res) => {
  const cls = await classesService.create(req.auth.schoolId, req.body);
  return created(res, toClassDTO(cls));
});

export const addStream = asyncHandler(async (req, res) => {
  const stream = await classesService.addStream(req.auth.schoolId, req.params.classId, req.body.name);
  return created(res, { id: stream.id, name: stream.name });
});

export const removeStream = asyncHandler(async (req, res) => {
  await classesService.removeStream(req.auth.schoolId, req.params.classId, req.params.streamId);
  return ok(res, null, 'Stream removed');
});

export const setClassSubjects = asyncHandler(async (req, res) => {
  const cls = await classesService.setSubjects(req.auth.schoolId, req.params.classId, req.body.subjectIds);
  return ok(res, toClassDTO(cls), 'Subjects updated');
});

export const listSubjects = asyncHandler(async (req, res) => {
  const subjects = await classesService.listSubjects(req.auth.schoolId);
  return ok(res, subjects.map(toSubjectDTO));
});

export const addSubject = asyncHandler(async (req, res) => {
  const subject = await classesService.addSubject(req.auth.schoolId, req.body.name);
  return created(res, toSubjectDTO(subject));
});

export const removeSubject = asyncHandler(async (req, res) => {
  await classesService.removeSubject(req.auth.schoolId, req.params.subjectId);
  return ok(res, null, 'Subject removed');
});
