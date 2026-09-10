import { z } from 'zod';

export const createInvitationSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  name: z.string().min(1).max(100).optional().or(z.literal('')),
  roleId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Role ID').optional().or(z.literal('')),
  departmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Department ID').optional().nullable().or(z.literal('')),
  designation: z.string().max(100).optional().or(z.literal('')).default('Team Member')
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional().or(z.literal('')),
  name: z.string().min(1).max(100).optional().or(z.literal(''))
});

export const invitationIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Invitation ID format')
});

