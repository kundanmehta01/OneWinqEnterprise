import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    designation: {
      type: String,
      required: true,
      trim: true
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      index: true
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'invited', 'archived'],
      default: 'active',
      index: true
    },
    joiningDate: {
      type: Date,
      default: Date.now
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmployeeProfile',
      index: true
    },
    profileCompletionScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    },
    archivedAt: {
      type: Date,
      default: null
    },
    archivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for fast searching and filtering
teamMemberSchema.index({ status: 1, departmentId: 1 });
teamMemberSchema.index({ name: 'text', designation: 'text', employeeId: 'text' });

export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
