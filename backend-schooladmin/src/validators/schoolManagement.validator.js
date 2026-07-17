import { z } from 'zod';

export const listSchoolsQuerySchema = z.object({
  status: z.enum(['all', 'active', 'pending', 'suspended', 'rejected']).optional(),
  level: z.enum(['all', 'Primary', 'Secondary']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const rejectSchoolSchema = z.object({
  reason: z.string().min(3, 'A rejection reason is required'),
});

export const suspendSchoolSchema = z.object({
  reason: z.string().min(3).optional(),
});

export const renameSchoolSchema = z.object({
  newName: z.string().min(1),
});

// Add School — SASchools.jsx "Add School" modal (mirrors public registration,
// but platform-created so it may be pre-approved by an explicit flag).
export const adminCreateSchoolSchema = z.object({
  schoolName: z.string().min(1),
  level: z.enum(['Primary', 'Secondary']),
  district: z.string().min(1),
  physicalAddress: z.string().min(1),
  numStudents: z.coerce.number().int().min(1),
  contactName: z.string().min(1),
  contactPhone: z.string().min(1),
  contactEmail: z.string().email(),
  subdomain: z.string().min(3).regex(/^[a-z0-9-]+$/),
});
