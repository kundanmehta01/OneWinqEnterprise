import mongoose from 'mongoose';

const valueItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' }
  },
  { _id: false }
);

const productServiceItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    category: { type: String, default: 'Products' },
    badge: { type: String, default: '' },
    ctaUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
  },
  { _id: true }
);

const companyProjectItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'General' },
    status: {
      type: String,
      enum: ['all', 'ongoing', 'completed'],
      default: 'ongoing'
    },
    imageUrl: { type: String, default: '' },
    projectUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
  },
  { _id: true }
);

const companyAchievementItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    year: { type: String, default: '' },
    badge: { type: String, default: '' },
    metric: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
  },
  { _id: true }
);

const dynamicSectionSchema = new mongoose.Schema(
  {
    sectionId: { type: String, required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['overview', 'about', 'services', 'team', 'projects', 'achievements', 'updates', 'contact', 'custom'],
      default: 'custom'
    },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
  },
  { _id: false }
);

const navItemSchema = new mongoose.Schema(
  {
    navId: { type: String, required: true },
    label: { type: String, required: true },
    targetSectionId: { type: String, default: '' },
    icon: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
  },
  { _id: false }
);

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
  },
  { _id: false }
);

const companyProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'OneWinq'
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      default: 'onewinq'
    },
    tagline: {
      type: String,
      default: 'Next-Generation Enterprise Digital Identity Platform'
    },
    description: {
      type: String,
      default: ''
    },
    industry: {
      type: String,
      default: 'Technology & Enterprise Software'
    },
    website: {
      type: String,
      default: 'https://onewinq.com'
    },
    overviewStats: {
      foundedYear: { type: String, default: '2024' },
      locationShort: { type: String, default: 'Indore' },
      teamSize: { type: String, default: '25+' },
      customMetrics: [
        {
          label: { type: String, default: '' },
          value: { type: String, default: '' }
        }
      ]
    },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      zipCode: { type: String, default: '' }
    },
    contact: {
      email: { type: String, default: 'contact@onewinq.com' },
      phone: { type: String, default: '' },
      supportEmail: { type: String, default: 'support@onewinq.com' },
      workingHours: { type: String, default: 'Mon - Sat (10 AM - 7 PM)' },
      directionsUrl: { type: String, default: '' }
    },
    about: {
      aboutCompany: { type: String, default: '' },
      mission: { type: String, default: '' },
      vision: { type: String, default: '' },
      story: { type: String, default: '' },
      values: [valueItemSchema]
    },
    productsServices: [productServiceItemSchema],
    projects: [companyProjectItemSchema],
    achievements: [companyAchievementItemSchema],
    branding: {
      logoUrl: { type: String, default: '' },
      coverUrl: { type: String, default: '' },
      faviconUrl: { type: String, default: '' },
      primaryColor: { type: String, default: '#2563eb' },
      secondaryColor: { type: String, default: '#0f172a' },
      accentColor: { type: String, default: '#38bdf8' },
      fontHeading: { type: String, default: 'Inter' },
      fontBody: { type: String, default: 'Inter' },
      themeMode: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system'
      }
    },
    dynamicSections: [dynamicSectionSchema],
    navigation: [navItemSchema],
    socialLinks: [socialLinkSchema],
    isPublic: {
      type: Boolean,
      default: true
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

export const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);
