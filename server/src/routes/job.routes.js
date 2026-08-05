const express = require('express');
const { body } = require('express-validator');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  uploadResume,
  getJobStats,
} = require('../controllers/job.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const upload = require('../middleware/upload');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Stats route (must be before /:id to avoid conflict)
router.get('/stats', getJobStats);

router.get('/', getJobs);
router.get('/:id', getJob);

router.post(
  '/',
  validate([
    body('company').trim().notEmpty().withMessage('Company is required'),
    body('position').trim().notEmpty().withMessage('Position is required'),
  ]),
  createJob
);

router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

// Resume upload
router.post('/:id/resume', upload.single('resume'), uploadResume);

module.exports = router;
