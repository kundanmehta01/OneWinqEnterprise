import { z } from 'zod';

export const updateCompanyProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  tagline: z.string().max(255).optional(),
  description: z.string().optional(),
  industry: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  overviewStats: z.object({
    foundedYear: z.string().optional(),
    locationShort: z.string().optional(),
    teamSize: z.string().optional(),
    customMetrics: z.array(z.object({
      label: z.string(),
      value: z.string()
    })).optional()
  }).optional(),
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
    supportEmail: z.string().email().optional().or(z.literal('')),
    workingHours: z.string().optional(),
    directionsUrl: z.string().url().optional().or(z.literal(''))
  }).optional(),
  about: z.object({
    aboutCompany: z.string().optional(),
    mission: z.string().optional(),
    vision: z.string().optional(),
    story: z.string().optional(),
    values: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      icon: z.string().optional()
    })).optional()
  }).optional(),
  productsServices: z.array(z.object({
    _id: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    imageUrl: z.string().optional(),
    category: z.string().default('Products'),
    badge: z.string().optional(),
    ctaUrl: z.string().optional(),
    order: z.number().int().default(0),
    isVisible: z.boolean().default(true)
  })).optional(),
  projects: z.array(z.object({
    _id: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    category: z.string().default('General'),
    status: z.enum(['all', 'ongoing', 'completed']).default('ongoing'),
    imageUrl: z.string().optional(),
    projectUrl: z.string().optional(),
    order: z.number().int().default(0),
    isVisible: z.boolean().default(true)
  })).optional(),
  achievements: z.array(z.object({
    _id: z.string().optional(),
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    year: z.string().optional(),
    badge: z.string().optional(),
    metric: z.string().optional(),
    order: z.number().int().default(0),
    isVisible: z.boolean().default(true)
  })).optional(),
  mediaGallery: z.array(z.object({
    _id: z.string().optional(),
    title: z.string().min(1),
    type: z.enum(['all', 'photo', 'video', 'news', 'event']).default('photo'),
    url: z.string().url(),
    thumbnailUrl: z.string().optional().or(z.literal('')),
    date: z.string().datetime().optional().nullable().or(z.date().optional()),
    description: z.string().optional(),
    order: z.number().int().default(0),
    isVisible: z.boolean().default(true)
  })).optional(),
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
