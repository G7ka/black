import { Router } from 'express';
import {
  checkSubdomain,
  registerSchool,
  getPricing,
  searchSchools,
} from '../controllers/schoolRegistration.controller.js';
import { validate } from '../middlewares/validate.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import { schoolRegistrationSchema, checkSubdomainSchema } from '../validators/auth.validator.js';
import { uploadLicense } from '../config/upload.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// GET /api/v1/schools/check-subdomain?subdomain=xyz — SchoolRegistration.jsx step 3
router.get('/check-subdomain', validateQuery(checkSubdomainSchema), checkSubdomain);

// GET /api/v1/schools/pricing — Public pricing for registration page
router.get('/pricing', getPricing);


// GET /api/v1/schools/search?q=kampala — Public school finder on landing page
router.get('/search', searchSchools);


// POST /api/v1/schools/register — SchoolRegistration.jsx final submit
router.post(
  '/register',
  authLimiter,
  uploadLicense.single('licenseFile'),
  validate(schoolRegistrationSchema),
  registerSchool
);

export default router;
