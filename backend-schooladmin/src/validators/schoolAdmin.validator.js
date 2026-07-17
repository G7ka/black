import { z } from 'zod';

export const createClassSchema = z.object({
  name: z.string().min(1),
  tier: z.string().optional(),
});

export const addStreamSchema = z.object({
  name: z.string().min(1),
});

export const setClassSubjectsSchema = z.object({
  subjectIds: z.array(z.string().uuid()),
});

export const addSubjectSchema = z.object({
  name: z.string().min(1),
});

export const createTeacherSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subjectSpecialization: z.string().optional(),
});

export const leaveSchema = z.object({
  leaveReason: z.string().min(1),
  leaveStart: z.string().optional(),
  leaveEnd: z.string().optional(),
  leaveNotes: z.string().optional(),
});

export const assignClassesSchema = z.object({
  assignments: z.array(z.object({ classId: z.string().uuid(), subjectId: z.string().uuid().optional() })),
});

export const enrollStudentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  classId: z.string().uuid(),
  streamId: z.string().uuid().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  parentEmail: z.string().email().optional().or(z.literal('')),
});

export const relocateStudentSchema = z.object({
  targetClassId: z.string().uuid(),
  targetStreamId: z.string().uuid().optional(),
  reason: z.string().optional(),
});

export const bulkPromoteSchema = z.object({
  decisions: z.array(z.object({ studentId: z.string().uuid(), action: z.enum(['promote', 'repeat']) })),
});

export const createParentSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
});

export const parentInactiveSchema = z.object({
  inactiveReason: z.string().min(1),
  inactiveReturn: z.string().optional(),
  inactiveNotes: z.string().optional(),
});

export const timetableSlotSchema = z.object({
  classId: z.string().uuid(),
  streamId: z.string().uuid().optional(),
  dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
  timeSlot: z.string().min(1),
  subjectId: z.string().uuid().optional(),
  teacherProfileId: z.string().uuid().optional(),
  room: z.string().optional(),
});

export const feeStructureSchema = z.object({
  classId: z.string().uuid(),
  term: z.string().min(1),
  tuition: z.coerce.number().int().min(0),
  lunch: z.coerce.number().int().min(0),
  activities: z.coerce.number().int().min(0),
});

export const recordPaymentSchema = z.object({
  studentId: z.string().uuid(),
  term: z.string().min(1),
  amount: z.coerce.number().int().positive(),
  method: z.string().optional(),
});

export const schoolInfoSchema = z.object({
  name: z.string().min(1),
  motto: z.string().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(1),
});

export const termsSchema = z.object({
  currentTerm: z.string().min(1),
  termStart: z.string().optional(),
  termEnd: z.string().optional(),
});

export const notificationSettingsSchema = z.object({
  smsNotif: z.boolean(),
  emailNotif: z.boolean(),
  attendanceAlert: z.boolean(),
  feeReminder: z.boolean(),
});

export const sendAlertSchema = z.object({
  channel: z.enum(['SMS', 'EMAIL', 'APP', 'EMERGENCY']),
  audience: z.string().min(1),
  message: z.string().min(1),
});
