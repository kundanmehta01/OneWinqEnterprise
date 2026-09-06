import { z } from 'zod';

export const sendConnectionRequestSchema = z.object({
  recipientId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Recipient ID'),
  note: z.string().max(300).optional().default('')
});

export const connectionIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Connection ID')
});

export const peopleQuerySchema = z.object({
  search: z.string().optional(),
  departmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Department ID').optional(),
  designation: z.string().optional(),
  skills: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});
