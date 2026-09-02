import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ['PROFILE_VIEW', 'PROFILE_SHARE', 'QR_SCAN', 'PROFILE_LINK_CLICK', 'CONTACT_CLICK', 'TEMPLATE_VIEW'],
      required: true,
      index: true
    },
    targetType: {
      type: String,
      enum: ['COMPANY', 'EMPLOYEE', 'TEMPLATE'],
      default: 'EMPLOYEE',
      index: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    slug: {
      type: String,
      index: true
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ipHash: {
      type: String,
      index: true
    },
    userAgent: {
      type: String,
      default: ''
    },
    referer: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

analyticsEventSchema.index({ eventType: 1, timestamp: -1 });
analyticsEventSchema.index({ targetId: 1, timestamp: -1 });

export const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
