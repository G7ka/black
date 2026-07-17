import { Router } from 'express';
import { getAttendanceOverview } from '../controllers/attendance.controller.js';
import { schoolAdminGuard } from './schoolAdminGuard.js';

const router = Router();
router.use(...schoolAdminGuard);

router.get('/', getAttendanceOverview);

export default router;
