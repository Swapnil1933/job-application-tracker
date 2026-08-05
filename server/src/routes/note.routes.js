const express = require('express');
const { body } = require('express-validator');
const {
  getNotesByJob,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/note.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/job/:jobId', getNotesByJob);

router.post(
  '/',
  validate([
    body('job').notEmpty().withMessage('Job reference is required'),
    body('content').trim().notEmpty().withMessage('Note content is required'),
  ]),
  createNote
);

router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
