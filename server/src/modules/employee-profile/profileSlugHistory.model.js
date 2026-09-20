import mongoose from 'mongoose';

const profileSlugHistorySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmployeeProfile',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const ProfileSlugHistory = mongoose.model('ProfileSlugHistory', profileSlugHistorySchema);
