import { Router } from 'express';
import {
  listParents,
  getParent,
  createParent,
  updateParent,
  setParentInactive,
  setParentActive,
} from '../controllers/parents.controller.js';
import { schoolAdminGuard } from './schoolAdminGuard.js';
import { validate } from '../middlewares/validate.js';
import { createParentSchema, parentInactiveSchema } from '../validators/schoolAdmin.validator.js';

const router = Router();
router.use(...schoolAdminGuard);

router.get('/', listParents);
router.post('/', validate(createParentSchema), createParent);
router.get('/:id', getParent);
router.put('/:id', validate(createParentSchema), updateParent);
router.post('/:id/inactive', validate(parentInactiveSchema), setParentInactive);
router.post('/:id/activate', setParentActive);

export default router;
