import { Router } from 'express';
import { getClassTimetable, saveTimetableSlot, deleteTimetableSlot } from '../controllers/timetable.controller.js';
import { schoolAdminGuard } from './schoolAdminGuard.js';
import { validate } from '../middlewares/validate.js';
import { timetableSlotSchema } from '../validators/schoolAdmin.validator.js';

const router = Router();
router.use(...schoolAdminGuard);

router.get('/:classId', getClassTimetable);
router.post('/', validate(timetableSlotSchema), saveTimetableSlot);
router.delete('/:classId', deleteTimetableSlot);

export default router;
