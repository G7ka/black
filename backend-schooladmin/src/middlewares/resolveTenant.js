import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { resolveRequestSubdomain } from '../utils/tenant.js';

/**
 * Resolves the tenant school from the request's subdomain (or the
 * X-Tenant-Subdomain header) and attaches it as req.school.
 * Used on public tenant-side routes (e.g. tenant login) where no JWT
 * exists yet.
 */
export async function resolveTenantFromSubdomain(req, res, next) {
  const subdomain = resolveRequestSubdomain(req);

  if (!subdomain) {
    return next(ApiError.badRequest('No tenant subdomain resolved from request'));
  }

  const school = await prisma.school.findUnique({ where: { subdomain } });

  if (!school) {
    return next(ApiError.notFound(`No school found for subdomain "${subdomain}"`));
  }

  req.school = school;
  next();
}

/**
 * Best-effort tenant resolution for endpoints shared between the main
 * domain and tenant subdomains (e.g. forgot-password, which accepts an
 * `audience` field instead of always requiring a subdomain). Never
 * throws — leaves req.school undefined if no subdomain resolves.
 */
export async function resolveTenantOptional(req, res, next) {
  const subdomain = resolveRequestSubdomain(req);
  if (!subdomain) return next();

  const school = await prisma.school.findUnique({ where: { subdomain } });
  if (school) req.school = school;
  next();
}

/**
 * Enforces that an authenticated tenant user's JWT schoolId matches the
 * school implied by the request's subdomain, and that the school is
 * still active. Use after `authenticate` + `requireTenantAuth`.
 */
export async function enforceTenantScope(req, res, next) {
  const subdomain = resolveRequestSubdomain(req);
  if (!subdomain) return next(ApiError.badRequest('No tenant subdomain resolved from request'));

  const school = await prisma.school.findUnique({ where: { subdomain } });
  if (!school) return next(ApiError.notFound(`No school found for subdomain "${subdomain}"`));

  if (school.id !== req.auth.schoolId) {
    return next(ApiError.forbidden('Token does not belong to this school'));
  }

  if (school.status !== 'ACTIVE') {
    return next(ApiError.forbidden(`School account is ${school.status.toLowerCase()}`));
  }

  req.school = school;
  next();
}
