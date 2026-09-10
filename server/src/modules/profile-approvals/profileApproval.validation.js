import { z } from 'zod';

export const reviewApprovalSchema = z
  .object({
    action: z.enum(['approve', 'reject', 'request_changes', 'approved', 'rejected']).optional(),
    status: z.enum(['approve', 'reject', 'request_changes', 'approved', 'rejected']).optional(),
    reviewNote: z.string().max(1000).optional(),
    requestedChanges: z.array(z.string()).optional()
  })
  .refine((data) => data.action || data.status, {
    message: "Either 'action' or 'status' is required."
  })
  .transform((data) => {
    let act = data.action || data.status || 'approve';
    if (act === 'approved') act = 'approve';
    if (act === 'rejected') act = 'reject';
    return {
      action: act,
      reviewNote: data.reviewNote || '',
      requestedChanges: data.requestedChanges || []
    };
  });

export const approvalIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Approval ID format')
});

