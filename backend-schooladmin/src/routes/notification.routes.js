import { Router } from 'express';
import { sendSchoolMessage } from '../controllers/notification.controller.js';
import { authenticate, requirePlatformAuth } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';
import { validate } from '../middlewares/validate.js';
import { sendSchoolMessageSchema } from '../validators/notification.validator.js';

const router = Router();

router.use(authenticate, requirePlatformAuth, requireRole('SUPER_ADMIN'));

router.post('/school-message', validate(sendSchoolMessageSchema), sendSchoolMessage);

export default router;
