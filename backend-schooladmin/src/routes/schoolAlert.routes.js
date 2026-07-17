import { Router } from 'express';
import { listAlerts, sendAlert } from '../controllers/schoolAlert.controller.js';
import { schoolAdminGuard } from './schoolAdminGuard.js';
import { validate } from '../middlewares/validate.js';
import { sendAlertSchema } from '../validators/schoolAdmin.validator.js';

const router = Router();
router.use(...schoolAdminGuard);

router.get('/', listAlerts);
router.post('/', validate(sendAlertSchema), sendAlert);

export default router;
