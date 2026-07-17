import { Router } from 'express';
import {
  listStudents,
  getStudent,
  enrollStudent,
  relocateStudent,
  promoteStudent,
  markStudentRepeating,
  bulkPromote,
} from '../controllers/students.controller.js';
import { schoolAdminGuard } from './schoolAdminGuard.js';
import { validate } from '../middlewares/validate.js';
import { enrollStudentSchema, relocateStudentSchema, bulkPromoteSchema } from '../validators/schoolAdmin.validator.js';

const router = Router();
router.use(...schoolAdminGuard);

router.get('/', listStudents);
router.post('/', validate(enrollStudentSchema), enrollStudent);
router.post('/bulk-promote', validate(bulkPromoteSchema), bulkPromote);
router.get('/:id', getStudent);
router.post('/:id/relocate', validate(relocateStudentSchema), relocateStudent);
router.post('/:id/promote', promoteStudent);
router.post('/:id/repeat', markStudentRepeating);

export default router;
