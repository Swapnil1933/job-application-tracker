const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
      maxlength: [100, 'Position cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: ['Applied', 'OA', 'Interview', 'Rejected', 'Offer'],
      default: 'Applied',
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'],
      default: 'Full-time',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    remote: {
      type: Boolean,
      default: false,
    },
    salary: {
      type: String,
      trim: true,
      default: '',
    },
    url: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    deadline: {
      type: Date,
      default: null,
    },
    resume: {
      type: String,
      default: '',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance
jobSchema.index({ user: 1, status: 1 });
jobSchema.index({ user: 1, createdAt: -1 });
jobSchema.index({ position: 'text', company: 'text', notes: 'text' });

module.exports = mongoose.model('Job', jobSchema);
