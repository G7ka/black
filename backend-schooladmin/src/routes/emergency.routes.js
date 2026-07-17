import { Router } from 'express';
import {
  forceLogoutAll,
  shutdown,
  resume,
  rollback,
  broadcast,
  auditLog,
} from '../controllers/emergency.controller.js';
import { authenticate, requirePlatformAuth } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';
import { validate } from '../middlewares/validate.js';
import { reasonSchema, broadcastSchema } from '../validators/emergency.validator.js';

const router = Router();

router.use(authenticate, requirePlatformAuth, requireRole('SUPER_ADMIN'));

router.post('/force-logout', validate(reasonSchema), forceLogoutAll);
router.post('/shutdown', validate(reasonSchema), shutdown);
router.post('/resume', validate(reasonSchema), resume);
router.post('/rollback', validate(reasonSchema), rollback);
router.post('/broadcast', validate(broadcastSchema), broadcast);
router.get('/audit-log', auditLog);

export default router;
