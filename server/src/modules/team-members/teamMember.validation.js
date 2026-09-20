import { z } from 'zod';

export const createTeamMemberSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters long').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  employeeId: z.string().min(1).max(50).optional(),
  designation: z.string().min(1).max(100),
  departmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Department ID').optional().nullable().or(z.literal('')),
  roleId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Role ID').optional().or(z.literal('')),
  joiningDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100, 'Slug cannot exceed 100 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase alphanumeric characters and hyphens').optional().or(z.literal(''))
});

export const updateTeamMemberSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  employeeId: z.string().min(1).max(50).optional(),
  designation: z.string().min(1).max(100).optional(),
  departmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Department ID').optional().nullable().or(z.literal('')),
  roleId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Role ID').optional().or(z.literal('')),
  joiningDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  status: z.enum(['active', 'inactive', 'suspended', 'archived']).optional(),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100, 'Slug cannot exceed 100 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase alphanumeric characters and hyphens').optional().or(z.literal(''))
});

export const teamMemberIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Team Member ID format')
});
