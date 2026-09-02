import { z } from 'zod';

export const updateCompanyProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  tagline: z.string().max(255).optional(),
  description: z.string().optional(),
  industry: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  location: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional()
  }).optional(),
  contact: z.object({
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    supportEmail: z.string().email().optional().or(z.literal(''))
  }).optional(),
  about: z.object({
    aboutCompany: z.string().optional(),
    mission: z.string().optional(),
    vision: z.string().optional(),
    values: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      icon: z.string().optional()
    })).optional()
  }).optional(),
  branding: z.object({
    logoUrl: z.string().optional(),
    coverUrl: z.string().optional(),
    faviconUrl: z.string().optional(),
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    accentColor: z.string().optional(),
    fontHeading: z.string().optional(),
    fontBody: z.string().optional(),
    themeMode: z.enum(['light', 'dark', 'system']).optional()
  }).optional(),
  dynamicSections: z.array(z.object({
    sectionId: z.string(),
    title: z.string(),
    type: z.enum(['overview', 'about', 'services', 'team', 'projects', 'achievements', 'updates', 'contact', 'custom']),
    content: z.any().optional(),
    order: z.number().int().default(0),
    isVisible: z.boolean().default(true)
  })).optional(),
  navigation: z.array(z.object({
    navId: z.string(),
    label: z.string(),
    targetSectionId: z.string().optional(),
    icon: z.string().optional(),
    order: z.number().int().default(0),
    isVisible: z.boolean().default(true)
  })).optional(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url(),
    order: z.number().int().default(0),
    isVisible: z.boolean().default(true)
  })).optional(),
  isPublic: z.boolean().optional()
});
