const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
    },
    type: {
      type: String,
      enum: ['General', 'Interview Prep', 'Follow-up', 'Research', 'Feedback'],
      default: 'General',
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

noteSchema.index({ job: 1, user: 1 });

module.exports = mongoose.model('Note', noteSchema);
