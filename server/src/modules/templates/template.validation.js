import { z } from 'zod';

export const createTemplateSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.enum([
    'founder',
    'ceo',
    'leadership',
    'executive',
    'employee',
    'manager',
    'management',
    'engineering',
    'hr',
    'sales',
    'marketing',
    'custom',
    'company'
  ]).default('employee'),
  description: z.string().max(500).optional(),
  previewImageUrl: z.string().url().optional().or(z.literal('')),
  layoutConfig: z.object({
    headerStyle: z.enum(['centered', 'cover_left', 'banner_minimal', 'compact']).default('centered'),
    colorPalette: z.object({
      primary: z.string().default('#2563eb'),
      secondary: z.string().default('#1e293b'),
      accent: z.string().default('#38bdf8'),
      background: z.string().default('#ffffff'),
      text: z.string().default('#0f172a')
    }).optional(),
    fontHeading: z.string().default('Inter'),
    fontBody: z.string().default('Inter'),
    showBadges: z.boolean().default(true),
    showBadge: z.boolean().default(true),
    showQuote: z.boolean().default(true),
    showQrCode: z.boolean().default(true),
    customCss: z.string().optional()
  }).optional(),
  predefinedDetails: z.object({
    headline: z.string().max(255).optional(),
    bio: z.string().max(1000).optional(),
    collaborationNote: z.string().max(500).optional(),
    ctaButtonText: z.string().max(50).optional(),
    badgeLabel: z.string().max(100).optional(),
    quote: z.string().max(500).optional(),
    skills: z.array(z.string()).optional()
  }).optional(),
  availableSections: z.array(z.object({
    sectionKey: z.string(),
    title: z.string(),
    isRequired: z.boolean().default(false),
    defaultOrder: z.number().int().default(0)
  })).optional(),
  sectionOrder: z.array(z.string()).optional(),
  isDefault: z.boolean().optional()
});

export const updateTemplateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  category: z.enum([
    'founder',
    'ceo',
    'leadership',
    'executive',
    'employee',
    'manager',
    'management',
    'engineering',
    'hr',
    'sales',
    'marketing',
    'custom',
    'company'
  ]).optional(),
  description: z.string().max(500).optional(),
  previewImageUrl: z.string().url().optional().or(z.literal('')),
  layoutConfig: z.object({
    headerStyle: z.enum(['centered', 'cover_left', 'banner_minimal', 'compact']).optional(),
    colorPalette: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
      background: z.string(),
      text: z.string()
    }).partial().optional(),
    fontHeading: z.string().optional(),
    fontBody: z.string().optional(),
    showBadges: z.boolean().optional(),
    showBadge: z.boolean().optional(),
    showQuote: z.boolean().optional(),
    showQrCode: z.boolean().optional(),
    customCss: z.string().optional()
  }).optional(),
  predefinedDetails: z.object({
    headline: z.string().max(255).optional(),
    bio: z.string().max(1000).optional(),
    collaborationNote: z.string().max(500).optional(),
    ctaButtonText: z.string().max(50).optional(),
    badgeLabel: z.string().max(100).optional(),
    quote: z.string().max(500).optional(),
    skills: z.array(z.string()).optional()
  }).partial().optional(),
  availableSections: z.array(z.object({
    sectionKey: z.string(),
    title: z.string(),
    isRequired: z.boolean().default(false),
    defaultOrder: z.number().int().default(0)
  })).optional(),
  sectionOrder: z.array(z.string()).optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  changeSummary: z.string().max(255).optional()
});

export const templateIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Template ID format')
});
