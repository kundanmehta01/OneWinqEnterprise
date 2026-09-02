import mongoose from 'mongoose';

const mediaAssetSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true,
      index: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    key: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      default: 'local'
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    entityType: {
      type: String,
      enum: ['company_logo', 'company_cover', 'avatar', 'cover', 'template_asset', 'attachment', 'general'],
      default: 'general',
      index: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const MediaAsset = mongoose.model('MediaAsset', mediaAssetSchema);
