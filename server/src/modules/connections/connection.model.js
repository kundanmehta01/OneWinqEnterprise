import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'blocked'],
      default: 'pending',
      index: true
    },
    note: {
      type: String,
      maxlength: 300,
      trim: true,
      default: ''
    },
    connectedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

connectionSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });
connectionSchema.index({ status: 1, requesterId: 1 });
connectionSchema.index({ status: 1, recipientId: 1 });

export const Connection = mongoose.model('Connection', connectionSchema);
