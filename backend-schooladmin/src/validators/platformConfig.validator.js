import { z } from 'zod';

export const appearanceSchema = z.object({
  darkMode: z.boolean(),
});

export const brandingSchema = z.object({
  platformName: z.string().min(1),
  supportEmail: z.string().email(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  logoUrl: z.string().url().nullable().optional(),
  emailFooter: z.string().max(500),
});

export const featuresSchema = z.object({
  sms: z.boolean(),
  email: z.boolean(),
  biometric: z.boolean(),
  momo: z.boolean(),
  airtel: z.boolean(),
  s3: z.boolean(),
  twoFactor: z.boolean(),
  api: z.boolean(),
});

export const securitySchema = z.object({
  sessionTimeoutMinutes: z.coerce.number().int().min(5).max(1440),
  maxLoginAttempts: z.coerce.number().int().min(3).max(20),
  ipWhitelist: z.array(z.string()).default([]),
  enforce2faForAdmins: z.boolean(),
});

export const integrationsSchema = z.object({
  africasTalkingApiKey: z.string().optional(),
  mtnMomoPrimaryKey: z.string().optional(),
  airtelMoneyApiKey: z.string().optional(),
  sendgridApiKey: z.string().optional(),
  awsAccessKeyId: z.string().optional(),
  awsSecretAccessKey: z.string().optional(),
  awsS3BucketName: z.string().optional(),
});
