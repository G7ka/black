import { Router } from 'express';
import { getServerStats, getActiveAlerts, getLogs } from '../controllers/monitoring.controller.js';
import { authenticate, requirePlatformAuth } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

router.use(authenticate, requirePlatformAuth, requireRole('SUPER_ADMIN'));

router.get('/stats', getServerStats);
router.get('/alerts', getActiveAlerts);
router.get('/logs', getLogs);

export default router;
