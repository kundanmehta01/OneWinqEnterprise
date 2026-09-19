import mongoose from 'mongoose';

const experienceItemSchema = new mongoose.Schema(
  {
    company: { type: String, default: '', maxlength: 100 },
    title: { type: String, default: '', maxlength: 100 },
    role: { type: String, default: '', maxlength: 100 },
    from: { type: String, default: '', maxlength: 50 },
    to: { type: String, default: '', maxlength: 50 },
    fromMonth: { type: String, default: '', maxlength: 30 },
    toMonth: { type: String, default: '', maxlength: 30 },
    fromYear: { type: String, default: '', maxlength: 20 },
    toYear: { type: String, default: '', maxlength: 20 },
    period: { type: String, default: '', maxlength: 60 },
    isCurrent: { type: Boolean, default: false },
    location: { type: String, default: '', maxlength: 100 },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    description: { type: String, default: '', maxlength: 2000 },
    order: { type: Number, default: 0 }
  },
  { _id: true }
);

const skillItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 60 },
    category: { type: String, default: 'General', maxlength: 50 },
    proficiencyLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate'
    },
    order: { type: Number, default: 0 }
  },
  { _id: true }
);

const journeyItemSchema = new mongoose.Schema(
  {
    company: { type: String, default: '', maxlength: 100 },
    role: { type: String, default: '', maxlength: 100 },
    title: { type: String, default: '', maxlength: 100 },
    from: { type: String, default: '', maxlength: 50 },
    to: { type: String, default: '', maxlength: 50 },
    fromMonth: { type: String, default: '', maxlength: 30 },
    toMonth: { type: String, default: '', maxlength: 30 },
    fromYear: { type: String, default: '', maxlength: 20 },
    toYear: { type: String, default: '', maxlength: 20 },
    period: { type: String, default: '', maxlength: 60 },
    year: { type: String, default: '', maxlength: 30 },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, default: '', maxlength: 2000 },
    icon: { type: String, default: '', maxlength: 50 },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
  },
  { _id: true }
);

const impactMetricItemSchema = new mongoose.Schema(
  {
    metric: { type: String, required: true, maxlength: 30 },
    label: { type: String, required: true, maxlength: 100 },
    order: { type: Number, default: 0 }
  },
  { _id: true }
);

const projectItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 150 },
    description: { type: String, default: '', maxlength: 2000 },
    role: { type: String, default: '', maxlength: 100 },
    url: { type: String, default: '', maxlength: 1000 },
    imageUrl: { type: String, default: '', maxlength: 1000 },
    status: {
      type: String,
      enum: ['all', 'ongoing', 'completed'],
      default: 'completed'
    },
    badge: { type: String, default: '', maxlength: 50 },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    technologies: [{ type: String, maxlength: 50 }],
    order: { type: Number, default: 0 }
  },
  { _id: true }
);

const achievementItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 150 },
    subtitle: { type: String, default: '', maxlength: 150 },
    issuer: { type: String, default: '', maxlength: 100 },
    issueDate: { type: Date, default: null },
    description: { type: String, default: '', maxlength: 1500 },
    certificateUrl: { type: String, default: '', maxlength: 1000 },
    icon: { type: String, default: '', maxlength: 50 },
    badge: { type: String, default: '', maxlength: 50 },
    imageUrl: { type: String, default: '', maxlength: 1000 },
    isFeatured: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { _id: true }
);

const profileSocialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, maxlength: 50 },
    url: { type: String, required: true, maxlength: 1000 },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
  },
  { _id: true }
);

const customSectionSchema = new mongoose.Schema(
  {
    sectionId: { type: String, required: true, maxlength: 50 },
    title: { type: String, required: true, maxlength: 100 },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
  },
  { _id: true }
);

const profileMediaItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 150 },
    url: { type: String, required: true, maxlength: 1000 },
    type: {
      type: String,
      enum: ['all', 'photo', 'video', 'news', 'event'],
      default: 'photo'
    },
    mediaOption: {
      type: String,
      enum: ['photo_url', 'photo_upload', 'video_upload', 'video_url'],
      default: 'photo_url'
    },
    thumbnailUrl: { type: String, default: '', maxlength: 1000 },
    date: { type: Date, default: Date.now },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
  },
  { _id: true }
);

const profileBlogItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 200 },
    excerpt: { type: String, default: '', maxlength: 500 },
    content: { type: String, default: '', maxlength: 15000 },
    url: { type: String, default: '', maxlength: 1000 },
    coverImage: { type: String, default: '', maxlength: 1000 },
    publishedDate: { type: Date, default: Date.now },
    readTime: { type: String, default: '5 min read', maxlength: 30 },
    tags: [{ type: String, maxlength: 40 }],
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
  },
  { _id: true }
);

const profileDataSchema = new mongoose.Schema(
  {
    headline: { type: String, default: '', maxlength: 255 },
    bio: { type: String, default: '', maxlength: 2000 },
    phone: { type: String, default: '', maxlength: 30 },
    workEmail: { type: String, default: '', maxlength: 100 },
    avatarUrl: { type: String, default: '', maxlength: 1000 },
    collaborationNote: {
      type: String,
      default: 'Open for collaboration, speaking opportunities and new ideas.',
      maxlength: 500
    },
    overviewStats: {
      connectionsCount: { type: String, default: '', maxlength: 30 },
      connections: { type: String, default: '', maxlength: 30 },
      projectsCount: { type: String, default: '', maxlength: 30 },
      projects: { type: String, default: '', maxlength: 30 },
      yearsOfExperience: { type: String, default: '', maxlength: 30 },
      years: { type: String, default: '', maxlength: 30 },
      servicesCount: { type: String, default: '', maxlength: 30 },
      services: { type: String, default: '', maxlength: 30 },
      customMetrics: [
        {
          label: { type: String, default: '', maxlength: 50 },
          value: { type: String, default: '', maxlength: 30 }
        }
      ]
    },
    location: {
      city: { type: String, default: '', maxlength: 100 },
      country: { type: String, default: '', maxlength: 100 }
    },
    about: {
      title: { type: String, default: '', maxlength: 100 },
      introduction: { type: String, default: '', maxlength: 2000 },
      expertise: { type: mongoose.Schema.Types.Mixed, default: '' },
      experienceSummary: { type: String, default: '', maxlength: 2000 },
      experience: { type: String, default: '', maxlength: 2000 }
    },
    connectAndContact: {
      title: { type: String, default: "Let's Connect", maxlength: 100 },
      note: { type: String, default: 'Open for collaboration, speaking opportunities and new ideas.', maxlength: 500 },
      workEmail: { type: String, default: '', maxlength: 100 },
      phone: { type: String, default: '', maxlength: 30 },
      linkedin: { type: String, default: '', maxlength: 1000 },
      twitter: { type: String, default: '', maxlength: 1000 },
      socialLinks: [profileSocialLinkSchema],
      ctaButtonText: { type: String, default: 'Connect With Me', maxlength: 50 }
    },
    experience: [experienceItemSchema],
    journey: [journeyItemSchema],
    projects: [projectItemSchema],
    impactMetrics: [impactMetricItemSchema],
    achievements: [achievementItemSchema],
    mediaGallery: [profileMediaItemSchema],
    blogs: [profileBlogItemSchema],
    socialLinks: [profileSocialLinkSchema],
    customSections: [customSectionSchema]
  },
  { _id: false, timestamps: true }
);

const employeeProfileSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      maxlength: 100
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
      index: true
    },
    templateVersion: {
      type: Number,
      default: 1
    },
    themeOverrides: {
      primaryColor: { type: String, default: '', maxlength: 30 },
      secondaryColor: { type: String, default: '', maxlength: 30 },
      accentColor: { type: String, default: '', maxlength: 30 },
      fontHeading: { type: String, default: '', maxlength: 50 },
      fontBody: { type: String, default: '', maxlength: 50 },
      customCss: { type: String, default: '', maxlength: 5000 }
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'internal'],
      default: 'public',
      index: true
    },
    approvalStatus: {
      type: String,
      enum: ['draft', 'pending_review', 'approved', 'rejected', 'changes_requested'],
      default: 'draft',
      index: true
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    published: {
      type: profileDataSchema,
      default: () => ({})
    },
    draft: {
      type: profileDataSchema,
      default: () => ({})
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastSubmittedAt: {
      type: Date,
      default: null
    },
    lastApprovedAt: {
      type: Date,
      default: null
    },
    lastReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Calculate profile completion percentage based on filled data
employeeProfileSchema.methods.calculateCompletionScore = function () {
  const hasPublishedData = this.published && (
    this.published.headline ||
    this.published.bio ||
    this.published.avatarUrl ||
    (this.published.experience && this.published.experience.length > 0)
  );
  const data = hasPublishedData ? this.published : (this.draft || {});
  let score = 0;
  if (data.headline) score += 10;
  if (data.bio || data.about?.introduction) score += 15;
  if (data.avatarUrl) score += 15;
  if (data.workEmail || data.phone) score += 10;
  if (data.experience && data.experience.length > 0) score += 20;
  if (data.projects && data.projects.length > 0) score += 15;
  if (data.socialLinks && data.socialLinks.length > 0) score += 10;
  if (data.about?.expertise || data.about?.experienceSummary) score += 15;
  this.completionPercentage = Math.min(score, 100);
  return this.completionPercentage;
};

export const EmployeeProfile = mongoose.model('EmployeeProfile', employeeProfileSchema);
