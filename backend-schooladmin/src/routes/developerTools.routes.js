import { Router } from 'express';
import { listApiKeys, createApiKey, revokeApiKey, searchLogs } from '../controllers/developerTools.controller.js';
import { authenticate, requirePlatformAuth } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';
import { validate } from '../middlewares/validate.js';
import { createApiKeySchema } from '../validators/apiKey.validator.js';

const router = Router();

router.use(authenticate, requirePlatformAuth, requireRole('SUPER_ADMIN'));

router.get('/api-keys', listApiKeys);
router.post('/api-keys', validate(createApiKeySchema), createApiKey);
router.post('/api-keys/:id/revoke', revokeApiKey);
router.get('/logs', searchLogs);

export default router;
