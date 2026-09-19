import { z } from 'zod';

const experienceSchema = z.object({
  _id: z.string().optional(),
  company: z.string().max(100, 'Company name cannot exceed 100 characters').optional().default(''),
  title: z.string().max(100, 'Job title cannot exceed 100 characters').optional().default(''),
  role: z.string().max(100, 'Role cannot exceed 100 characters').optional().default(''),
  from: z.string().max(50, 'From date cannot exceed 50 characters').optional().default(''),
  to: z.string().max(50, 'To date cannot exceed 50 characters').optional().default(''),
  fromMonth: z.string().max(30, 'From month cannot exceed 30 characters').optional().default(''),
  toMonth: z.string().max(30, 'To month cannot exceed 30 characters').optional().default(''),
  fromYear: z.string().max(20, 'From year cannot exceed 20 characters').optional().default(''),
  toYear: z.string().max(20, 'To year cannot exceed 20 characters').optional().default(''),
  period: z.string().max(60, 'Period cannot exceed 60 characters').optional().default(''),
  location: z.string().max(100, 'Location cannot exceed 100 characters').optional(),
  startDate: z.string().datetime().optional().nullable().or(z.date().optional()).or(z.string().max(50).optional()),
  endDate: z.string().datetime().optional().nullable().or(z.date().optional()).or(z.string().max(50).optional()),
  isCurrent: z.boolean().default(false),
  description: z.string().max(2000, 'Experience description cannot exceed 2000 characters').optional(),
  order: z.number().int().default(0)
});

const skillSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required').max(60, 'Skill name cannot exceed 60 characters'),
  category: z.string().trim().max(50, 'Skill category cannot exceed 50 characters').default('General'),
  proficiencyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).default('Intermediate'),
  order: z.number().int().default(0)
});

const journeySchema = z.object({
  _id: z.string().optional(),
  company: z.string().max(100, 'Company name cannot exceed 100 characters').optional().default(''),
  role: z.string().max(100, 'Role cannot exceed 100 characters').optional().default(''),
  title: z.string().max(100, 'Title cannot exceed 100 characters').optional().default(''),
  from: z.string().max(50, 'From date cannot exceed 50 characters').optional().default(''),
  to: z.string().max(50, 'To date cannot exceed 50 characters').optional().default(''),
  fromMonth: z.string().max(30, 'From month cannot exceed 30 characters').optional().default(''),
  toMonth: z.string().max(30, 'To month cannot exceed 30 characters').optional().default(''),
  fromYear: z.string().max(20, 'From year cannot exceed 20 characters').optional().default(''),
  toYear: z.string().max(20, 'To year cannot exceed 20 characters').optional().default(''),
  period: z.string().max(60, 'Period cannot exceed 60 characters').optional().default(''),
  year: z.string().max(30, 'Year cannot exceed 30 characters').optional().default(''),
  isCurrent: z.boolean().default(false),
  description: z.string().max(2000, 'Journey description cannot exceed 2000 characters').optional(),
  icon: z.string().max(50, 'Icon cannot exceed 50 characters').optional(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
});

const impactMetricSchema = z.object({
  _id: z.string().optional(),
  metric: z.string().trim().min(1, 'Metric is required').max(30, 'Metric cannot exceed 30 characters'),
  label: z.string().trim().min(1, 'Label is required').max(100, 'Label cannot exceed 100 characters'),
  order: z.number().int().default(0)
});

const projectSchema = z.object({
  _id: z.string().optional(),
  title: z.string().trim().min(1, 'Project title is required').max(150, 'Project title cannot exceed 150 characters'),
  description: z.string().max(2000, 'Project description cannot exceed 2000 characters').optional(),
  role: z.string().max(100, 'Role cannot exceed 100 characters').optional(),
  url: z.string().max(1000, 'URL cannot exceed 1000 characters').optional().or(z.literal('')),
  imageUrl: z.string().max(1000, 'Image URL cannot exceed 1000 characters').optional().or(z.literal('')),
  status: z.enum(['all', 'ongoing', 'completed']).default('completed'),
  badge: z.string().max(50, 'Badge cannot exceed 50 characters').optional(),
  startDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  endDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  technologies: z.array(z.string().trim().max(50, 'Technology name cannot exceed 50 characters')).max(30, 'Cannot exceed 30 technologies').optional(),
  order: z.number().int().default(0)
});

const achievementSchema = z.object({
  _id: z.string().optional(),
  title: z.string().trim().min(1, 'Achievement title is required').max(150, 'Achievement title cannot exceed 150 characters'),
  subtitle: z.string().max(150, 'Subtitle cannot exceed 150 characters').optional(),
  issuer: z.string().max(100, 'Issuer cannot exceed 100 characters').optional(),
  issueDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  description: z.string().max(1500, 'Achievement description cannot exceed 1500 characters').optional(),
  certificateUrl: z.string().max(1000, 'Certificate URL cannot exceed 1000 characters').optional().or(z.literal('')),
  icon: z.string().max(50, 'Icon cannot exceed 50 characters').optional(),
  badge: z.string().max(50, 'Badge cannot exceed 50 characters').optional(),
  imageUrl: z.string().max(1000, 'Image URL cannot exceed 1000 characters').optional().or(z.literal('')),
  isFeatured: z.boolean().default(true),
  order: z.number().int().default(0)
});

const socialLinkSchema = z.object({
  _id: z.string().optional(),
  platform: z.string().trim().min(1, 'Platform name is required').max(50, 'Platform name cannot exceed 50 characters'),
  url: z.string().max(1000, 'URL cannot exceed 1000 characters').optional().or(z.literal('')),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
});

const customSectionSchema = z.object({
  _id: z.string().optional(),
  sectionId: z.string().trim().min(1).max(50, 'Section ID cannot exceed 50 characters'),
  title: z.string().trim().min(1, 'Section title is required').max(100, 'Section title cannot exceed 100 characters'),
  content: z.any().optional(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
});

const profileMediaSchema = z.object({
  _id: z.string().optional(),
  title: z.string().trim().min(1, 'Media title is required').max(150, 'Media title cannot exceed 150 characters'),
  url: z.string().trim().min(1, 'Media URL is required').max(1000, 'Media URL cannot exceed 1000 characters'),
  type: z.enum(['all', 'photo', 'video', 'event']).default('photo'),
  mediaOption: z.enum(['photo_url', 'photo_upload', 'video_upload', 'video_url']).optional(),
  uploadUrl: z.string().max(1000).optional().or(z.literal('')),
  linkUrl: z.string().max(1000).optional().or(z.literal('')),
  thumbnailUrl: z.string().max(1000, 'Thumbnail URL cannot exceed 1000 characters').optional().or(z.literal('')),
  date: z.string().datetime().optional().nullable().or(z.date().optional()),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
}).superRefine((data, ctx) => {
  // Strict Validation 1: If client sends dual fields uploadUrl and linkUrl, reject
  if (data.uploadUrl && data.uploadUrl.trim() && data.linkUrl && data.linkUrl.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Cannot provide both an uploaded file and a web URL. Exactly one must be selected.',
      path: ['url']
    });
    return;
  }

  const u = (data.url || '').trim();
  const isLocalUpload = /^\/?uploads\//i.test(u) || u.includes('/uploads/');
  const isWebUrl = /^https?:\/\/[^\s]+$/i.test(u);

  if (!isLocalUpload && !isWebUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Media URL must be either a valid web URL (http:// or https://) or an uploaded file path (/uploads/...).',
      path: ['url']
    });
    return;
  }

  // Strict Validation 2: Ensure url matches the chosen dropdown mediaOption
  if (data.mediaOption) {
    if (data.mediaOption === 'photo_upload' && !isLocalUpload) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Option "Upload Image" requires an uploaded file from device (/uploads/...), not an external web link.',
        path: ['url']
      });
    } else if (data.mediaOption === 'photo_url' && isLocalUpload) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Option "Upload Image URL" requires an external web link (http:// or https://), not a local upload path.',
        path: ['url']
      });
    } else if (data.mediaOption === 'video_upload' && !isLocalUpload) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Option "Upload Video" requires an uploaded video file from device (/uploads/...), not an external web link.',
        path: ['url']
      });
    } else if (data.mediaOption === 'video_url' && isLocalUpload) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Option "Upload Video URL" requires an external video URL (e.g. YouTube, Vimeo, or HTTP video link), not a local upload path.',
        path: ['url']
      });
    }
  }
});

const profileBlogSchema = z.object({
  _id: z.string().optional(),
  title: z.string().trim().min(1, 'Blog title is required').max(200, 'Blog title cannot exceed 200 characters'),
  excerpt: z.string().max(500, 'Excerpt cannot exceed 500 characters').optional(),
  content: z.string().max(15000, 'Blog content cannot exceed 15000 characters').optional(),
  url: z.string().max(1000, 'Blog URL cannot exceed 1000 characters').optional().or(z.literal('')),
  coverImage: z.string().max(1000, 'Cover image URL cannot exceed 1000 characters').optional().or(z.literal('')),
  publishedDate: z.string().datetime().optional().nullable().or(z.date().optional()),
  readTime: z.string().max(30, 'Read time cannot exceed 30 characters').optional(),
  tags: z.array(z.string().trim().max(40, 'Tag cannot exceed 40 characters')).max(20, 'Cannot exceed 20 tags').optional(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
});

export const updateDraftProfileSchema = z.object({
  headline: z.string().trim().max(255, 'Headline cannot exceed 255 characters').optional(),
  bio: z.string().trim().max(2000, 'Bio cannot exceed 2000 characters').optional(),
  phone: z.string().trim().max(30, 'Phone number cannot exceed 30 characters').optional().or(z.literal('')),
  workEmail: z.string().email('Invalid email address').max(100, 'Email cannot exceed 100 characters').optional().or(z.literal('')),
  avatarUrl: z.string().max(2000, 'Avatar URL cannot exceed 2000 characters').optional().or(z.literal('')),
  collaborationNote: z.string().trim().max(500, 'Collaboration note cannot exceed 500 characters').optional(),
  overviewStats: z.object({
    connectionsCount: z.string().trim().max(30, 'Connections count cannot exceed 30 characters').optional(),
    connections: z.string().trim().max(30, 'Connections count cannot exceed 30 characters').optional(),
    projectsCount: z.string().trim().max(30, 'Projects count cannot exceed 30 characters').optional(),
    projects: z.string().trim().max(30, 'Projects count cannot exceed 30 characters').optional(),
    yearsOfExperience: z.string().trim().max(30, 'Years of experience cannot exceed 30 characters').optional(),
    years: z.string().trim().max(30, 'Years of experience cannot exceed 30 characters').optional(),
    servicesCount: z.string().trim().max(30, 'Services count cannot exceed 30 characters').optional(),
    services: z.string().trim().max(30, 'Services count cannot exceed 30 characters').optional(),
    customMetrics: z.array(z.object({
      label: z.string().trim().max(50, 'Metric label cannot exceed 50 characters'),
      value: z.string().trim().max(30, 'Metric value cannot exceed 30 characters')
    })).max(10, 'Cannot exceed 10 custom metrics').optional()
  }).optional(),
  about: z.object({
    title: z.string().trim().max(100, 'About title cannot exceed 100 characters').optional(),
    introduction: z.string().trim().max(2000, 'Introduction cannot exceed 2000 characters').optional(),
    expertise: z.union([
      z.string().trim().max(2000, 'Expertise cannot exceed 2000 characters'),
      z.array(z.string().trim().max(60, 'Expertise item cannot exceed 60 characters')).max(50, 'Cannot exceed 50 expertise items')
    ]).optional(),
    experienceSummary: z.string().trim().max(2000, 'Experience summary cannot exceed 2000 characters').optional(),
    experience: z.string().trim().max(2000, 'Experience cannot exceed 2000 characters').optional()
  }).optional(),
  connectAndContact: z.object({
    title: z.string().trim().max(100, 'Title cannot exceed 100 characters').optional(),
    note: z.string().trim().max(500, 'Note cannot exceed 500 characters').optional(),
    workEmail: z.string().email('Invalid email address').max(100, 'Email cannot exceed 100 characters').optional().or(z.literal('')),
    phone: z.string().trim().max(30, 'Phone number cannot exceed 30 characters').optional().or(z.literal('')),
    linkedin: z.string().max(1000).optional().or(z.literal('')),
    twitter: z.string().max(1000).optional().or(z.literal('')),
    socialLinks: z.array(socialLinkSchema).optional(),
    ctaButtonText: z.string().trim().max(50, 'CTA button text cannot exceed 50 characters').optional()
  }).optional(),
  location: z.union([
    z.string().max(150, 'Location cannot exceed 150 characters').transform((val) => {
      if (!val || val.trim() === '[object Object]') {
        return { city: '', country: '' };
      }
      const parts = val.split(',').map((p) => p.trim()).filter((p) => p && p !== '[object Object]');
      return { city: (parts[0] || '').slice(0, 100), country: (parts[1] || '').slice(0, 100) };
    }),
    z.object({
      city: z.string().trim().max(100, 'City cannot exceed 100 characters').optional().default(''),
      country: z.string().trim().max(100, 'Country cannot exceed 100 characters').optional().default('')
    }).passthrough().transform((obj) => ({
      ...obj,
      city: obj.city === '[object Object]' ? '' : (obj.city || ''),
      country: obj.country === '[object Object]' ? '' : (obj.country || '')
    }))
  ]).optional(),
  experience: z.array(experienceSchema).max(50, 'Cannot exceed 50 experience entries').optional(),
  journey: z.array(journeySchema).max(50, 'Cannot exceed 50 journey entries').optional(),
  skills: z.any().optional(),
  projects: z.array(projectSchema).max(50, 'Cannot exceed 50 projects').optional(),
  impactMetrics: z.array(impactMetricSchema).max(20, 'Cannot exceed 20 impact metrics').optional(),
  achievements: z.array(achievementSchema).max(50, 'Cannot exceed 50 achievements').optional(),
  mediaGallery: z.array(profileMediaSchema).max(50, 'Cannot exceed 50 media gallery items').optional(),
  blogs: z.array(profileBlogSchema).max(50, 'Cannot exceed 50 blog posts').optional(),
  socialLinks: z.array(socialLinkSchema).max(25, 'Cannot exceed 25 social links').optional(),
  customSections: z.array(customSectionSchema).max(10, 'Cannot exceed 10 custom sections').optional(),
  themeOverrides: z.object({
    primaryColor: z.string().max(30, 'Color cannot exceed 30 characters').optional(),
    secondaryColor: z.string().max(30, 'Color cannot exceed 30 characters').optional(),
    accentColor: z.string().max(30, 'Color cannot exceed 30 characters').optional(),
    fontHeading: z.string().max(50, 'Font name cannot exceed 50 characters').optional(),
    fontBody: z.string().max(50, 'Font name cannot exceed 50 characters').optional(),
    customCss: z.string().max(5000, 'Custom CSS cannot exceed 5000 characters').optional()
  }).optional(),
  templateId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Template ID').optional(),
  visibility: z.enum(['public', 'private', 'internal']).optional(),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100, 'Slug cannot exceed 100 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens').optional()
});

export const submitProfileForApprovalSchema = z.object({
  note: z.string().trim().max(500, 'Review note cannot exceed 500 characters').optional(),
  reviewNotes: z.string().trim().max(500, 'Review note cannot exceed 500 characters').optional(),
  formData: updateDraftProfileSchema.optional(),
  draftData: updateDraftProfileSchema.optional()
}).transform((d) => ({
  note: d.note || d.reviewNotes || '',
  formData: d.formData || d.draftData || null
}));
