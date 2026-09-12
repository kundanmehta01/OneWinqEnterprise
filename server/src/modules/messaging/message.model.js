import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    originalName: { type: String, default: '' },
    filename: { type: String, default: '' },
    mimeType: { type: String, default: '' },
    size: { type: Number, default: 0 }
  },
  { _id: false }
);

const readBySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    readAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    content: {
      type: String,
      maxlength: 4000,
      default: ''
    },
    contentType: {
      type: String,
      enum: ['text', 'image', 'file', 'system'],
      default: 'text',
      index: true
    },
    attachments: {
      type: [attachmentSchema],
      default: []
    },
    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    },
    // Read receipts
    readBy: {
      type: [readBySchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Compound index for paginated message loading per conversation
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ conversationId: 1, isDeleted: 1, createdAt: -1 });

export const Message = mongoose.model('Message', messageSchema);
