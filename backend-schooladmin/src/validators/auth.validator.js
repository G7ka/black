import { z } from 'zod';

export const platformLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

// TenantLogin.jsx: role selector determines whether identifier is
// treated as student code or email/username. Backend re-resolves the
// identifier itself rather than trusting the client-picked role.
export const tenantLoginSchema = z.object({
  identifier: z.string().min(1, 'Email, username, or student ID is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email(),
  audience: z.enum(['platform', 'tenant']),
});

export const forgotPasswordVerifySchema = z.object({
  email: z.string().email(),
  audience: z.enum(['platform', 'tenant']),
  code: z.string().length(6),
});

export const forgotPasswordResetSchema = z.object({
  email: z.string().email(),
  audience: z.enum(['platform', 'tenant']),
  code: z.string().length(6),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

// SchoolRegistration.jsx — steps 1,2,3,4 collapsed into one payload.
export const schoolRegistrationSchema = z.object({
  // Step 1 — School Info
  schoolName: z.string().min(1),
  level: z.enum(['primary', 'secondary']),
  physicalAddress: z.string().min(1),
  district: z.string().min(1),
  numStudents: z.coerce.number().int().min(1),

  // Step 2 — Contact
  contactName: z.string().min(1),
  contactPhone: z.string().min(1),
  contactEmail: z.string().email(),
  schoolWebsite: z.string().url().optional().or(z.literal('')).optional(),

  // Step 3 — Subdomain
  subdomain: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'Subdomain may only contain lowercase letters, numbers, and hyphens'),

  // Step 4 — Credentials
  adminUsername: z.string().min(1),
  adminPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
  recoveryEmail: z.string().email(),
}).refine((data) => data.adminPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const checkSubdomainSchema = z.object({
  subdomain: z.string().min(3).regex(/^[a-z0-9-]+$/),
});
