import { Router } from 'express';
import {
  listSchools,
  getSchool,
  approveSchool,
  rejectSchool,
  suspendSchool,
  reactivateSchool,
  deleteSchool,
  renameSchool,
  impersonateSchoolAdmin,
  adminCreateSchool,
} from '../controllers/schoolManagement.controller.js';
import { authenticate, requirePlatformAuth } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';
import { validate } from '../middlewares/validate.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import {
  listSchoolsQuerySchema,
  rejectSchoolSchema,
  suspendSchoolSchema,
  renameSchoolSchema,
  adminCreateSchoolSchema,
} from '../validators/schoolManagement.validator.js';

const router = Router();

router.use(authenticate, requirePlatformAuth, requireRole('SUPER_ADMIN'));

router.get('/', validateQuery(listSchoolsQuerySchema), listSchools);
router.post('/', validate(adminCreateSchoolSchema), adminCreateSchool);
router.get('/:id', getSchool);
router.post('/:id/approve', approveSchool);
router.post('/:id/reject', validate(rejectSchoolSchema), rejectSchool);
router.post('/:id/suspend', validate(suspendSchoolSchema), suspendSchool);
router.post('/:id/reactivate', reactivateSchool);
router.delete('/:id', deleteSchool);
router.patch('/:id/name', validate(renameSchoolSchema), renameSchool);
router.post('/:id/impersonate', impersonateSchoolAdmin);

export default router;
