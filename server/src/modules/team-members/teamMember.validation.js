import { z } from 'zod';

export const createTeamMemberSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters long').optional(),
  name: z.string().min(2).max(100),
  employeeId: z.string().min(1).max(50).optional(),
  designation: z.string().min(1).max(100),
  departmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Department ID').optional(),
  roleId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Role ID'),
  joiningDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  status: z.enum(['active', 'inactive']).default('active')
});

export const updateTeamMemberSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  designation: z.string().min(1).max(100).optional(),
  departmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Department ID').optional().nullable(),
  roleId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Role ID').optional(),
  joiningDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  status: z.enum(['active', 'inactive', 'archived']).optional()
});

export const teamMemberIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Team Member ID format')
});
