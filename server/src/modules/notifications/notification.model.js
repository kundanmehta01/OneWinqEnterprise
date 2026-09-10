import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: [
        'INVITATION',
        'PROFILE_SUBMITTED',
        'PROFILE_APPROVED',
        'PROFILE_REJECTED',
        'CHANGES_REQUESTED',
        'SYSTEM_ALERT',
        'EVENT_CREATED',
        'EVENT_REGISTERED',
        'EVENT_MEMBER_REGISTERED',
        'EVENT_REGISTRATION_CANCELLED',
        'MEMBER_JOINED',
        'CARD_LINKED',
        'CONNECTION_REQUESTED',
        'CONNECTION_ACCEPTED'
      ],
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    readAt: {
      type: Date,
      default: null
    },
    channel: {
      type: String,
      enum: ['in_app', 'email', 'all'],
      default: 'in_app'
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
