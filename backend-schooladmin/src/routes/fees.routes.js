import { Router } from 'express';
import {
  listFeeStructures,
  saveFeeStructure,
  listPaymentStatus,
  recordPayment,
  sendFeeReminder,
} from '../controllers/fees.controller.js';
import { schoolAdminGuard } from './schoolAdminGuard.js';
import { validate } from '../middlewares/validate.js';
import { feeStructureSchema, recordPaymentSchema } from '../validators/schoolAdmin.validator.js';

const router = Router();
router.use(...schoolAdminGuard);

router.get('/structures', listFeeStructures);
router.post('/structures', validate(feeStructureSchema), saveFeeStructure);
router.get('/payments', listPaymentStatus);
router.post('/payments', validate(recordPaymentSchema), recordPayment);
router.post('/payments/:studentId/remind', sendFeeReminder);

export default router;
