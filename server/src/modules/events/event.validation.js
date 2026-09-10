import { z } from 'zod';

const dateOrStringSchema = z.preprocess((val) => {
  if (!val) return undefined;
  if (val instanceof Date) return val;
  if (typeof val === 'string') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? val : d;
  }
  return val;
}, z.date({ invalid_type_error: 'Invalid start/end date format' }));

export const createEventSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().optional().default(''),
  category: z.enum(['company', 'team', 'workshop', 'meeting', 'conference', 'training', 'social']).default('company'),
  coverImageUrl: z.string().optional().default(''),
  startDate: dateOrStringSchema,
  endDate: dateOrStringSchema,
  locationType: z.enum(['physical', 'virtual', 'hybrid']).default('physical'),
  locationAddress: z.string().optional().default(''),
  meetingUrl: z.string().optional().default(''),
  organizerName: z.string().optional().default('OneWinq'),
  maxCapacity: z.coerce.number().int().nonnegative().default(0),
  registrationDeadline: dateOrStringSchema.optional().nullable(),
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
