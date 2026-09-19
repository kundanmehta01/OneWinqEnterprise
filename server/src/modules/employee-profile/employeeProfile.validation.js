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
  period: z.string().max(150, 'Period cannot exceed 150 characters').optional().default(''),
  location: z.any().optional(),
  startDate: z.any().optional(),
  endDate: z.any().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().max(3000, 'Experience description cannot exceed 3000 characters').optional().or(z.literal('')),
  order: z.number().int().default(0)
}).passthrough();

const skillSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required').max(60, 'Skill name cannot exceed 60 characters'),
  category: z.string().trim().max(50, 'Skill category cannot exceed 50 characters').default('General'),
  proficiencyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).default('Intermediate'),
  order: z.number().int().default(0)
}).passthrough();

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
  period: z.string().max(150, 'Period cannot exceed 150 characters').optional().default(''),
  year: z.string().max(50, 'Year cannot exceed 50 characters').optional().default(''),
  isCurrent: z.boolean().default(false),
  description: z.string().max(3000, 'Journey description cannot exceed 3000 characters').optional().or(z.literal('')),
  icon: z.any().optional(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
}).passthrough();

const impactMetricSchema = z.object({
  _id: z.string().optional(),
  metric: z.string().trim().max(50, 'Metric cannot exceed 50 characters').optional().default(''),
  label: z.string().trim().max(150, 'Label cannot exceed 150 characters').optional().default(''),
  order: z.number().int().default(0)
}).passthrough();

const projectSchema = z.object({
  _id: z.string().optional(),
  title: z.string().trim().max(150, 'Project title cannot exceed 150 characters').optional().default(''),
  description: z.string().max(3000, 'Project description cannot exceed 3000 characters').optional().or(z.literal('')),
  role: z.string().max(100, 'Role cannot exceed 100 characters').optional().or(z.literal('')),
  url: z.string().max(1000, 'URL cannot exceed 1000 characters').optional().or(z.literal('')).or(z.null()),
  imageUrl: z.string().max(1000, 'Image URL cannot exceed 1000 characters').optional().or(z.literal('')).or(z.null()),
  status: z.any().optional().default('completed'),
  badge: z.string().max(50, 'Badge cannot exceed 50 characters').optional().or(z.literal('')),
  startDate: z.any().optional(),
  endDate: z.any().optional(),
  technologies: z.array(z.string().trim().max(50, 'Technology name cannot exceed 50 characters')).max(30, 'Cannot exceed 30 technologies').optional(),
  order: z.number().int().default(0)
}).passthrough();

const achievementSchema = z.object({
  _id: z.string().optional(),
  title: z.string().trim().max(150, 'Achievement title cannot exceed 150 characters').optional().default(''),
  subtitle: z.string().max(150, 'Subtitle cannot exceed 150 characters').optional().or(z.literal('')),
  issuer: z.string().max(100, 'Issuer cannot exceed 100 characters').optional().or(z.literal('')),
  issueDate: z.any().optional(),
  description: z.string().max(2000, 'Achievement description cannot exceed 2000 characters').optional().or(z.literal('')),
  certificateUrl: z.string().max(1000, 'Certificate URL cannot exceed 1000 characters').optional().or(z.literal('')).or(z.null()),
  icon: z.string().max(50, 'Icon cannot exceed 50 characters').optional().or(z.literal('')),
  badge: z.string().max(50, 'Badge cannot exceed 50 characters').optional().or(z.literal('')),
  imageUrl: z.string().max(1000, 'Image URL cannot exceed 1000 characters').optional().or(z.literal('')).or(z.null()),
  isFeatured: z.boolean().default(true),
  order: z.number().int().default(0)
}).passthrough();

const socialLinkSchema = z.object({
  _id: z.string().optional(),
  platform: z.string().trim().max(50, 'Platform name cannot exceed 50 characters').optional().default('Other'),
  url: z.string().max(1000, 'URL cannot exceed 1000 characters').optional().or(z.literal('')).or(z.null()),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
}).passthrough();

const customSectionSchema = z.object({
  _id: z.string().optional(),
  sectionId: z.string().trim().max(50, 'Section ID cannot exceed 50 characters').optional().default('section'),
  title: z.string().trim().max(100, 'Section title cannot exceed 100 characters').optional().default('Section'),
  content: z.any().optional(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
}).passthrough();

const profileMediaSchema = z.object({
  _id: z.string().optional(),
  title: z.string().trim().max(150, 'Media title cannot exceed 150 characters').optional().default('Media Asset'),
  url: z.string().trim().min(1, 'Media URL is required').max(1000, 'Media URL cannot exceed 1000 characters'),
  type: z.enum(['all', 'photo', 'video', 'news', 'event']).default('photo'),
  mediaOption: z.enum(['photo_url', 'photo_upload', 'video_upload', 'video_url']).optional(),
  uploadUrl: z.string().max(1000).optional().or(z.literal('')).or(z.null()),
  linkUrl: z.string().max(1000).optional().or(z.literal('')).or(z.null()),
  thumbnailUrl: z.string().max(1000, 'Thumbnail URL cannot exceed 1000 characters').optional().or(z.literal('')).or(z.null()),
  date: z.any().optional(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
}).passthrough().superRefine((data, ctx) => {
  // Strict Validation 1: If client sends dual fields uploadUrl and linkUrl, reject
  if (data.uploadUrl && data.uploadUrl.trim() && data.linkUrl && data.linkUrl.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Cannot provide both an uploaded file and a web URL. Exactly one must be selected.',
      path: ['url']
    });
    return;
  }

  let u = (data.url || '').trim();
  // Auto-prefix https:// if protocol was omitted for common video and web hosts
  if (/^(?:www\.|youtube\.com|youtu\.be|vimeo\.com)/i.test(u)) {
    u = `https://${u}`;
    data.url = u;
  }

  const isLocalUpload = /^\/?uploads\//i.test(u) || u.includes('/uploads/') || u.startsWith('blob:') || u.startsWith('data:');
  const isCloudStorage = /cloudinary\.com|amazonaws\.com|digitaloceanspaces\.com|storage\.googleapis\.com/i.test(u);
  const isUploadedFile = isLocalUpload || isCloudStorage;
  const isWebUrl = /^https?:\/\/[^\s]+$/i.test(u);

  if (!isLocalUpload && !isWebUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Media URL must be either a valid web URL (http:// or https://) or an uploaded file path (/uploads/...).',
      path: ['url']
    });
    return;
  }

  // Auto-generate YouTube thumbnail if not provided
  if ((data.type === 'video' || data.mediaOption?.startsWith('video')) && (!data.thumbnailUrl || !data.thumbnailUrl.trim())) {
    const ytMatch = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/))([\w-]{11})/i);
    if (ytMatch && ytMatch[1]) {
      data.thumbnailUrl = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    }
  }

  // Strict Validation 2: Ensure url matches the chosen dropdown mediaOption
  if (data.mediaOption) {
    if (data.mediaOption === 'photo_upload' && !isUploadedFile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Option "Upload Image" requires an uploaded file from device or cloud storage, not an external web link.',
        path: ['url']
      });
    } else if (data.mediaOption === 'photo_url' && isLocalUpload) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Option "Upload Image URL" requires an external web link (http:// or https://), not a local upload path.',
        path: ['url']
      });
    } else if (data.mediaOption === 'video_upload' && !isUploadedFile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Option "Upload Video" requires an uploaded video file from device or cloud storage, not an external web link.',
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
  title: z.string().trim().max(200, 'Blog title cannot exceed 200 characters').optional().default(''),
  excerpt: z.string().max(1000, 'Excerpt cannot exceed 1000 characters').optional().or(z.literal('')).or(z.null()),
  content: z.string().max(25000, 'Blog content cannot exceed 25000 characters').optional().or(z.literal('')).or(z.null()),
  url: z.string().max(1000, 'Blog URL cannot exceed 1000 characters').optional().or(z.literal('')).or(z.null()),
  coverImage: z.string().max(1000, 'Cover image URL cannot exceed 1000 characters').optional().or(z.literal('')).or(z.null()),
  publishedDate: z.any().optional(),
  readTime: z.string().max(50, 'Read time cannot exceed 50 characters').optional().or(z.literal('')).or(z.null()),
  tags: z.array(z.string().trim().max(50, 'Tag cannot exceed 50 characters')).max(30, 'Cannot exceed 30 tags').optional(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true)
}).passthrough();

export const updateDraftProfileSchema = z.object({
  headline: z.string().trim().max(255, 'Headline cannot exceed 255 characters').optional().or(z.literal('')).or(z.null()),
  bio: z.string().trim().max(3000, 'Bio cannot exceed 3000 characters').optional().or(z.literal('')).or(z.null()),
  phone: z.string().trim().max(50, 'Phone number cannot exceed 50 characters').optional().or(z.literal('')).or(z.null()),
  workEmail: z.string().trim().max(100).refine((val) => {
    if (!val || val === '') return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }, { message: 'Invalid email address' }).optional().or(z.literal('')).or(z.null()),
  avatarUrl: z.string().max(2000, 'Avatar URL cannot exceed 2000 characters').optional().or(z.literal('')).or(z.null()),
  collaborationNote: z.string().trim().max(1000, 'Collaboration note cannot exceed 1000 characters').optional().or(z.literal('')).or(z.null()),
  overviewStats: z.object({
    connectionsCount: z.any().optional(),
    connections: z.any().optional(),
    projectsCount: z.any().optional(),
    projects: z.any().optional(),
    yearsOfExperience: z.any().optional(),
    years: z.any().optional(),
    servicesCount: z.any().optional(),
    services: z.any().optional(),
    customMetrics: z.any().optional()
  }).passthrough().optional(),
  about: z.object({
    title: z.any().optional(),
    introduction: z.any().optional(),
    expertise: z.any().optional(),
    experienceSummary: z.any().optional(),
    experience: z.any().optional()
  }).passthrough().optional(),
  connectAndContact: z.object({
    title: z.any().optional(),
    note: z.any().optional(),
    workEmail: z.string().trim().max(100).refine((val) => {
      if (!val || val === '') return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }, { message: 'Invalid email address' }).optional().or(z.literal('')).or(z.null()),
    phone: z.any().optional(),
    linkedin: z.any().optional(),
    twitter: z.any().optional(),
    socialLinks: z.array(socialLinkSchema).optional(),
    ctaButtonText: z.any().optional()
  }).passthrough().optional(),
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
  }).passthrough().optional(),
  templateId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Template ID').optional(),
  visibility: z.enum(['public', 'private', 'internal']).optional(),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100, 'Slug cannot exceed 100 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens').optional(),
  publishImmediately: z.boolean().optional()
}).passthrough();

export const submitProfileForApprovalSchema = z.object({
  note: z.string().trim().max(500, 'Review note cannot exceed 500 characters').optional().or(z.literal('')),
  reviewNotes: z.string().trim().max(500, 'Review note cannot exceed 500 characters').optional().or(z.literal('')),
  formData: z.any().optional(),
  draftData: z.any().optional()
}).passthrough().transform((d) => ({
  note: d.note || d.reviewNotes || '',
  formData: d.formData || d.draftData || null
}));
