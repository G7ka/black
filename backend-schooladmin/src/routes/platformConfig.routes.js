import { Router } from 'express';
import {
  getConfiguration,
  updateAppearance,
  updateBranding,
  updateFeatures,
  updateSecurity,
  updateIntegrations,
} from '../controllers/platformConfig.controller.js';
import { authenticate, requirePlatformAuth } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';
import { validate } from '../middlewares/validate.js';
import {
  appearanceSchema,
  brandingSchema,
  featuresSchema,
  securitySchema,
  integrationsSchema,
} from '../validators/platformConfig.validator.js';

const router = Router();

router.use(authenticate, requirePlatformAuth, requireRole('SUPER_ADMIN'));

router.get('/', getConfiguration);
router.put('/appearance', validate(appearanceSchema), updateAppearance);
router.put('/branding', validate(brandingSchema), updateBranding);
router.put('/features', validate(featuresSchema), updateFeatures);
router.put('/security', validate(securitySchema), updateSecurity);
router.put('/integrations', validate(integrationsSchema), updateIntegrations);

export default router;
