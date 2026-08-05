const express = require('express');
const { body } = require('express-validator');
const {
  getInterviews,
  getUpcomingInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview,
} = require('../controllers/interview.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/upcoming', getUpcomingInterviews);
router.get('/', getInterviews);
router.get('/:id', getInterview);

router.post(
  '/',
  validate([
    body('job').notEmpty().withMessage('Job reference is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
  ]),
  createInterview
);

router.put('/:id', updateInterview);
router.delete('/:id', deleteInterview);

module.exports = router;
