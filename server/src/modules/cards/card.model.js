import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    cardUid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    cardType: {
      type: String,
      enum: ['metal_black', 'metal_gold', 'metal_silver', 'pvc_matte', 'pvc_glossy', 'bamboo_wood', 'hybrid'],
      default: 'metal_black'
    },
    batchNumber: {
      type: String,
      trim: true,
      default: 'BATCH-2026-01'
    },
    status: {
      type: String,
      enum: ['available', 'activation_pending', 'active', 'suspended', 'deactivated', 'unassigned', 'linked', 'blocked', 'lost', 'retired'],
      default: 'available',
      index: true
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember',
      default: null,
      index: true
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmployeeProfile',
      default: null,
      index: true
    },
    activationToken: {
      type: String,
      default: null
    },
    activationTokenHash: {
      type: String,
      default: null,
      index: true
    },
    activationTokenExpiresAt: {
      type: Date,
      default: null
    },
    assignedAt: {
      type: Date,
      default: null
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    activatedAt: {
      type: Date,
      default: null
    },
    activatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    linkedAt: {
      type: Date,
      default: null
    },
    linkedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    unlinkedAt: {
      type: Date,
      default: null
    },
    unlinkedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    tapCount: {
      type: Number,
      default: 0
    },
    lastTappedAt: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

cardSchema.index({ status: 1, cardType: 1 });
cardSchema.index({ memberId: 1, status: 1 });

export const Card = mongoose.model('Card', cardSchema);
