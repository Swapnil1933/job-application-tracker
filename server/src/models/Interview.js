const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
    },
    type: {
      type: String,
      enum: ['Phone', 'Video', 'Onsite', 'Technical', 'Behavioral', 'System Design', 'HR'],
      default: 'Video',
    },
    date: {
      type: Date,
      required: [true, 'Interview date is required'],
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    link: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    reminder: {
      type: Boolean,
      default: true,
    },
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

interviewSchema.index({ user: 1, date: 1 });
interviewSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
