import { z } from 'zod';

export const reviewApprovalSchema = z.object({
  action: z.enum(['approve', 'reject', 'request_changes']),
  reviewNote: z.string().max(1000).optional(),
  requestedChanges: z.array(z.string()).optional()
});

export const approvalIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Approval ID format')
});
