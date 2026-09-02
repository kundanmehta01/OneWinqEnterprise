import { z } from 'zod';

export const updateSettingsSchema = z.object({
  organizationName: z.string().min(1).max(100).optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  profileSettings: z.object({
    defaultVisibility: z.enum(['public', 'private', 'internal']).optional(),
    defaultTemplateId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional().nullable(),
    requireApprovalForProfileChanges: z.boolean().optional(),
    allowCustomThemes: z.boolean().optional()
  }).optional(),
  securitySettings: z.object({
    passwordMinLength: z.number().int().min(8).max(64).optional(),
    sessionTimeoutMinutes: z.number().int().min(5).max(1440).optional(),
    maxFailedLogins: z.number().int().min(3).max(10).optional(),
    twoFactorEnabled: z.boolean().optional(),
    ssoEnabled: z.boolean().optional()
  }).optional()
});
