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

const journeySchema = z.object({
  _id: z.string().optional(),
  year: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
});

const impactMetricSchema = z.object({
  _id: z.string().optional(),
  metric: z.string().min(1),
  label: z.string().min(1),
  order: z.number().int().default(0)
});

const projectSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  role: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['all', 'ongoing', 'completed']).default('completed'),
  badge: z.string().optional(),
  startDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  endDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  technologies: z.array(z.string()).optional(),
  order: z.number().int().default(0)
});

const achievementSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  issuer: z.string().optional(),
  issueDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  description: z.string().optional(),
  certificateUrl: z.string().url().optional().or(z.literal('')),
  icon: z.string().optional(),
  badge: z.string().optional(),
  isFeatured: z.boolean().default(true),
  order: z.number().int().default(0)
});

const socialLinkSchema = z.object({
  _id: z.string().optional(),
  platform: z.string().min(1),
  url: z.string().url(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
});

const customSectionSchema = z.object({
  _id: z.string().optional(),
  sectionId: z.string().min(1),
  title: z.string().min(1),
  content: z.any().optional(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
});

const profileMediaSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1),
  url: z.string().url(),
  type: z.enum(['all', 'photo', 'video', 'event']).default('photo'),
  thumbnailUrl: z.string().optional().or(z.literal('')),
  date: z.string().datetime().optional().nullable().or(z.date().optional()),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
});

const profileBlogSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  coverImage: z.string().url().optional().or(z.literal('')),
  publishedDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  readTime: z.string().optional(),
  tags: z.array(z.string()).optional(),
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
  collaborationNote: z.string().max(500).optional(),
  overviewStats: z.object({
    connectionsCount: z.string().optional(),
    projectsCount: z.string().optional(),
    yearsOfExperience: z.string().optional(),
    servicesCount: z.string().optional(),
    customMetrics: z.array(z.object({
      label: z.string(),
      value: z.string()
    })).optional()
  }).optional(),
  location: z.object({
    city: z.string().optional(),
    country: z.string().optional()
  }).optional(),
  experience: z.array(experienceSchema).optional(),
  journey: z.array(journeySchema).optional(),
  skills: z.array(skillSchema).optional(),
  projects: z.array(projectSchema).optional(),
  impactMetrics: z.array(impactMetricSchema).optional(),
  achievements: z.array(achievementSchema).optional(),
  mediaGallery: z.array(profileMediaSchema).optional(),
  blogs: z.array(profileBlogSchema).optional(),
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
