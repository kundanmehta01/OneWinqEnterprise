import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      enum: ['company', 'team', 'workshop', 'meeting', 'conference', 'training', 'social'],
      default: 'company',
      index: true
    },
    coverImageUrl: {
      type: String,
      default: ''
    },
    startDate: {
      type: Date,
      required: true,
      index: true
    },
    endDate: {
      type: Date,
      required: true
    },
    locationType: {
      type: String,
      enum: ['physical', 'virtual', 'hybrid'],
      default: 'physical'
    },
    locationAddress: {
      type: String,
      default: ''
    },
    meetingUrl: {
      type: String,
      default: ''
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    organizerName: {
      type: String,
      default: 'OneWinq'
    },
    maxCapacity: {
      type: Number,
      default: 0 // 0 means unlimited
    },
    registrationDeadline: {
      type: Date,
      default: null
    },
    eligibility: {
      type: {
        type: String,
        enum: ['all', 'departments', 'roles', 'invite_only'],
        default: 'all'
      },
      departmentIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Department'
        }
      ],
      roleIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Role'
        }
      ]
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled', 'completed'],
      default: 'published',
      index: true
    }
  },
  {
    timestamps: true
  }
);

eventSchema.index({ status: 1, startDate: 1 });

export const Event = mongoose.model('Event', eventSchema);
