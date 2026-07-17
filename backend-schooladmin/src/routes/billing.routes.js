import { Router } from 'express';
import { listBilling, setPricePerStudent, sendPaymentReminder } from '../controllers/billing.controller.js';
import {
  initiatePayment,
  refundPayment,
  cancelPayment,
  getLatestTransaction,
} from '../controllers/payment.controller.js';
import { authenticate, requirePlatformAuth } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';
import { validate } from '../middlewares/validate.js';
import { setPriceSchema } from '../validators/billing.validator.js';
import { refundSchema } from '../validators/payment.validator.js';

const router = Router();

router.use(authenticate, requirePlatformAuth, requireRole('SUPER_ADMIN', 'FINANCE_ADMIN'));

router.get('/', listBilling);
router.put('/price', validate(setPriceSchema), setPricePerStudent);
router.post('/:schoolId/remind', sendPaymentReminder);

// Pesapal payment lifecycle
router.post('/:schoolId/initiate-payment', initiatePayment);
router.get('/:schoolId/transaction', getLatestTransaction);
router.post('/:schoolId/refund', validate(refundSchema), refundPayment);
router.post('/:schoolId/cancel-payment', cancelPayment);

export default router;

