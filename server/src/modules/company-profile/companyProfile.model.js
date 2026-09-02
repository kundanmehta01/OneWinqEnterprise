import mongoose from 'mongoose';

const valueItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' }
  },
  { _id: false }
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
      supportEmail: { type: String, default: 'support@onewinq.com' }
    },
    about: {
      aboutCompany: { type: String, default: '' },
      mission: { type: String, default: '' },
      vision: { type: String, default: '' },
      values: [valueItemSchema]
    },
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
