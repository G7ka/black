import { authenticate, requireTenantAuth } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';
import { enforceTenantScope } from '../middlewares/resolveTenant.js';

// Every School Administration route requires: a valid tenant JWT, that
// JWT's schoolId matching the request's subdomain (prevents token replay
// across schools), and the SCHOOLADMIN_PRIMARY/SECONDARY role. Shared
// across all school-admin route files so the stack can't drift between them.
export const schoolAdminGuard = [
  authenticate,
  requireTenantAuth,
  enforceTenantScope,
  requireRole('SCHOOLADMIN_PRIMARY', 'SCHOOLADMIN_SECONDARY'),
];
