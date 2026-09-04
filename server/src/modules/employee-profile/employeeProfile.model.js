import mongoose from 'mongoose';

const experienceItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: '' },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 }
  },
  { _id: true }
);

const skillItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: 'General' },
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
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
  },
  { _id: true }
);

const impactMetricItemSchema = new mongoose.Schema(
  {
    metric: { type: String, required: true },
    label: { type: String, required: true },
    order: { type: Number, default: 0 }
  },
  { _id: true }
);

const projectItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    role: { type: String, default: '' },
    url: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['all', 'ongoing', 'completed'],
      default: 'completed'
    },
    badge: { type: String, default: '' },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    technologies: [String],
    order: { type: Number, default: 0 }
  },
  { _id: true }
);

const achievementItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    issuer: { type: String, default: '' },
    issueDate: { type: Date, default: null },
    description: { type: String, default: '' },
    certificateUrl: { type: String, default: '' },
    icon: { type: String, default: '' },
    badge: { type: String, default: '' },
    isFeatured: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { _id: true }
);

const profileSocialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
  },
  { _id: true }
);

const customSectionSchema = new mongoose.Schema(
  {
    sectionId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
  },
  { _id: true }
);

const profileDataSchema = new mongoose.Schema(
  {
    headline: { type: String, default: '' },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    workEmail: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    coverUrl: { type: String, default: '' },
    collaborationNote: {
      type: String,
      default: 'Open for collaboration, speaking opportunities and new ideas.'
    },
    overviewStats: {
      connectionsCount: { type: String, default: '248+' },
      projectsCount: { type: String, default: '25+' },
      yearsOfExperience: { type: String, default: '8+' },
      servicesCount: { type: String, default: '5+' },
      customMetrics: [
        {
          label: { type: String, default: '' },
          value: { type: String, default: '' }
        }
      ]
    },
    location: {
      city: { type: String, default: '' },
      country: { type: String, default: '' }
    },
    experience: [experienceItemSchema],
    journey: [journeyItemSchema],
    skills: [skillItemSchema],
    projects: [projectItemSchema],
    impactMetrics: [impactMetricItemSchema],
    achievements: [achievementItemSchema],
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
      index: true
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
      primaryColor: { type: String, default: '' },
      secondaryColor: { type: String, default: '' },
      accentColor: { type: String, default: '' },
      fontHeading: { type: String, default: '' },
      fontBody: { type: String, default: '' },
      customCss: { type: String, default: '' }
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
  const data = this.published || this.draft || {};
  let score = 0;
  if (data.headline) score += 15;
  if (data.bio) score += 15;
  if (data.avatarUrl) score += 20;
  if (data.workEmail || data.phone) score += 10;
  if (data.experience && data.experience.length > 0) score += 15;
  if (data.skills && data.skills.length > 0) score += 10;
  if (data.projects && data.projects.length > 0) score += 10;
  if (data.socialLinks && data.socialLinks.length > 0) score += 5;
  this.completionPercentage = Math.min(score, 100);
  return this.completionPercentage;
};

export const EmployeeProfile = mongoose.model('EmployeeProfile', employeeProfileSchema);
