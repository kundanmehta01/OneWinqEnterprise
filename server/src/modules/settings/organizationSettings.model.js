import mongoose from 'mongoose';

const organizationSettingsSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      default: 'OneWinq',
      trim: true
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    language: {
      type: String,
      default: 'en'
    },
    profileSettings: {
      defaultVisibility: {
        type: String,
        enum: ['public', 'private', 'internal'],
        default: 'public'
      },
      defaultTemplateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
        default: null
      },
      requireApprovalForProfileChanges: {
        type: Boolean,
        default: true
      },
      allowCustomThemes: {
        type: Boolean,
        default: true
      }
    },
    securitySettings: {
      passwordMinLength: {
        type: Number,
        default: 8
      },
      sessionTimeoutMinutes: {
        type: Number,
        default: 60
      },
      maxFailedLogins: {
        type: Number,
        default: 5
      },
      twoFactorEnabled: {
        type: Boolean,
        default: false
      },
      ssoEnabled: {
        type: Boolean,
        default: false
      }
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

export const OrganizationSettings = mongoose.model('OrganizationSettings', organizationSettingsSchema);
