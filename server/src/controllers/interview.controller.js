const Interview = require('../models/Interview');

// @desc    Get all interviews
// @route   GET /api/interviews
const getInterviews = async (req, res, next) => {
  try {
    const { status, sort = '-date' } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    const interviews = await Interview.find(query)
      .populate('job', 'position company status')
      .sort(sort);

    res.json({ success: true, data: interviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming interviews
// @route   GET /api/interviews/upcoming
const getUpcomingInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({
      user: req.user._id,
      status: 'Scheduled',
      date: { $gte: new Date() },
    })
      .populate('job', 'position company status')
      .sort('date')
      .limit(5);

    res.json({ success: true, data: interviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single interview
// @route   GET /api/interviews/:id
const getInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('job', 'position company status');

    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found',
      });
    }

    res.json({ success: true, data: interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Create interview
// @route   POST /api/interviews
const createInterview = async (req, res, next) => {
  try {
    req.body.user = req.user._id;
    const interview = await Interview.create(req.body);
    const populated = await interview.populate('job', 'position company status');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
const updateInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('job', 'position company status');

    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found',
      });
    }

    res.json({ success: true, data: interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
const deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found',
      });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInterviews,
  getUpcomingInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview,
};
