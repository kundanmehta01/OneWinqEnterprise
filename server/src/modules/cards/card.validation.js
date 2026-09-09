import { z } from 'zod';

export const createCardSchema = z.object({
  cardUid: z.string().min(3).max(64).trim().toUpperCase(),
  serialNumber: z.string().min(3).max(64).trim().toUpperCase(),
  cardType: z.enum(['metal_black', 'metal_gold', 'metal_silver', 'pvc_matte', 'pvc_glossy', 'bamboo_wood', 'hybrid']).optional().default('metal_black'),
  batchNumber: z.string().max(100).optional().default('BATCH-2026-01'),
  notes: z.string().max(500).optional().default('')
});

export const createBulkCardsSchema = z.object({
  cards: z.array(createCardSchema).min(1).max(100)
});

export const linkCardSchema = z.object({
  cardId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Card ID').optional(),
  cardUid: z.string().min(3).max(64).optional(),
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Member ID').optional(),
  employeeId: z.string().min(2).max(50).optional(),
  notes: z.string().max(500).optional()
}).refine(
  (data) => (data.cardId || data.cardUid) && (data.memberId || data.employeeId),
  { message: 'Must provide either (cardId or cardUid) AND (memberId or employeeId)' }
);

export const unlinkCardSchema = z.object({
  cardId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Card ID').optional(),
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Member ID').optional(),
  reason: z.string().max(300).optional().default('')
}).refine(
  (data) => data.cardId || data.memberId,
  { message: 'Must provide either cardId or memberId' }
);

export const updateCardStatusSchema = z.object({
  status: z.enum(['unassigned', 'linked', 'blocked', 'lost', 'retired']),
  reason: z.string().max(300).optional().default('')
});

export const cardIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Card ID')
});

export const cardQuerySchema = z.object({
  status: z.enum(['unassigned', 'linked', 'blocked', 'lost', 'retired', 'all']).optional(),
  cardType: z.enum(['metal_black', 'metal_gold', 'metal_silver', 'pvc_matte', 'pvc_glossy', 'bamboo_wood', 'hybrid']).optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});
