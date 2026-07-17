import { Router } from 'express';
import { getOverview, getGrowth } from '../controllers/analytics.controller.js';
import { authenticate, requirePlatformAuth } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

router.use(authenticate, requirePlatformAuth, requireRole('SUPER_ADMIN', 'FINANCE_ADMIN'));

router.get('/overview', getOverview);
router.get('/growth', getGrowth);

export default router;
