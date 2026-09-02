import { z } from 'zod';

const experienceSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  startDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  endDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
  order: z.number().int().default(0)
});

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().default('General'),
  proficiencyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).default('Intermediate'),
  order: z.number().int().default(0)
});

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  role: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  startDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  endDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  technologies: z.array(z.string()).optional(),
  order: z.number().int().default(0)
});

const achievementSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().optional(),
  issueDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  description: z.string().optional(),
  certificateUrl: z.string().url().optional().or(z.literal('')),
  order: z.number().int().default(0)
});

const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
});

const customSectionSchema = z.object({
  sectionId: z.string().min(1),
  title: z.string().min(1),
  content: z.any().optional(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
});

export const updateDraftProfileSchema = z.object({
  headline: z.string().max(255).optional(),
  bio: z.string().max(2000).optional(),
  phone: z.string().max(50).optional(),
  workEmail: z.string().email().optional().or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  coverUrl: z.string().url().optional().or(z.literal('')),
  location: z.object({
    city: z.string().optional(),
    country: z.string().optional()
  }).optional(),
  experience: z.array(experienceSchema).optional(),
  skills: z.array(skillSchema).optional(),
  projects: z.array(projectSchema).optional(),
  achievements: z.array(achievementSchema).optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  customSections: z.array(customSectionSchema).optional(),
  themeOverrides: z.object({
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    accentColor: z.string().optional(),
    fontHeading: z.string().optional(),
    fontBody: z.string().optional(),
    customCss: z.string().optional()
  }).optional(),
  templateId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  visibility: z.enum(['public', 'private', 'internal']).optional(),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens').optional()
});

export const submitProfileForApprovalSchema = z.object({
  note: z.string().max(500).optional()
});
