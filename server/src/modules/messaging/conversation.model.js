import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member'
    },
    lastReadAt: {
      type: Date,
      default: null
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const lastMessageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, default: '' },
    contentType: { type: String, default: 'text' },
    sentAt: { type: Date, default: null }
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['direct', 'group'],
      required: true,
      index: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    participants: {
      type: [participantSchema],
      default: []
    },
    // Group-only fields
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: ''
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    lastMessage: {
      type: lastMessageSchema,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for efficient queries
conversationSchema.index({ companyId: 1, 'participants.userId': 1 });
conversationSchema.index({ companyId: 1, type: 1, isActive: 1 });
conversationSchema.index({ 'lastMessage.sentAt': -1 });

export const Conversation = mongoose.model('Conversation', conversationSchema);
