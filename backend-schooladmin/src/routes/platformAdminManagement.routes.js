import { Router } from 'express';
import { listAdmins, createAdmin, removeAdmin } from '../controllers/platformAdminManagement.controller.js';
import { authenticate, requirePlatformAuth } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';
import { validate } from '../middlewares/validate.js';
import { createPlatformAdminSchema } from '../validators/platformAdminManagement.validator.js';

const router = Router();

router.use(authenticate, requirePlatformAuth, requireRole('SUPER_ADMIN'));

router.get('/', listAdmins);
router.post('/', validate(createPlatformAdminSchema), createAdmin);
router.delete('/:id', removeAdmin);

export default router;
