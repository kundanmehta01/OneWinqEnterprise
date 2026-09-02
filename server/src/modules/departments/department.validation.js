import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  headMemberId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Head Member ID').optional().nullable(),
  parentDepartmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Parent Department ID').optional().nullable(),
  order: z.number().int().optional()
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  headMemberId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Head Member ID').optional().nullable(),
  parentDepartmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Parent Department ID').optional().nullable(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional()
});

export const departmentIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Department ID format')
});
