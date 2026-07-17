import { env } from '../config/env.js';

/**
 * Mirrors frontend src/utils/tenant.js logic so the backend resolves
 * the same subdomain from the Host header (or an explicit override
 * header used by API clients like Postman that can't send subdomains).
 */
export function extractSubdomain(host) {
  if (!host) return null;
  const hostname = host.split(':')[0];

  if (hostname.endsWith('.lvh.me')) {
    const parts = hostname.split('.');
    return parts.length > 2 ? parts[0] : null;
  }

  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    const parts = hostname.split('.');
    return parts.length > 1 && parts[0] !== 'localhost' ? parts[0] : null;
  }

  const mainDomain = env.cors.mainDomain;
  if (hostname === mainDomain) return null;
  if (hostname.endsWith(`.${mainDomain}`)) {
    return hostname.slice(0, -(`.${mainDomain}`.length));
  }

  const parts = hostname.split('.');
  return parts.length >= 3 ? parts[0] : null;
}

export function resolveRequestSubdomain(req) {
  // Explicit header takes priority — required for API clients (Postman,
  // mobile apps) that hit a single API host instead of real subdomains.
  const headerTenant = req.get('X-Tenant-Subdomain');
  if (headerTenant) return headerTenant.toLowerCase();
  return extractSubdomain(req.get('host'));
}
