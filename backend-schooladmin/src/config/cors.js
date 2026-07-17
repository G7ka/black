import { env } from './env.js';

// Accepts the main domain, any *.mainDomain subdomain (tenants),
// and local dev origins (localhost / lvh.me on any port).
function isAllowedOrigin(origin) {
  if (!origin) return true; // non-browser clients (Postman, curl)

  let hostname;
  try {
    hostname = new URL(origin).hostname;
  } catch {
    return false;
  }

  const mainDomain = env.cors.mainDomain;

  if (hostname === mainDomain || hostname.endsWith(`.${mainDomain}`)) {
    return true;
  }

  if (hostname === 'localhost' || hostname.endsWith('.localhost')) return true;
  if (hostname === 'lvh.me' || hostname.endsWith('.lvh.me')) return true;

  return false;
}

export const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
};
