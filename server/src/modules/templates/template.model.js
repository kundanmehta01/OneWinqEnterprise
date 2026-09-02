import mongoose from 'mongoose';

const templateVersionSchema = new mongoose.Schema(
  {
    version: {
      type: Number,
      required: true
    },
    layoutConfig: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    sectionOrder: [String],
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changeSummary: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false
  }
);

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    category: {
      type: String,
      enum: ['founder', 'ceo', 'leadership', 'employee', 'manager', 'custom'],
      default: 'employee',
      index: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    previewImageUrl: {
      type: String,
      default: ''
    },
    layoutConfig: {
      headerStyle: {
        type: String,
        enum: ['centered', 'cover_left', 'banner_minimal', 'compact'],
        default: 'centered'
      },
      colorPalette: {
        primary: { type: String, default: '#2563eb' },
        secondary: { type: String, default: '#1e293b' },
        accent: { type: String, default: '#38bdf8' },
        background: { type: String, default: '#ffffff' },
        text: { type: String, default: '#0f172a' }
      },
      fontHeading: { type: String, default: 'Inter' },
      fontBody: { type: String, default: 'Inter' },
      showBadges: { type: Boolean, default: true },
      showQrCode: { type: Boolean, default: true },
      customCss: { type: String, default: '' }
    },
    availableSections: [
      {
        sectionKey: { type: String, required: true },
        title: { type: String, required: true },
        isRequired: { type: Boolean, default: false },
        defaultOrder: { type: Number, default: 0 }
      }
    ],
    sectionOrder: [
      {
        type: String,
        trim: true
      }
    ],
    version: {
      type: Number,
      default: 1
    },
    versionHistory: [templateVersionSchema],
    isDefault: {
      type: Boolean,
      default: false,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

templateSchema.index({ category: 1, isActive: 1 });

export const Template = mongoose.model('Template', templateSchema);
