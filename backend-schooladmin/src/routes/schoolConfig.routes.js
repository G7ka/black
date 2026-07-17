import { Router } from 'express';
import { getSchoolConfig, updateSchoolInfo, updateTerms, updateNotificationSettings, getBillingStatus } from '../controllers/schoolConfig.controller.js';
import { schoolAdminGuard } from './schoolAdminGuard.js';
import { validate } from '../middlewares/validate.js';
import { schoolInfoSchema, termsSchema, notificationSettingsSchema } from '../validators/schoolAdmin.validator.js';

const router = Router();
router.use(...schoolAdminGuard);

router.get('/', getSchoolConfig);
router.get('/billing', getBillingStatus);
router.put('/info', validate(schoolInfoSchema), updateSchoolInfo);
router.put('/terms', validate(termsSchema), updateTerms);
router.put('/notifications', validate(notificationSettingsSchema), updateNotificationSettings);

export default router;
