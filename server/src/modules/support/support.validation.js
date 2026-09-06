import { z } from 'zod';

export const createSupportTicketSchema = z.object({
  category: z.enum(['general', 'technical', 'card_issue', 'profile_issue', 'feedback']).default('general'),
  subject: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  priority: z.enum(['low', 'medium', 'high']).default('medium')
});

export const supportTicketIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Ticket ID')
});
