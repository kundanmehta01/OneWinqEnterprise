import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().optional().default(''),
  category: z.enum(['company', 'team', 'workshop', 'meeting', 'conference', 'training', 'social']).default('company'),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  locationType: z.enum(['physical', 'virtual', 'hybrid']).default('physical'),
  locationAddress: z.string().optional().default(''),
  meetingUrl: z.string().url().optional().or(z.literal('')),
  organizerName: z.string().optional().default('OneWinq'),
  maxCapacity: z.number().int().nonnegative().default(0),
  registrationDeadline: z.string().datetime().optional().nullable().or(z.date().optional()),
  eligibility: z.object({
    type: z.enum(['all', 'departments', 'roles', 'invite_only']).default('all'),
    departmentIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional().default([]),
    roleIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional().default([])
  }).optional().default({ type: 'all', departmentIds: [], roleIds: [] }),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']).default('published')
});

export const updateEventSchema = createEventSchema.partial();

export const eventIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Event ID')
});

export const eventQuerySchema = z.object({
  category: z.enum(['company', 'team', 'workshop', 'meeting', 'conference', 'training', 'social']).optional(),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']).optional(),
  timeframe: z.enum(['upcoming', 'past', 'all']).optional().default('upcoming'),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});
