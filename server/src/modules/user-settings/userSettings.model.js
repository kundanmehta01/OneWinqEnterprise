import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'company_only', 'private'],
        default: 'public'
      },
      showEmail: {
        type: String,
        enum: ['public', 'connections', 'company_only', 'hidden'],
        default: 'company_only'
      },
      showPhone: {
        type: String,
        enum: ['public', 'connections', 'company_only', 'hidden'],
        default: 'connections'
      },
      allowConnectionRequests: {
        type: Boolean,
        default: true
      }
    },
    notifications: {
      emailOnConnectionRequest: {
        type: Boolean,
        default: true
      },
      emailOnEventInvite: {
        type: Boolean,
        default: true
      },
      emailOnCompanyUpdate: {
        type: Boolean,
        default: true
      },
      inAppAll: {
        type: Boolean,
        default: true
      }
    }
  },
  {
    timestamps: true
  }
);

export const UserSettings = mongoose.model('UserSettings', userSettingsSchema);
