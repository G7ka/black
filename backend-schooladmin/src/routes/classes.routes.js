import { Router } from 'express';
import {
  listClasses,
  createClass,
  addStream,
  removeStream,
  setClassSubjects,
  listSubjects,
  addSubject,
  removeSubject,
} from '../controllers/classes.controller.js';
import { schoolAdminGuard } from './schoolAdminGuard.js';
import { validate } from '../middlewares/validate.js';
import { createClassSchema, addStreamSchema, setClassSubjectsSchema, addSubjectSchema } from '../validators/schoolAdmin.validator.js';

const router = Router();
router.use(...schoolAdminGuard);

router.get('/', listClasses);
router.post('/', validate(createClassSchema), createClass);
router.post('/:classId/streams', validate(addStreamSchema), addStream);
router.delete('/:classId/streams/:streamId', removeStream);
router.put('/:classId/subjects', validate(setClassSubjectsSchema), setClassSubjects);

router.get('/subjects', listSubjects);
router.post('/subjects', validate(addSubjectSchema), addSubject);
router.delete('/subjects/:subjectId', removeSubject);

export default router;
