import { Router } from 'express';
import { pesapalIpn, getPublicTransactionStatus } from '../controllers/payment.controller.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Generous but bounded — Pesapal may legitimately retry IPN calls; this
// only guards against abuse, not normal retry behavior.
const publicPaymentLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

// Pesapal was registered with ipn_notification_type: 'GET' (see
// pesapalIpnSetup.service.js) but both are wired since the doc allows
// either — re-registering with POST would only require flipping that
// one setup call, not touching this route.
router.get('/pesapal/ipn', publicPaymentLimiter, pesapalIpn);
router.post('/pesapal/ipn', publicPaymentLimiter, pesapalIpn);

router.get('/pesapal/status/:orderTrackingId', publicPaymentLimiter, getPublicTransactionStatus);

export default router;
