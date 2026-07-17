import { Router } from 'express';
import { getSchoolOverviewReport } from '../controllers/schoolReports.controller.js';
import { schoolAdminGuard } from './schoolAdminGuard.js';

const router = Router();
router.use(...schoolAdminGuard);

router.get('/overview', getSchoolOverviewReport);

export default router;
