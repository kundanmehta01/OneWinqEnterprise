import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(2, 'Department name must be at least 2 characters').max(100),
  description: z.string().max(500).optional().or(z.literal('')),
  headMemberId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Head Member ID').optional().nullable().or(z.literal('')),
  parentDepartmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Parent Department ID').optional().nullable().or(z.literal('')),
  order: z.number().int().optional()
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional().or(z.literal('')),
  headMemberId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Head Member ID').optional().nullable().or(z.literal('')),
  parentDepartmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Parent Department ID').optional().nullable().or(z.literal('')),
  order: z.number().int().optional(),
  isActive: z.boolean().optional()
});

export const departmentIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Department ID format')
});
