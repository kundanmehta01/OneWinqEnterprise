import { z } from 'zod';

export const updateUserSettingsSchema = z.object({
  privacy: z.object({
    profileVisibility: z.enum(['public', 'company_only', 'private']).optional(),
    showEmail: z.enum(['public', 'connections', 'company_only', 'hidden']).optional(),
    showPhone: z.enum(['public', 'connections', 'company_only', 'hidden']).optional(),
    allowConnectionRequests: z.boolean().optional()
  }).optional(),
  notifications: z.object({
    emailOnConnectionRequest: z.boolean().optional(),
    emailOnEventInvite: z.boolean().optional(),
    emailOnCompanyUpdate: z.boolean().optional(),
    inAppAll: z.boolean().optional()
  }).optional()
});
