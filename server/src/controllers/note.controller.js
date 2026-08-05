const Note = require('../models/Note');

// @desc    Get notes for a job
// @route   GET /api/notes/job/:jobId
const getNotesByJob = async (req, res, next) => {
  try {
    const notes = await Note.find({
      job: req.params.jobId,
      user: req.user._id,
    }).sort('-createdAt');

    res.json({ success: true, data: notes });
  } catch (error) {
    next(error);
  }
};

// @desc    Create note
// @route   POST /api/notes
const createNote = async (req, res, next) => {
  try {
    req.body.user = req.user._id;
    const note = await Note.create(req.body);

    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
      });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotesByJob, createNote, updateNote, deleteNote };
