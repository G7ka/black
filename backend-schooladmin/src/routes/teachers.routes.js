import { Router } from 'express';
import {
  listTeachers,
  getTeacher,
  createTeacher,
  setTeacherOnLeave,
  setTeacherActive,
  setTeacherInactive,
  assignTeacherClasses,
  listAbsenceReports,
  reviewAbsenceReport,
} from '../controllers/teachers.controller.js';
import { schoolAdminGuard } from './schoolAdminGuard.js';
import { validate } from '../middlewares/validate.js';
import { createTeacherSchema, leaveSchema, assignClassesSchema } from '../validators/schoolAdmin.validator.js';

const router = Router();
router.use(...schoolAdminGuard);

router.get('/', listTeachers);
router.post('/', validate(createTeacherSchema), createTeacher);
router.get('/absence-reports', listAbsenceReports);
router.post('/absence-reports/:id/review', reviewAbsenceReport);
router.get('/:id', getTeacher);
router.post('/:id/leave', validate(leaveSchema), setTeacherOnLeave);
router.post('/:id/activate', setTeacherActive);
router.post('/:id/deactivate', setTeacherInactive);
router.put('/:id/classes', validate(assignClassesSchema), assignTeacherClasses);

export default router;
