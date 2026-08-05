const Job = require('../models/Job');
const path = require('path');
const fs = require('fs');

// @desc    Get all jobs for user (with search, filter, sort, pagination)
// @route   GET /api/jobs
const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      status,
      type,
      sort = '-createdAt',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { user: req.user._id };

    // Search
    if (search) {
      query.$or = [
        { position: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by type
    if (type && type !== 'All') {
      query.type = type;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(query).sort(sort).skip(skip).limit(limitNum),
      Job.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
const getJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job
// @route   POST /api/jobs
const createJob = async (req, res, next) => {
  try {
    req.body.user = req.user._id;
    const job = await Job.create(req.body);

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    // Delete resume file if exists
    if (job.resume) {
      const resumePath = path.join(__dirname, '../../uploads/resumes', job.resume);
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume for job
// @route   POST /api/jobs/:id/resume
const uploadResume = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file',
      });
    }

    // Delete old resume if exists
    if (job.resume) {
      const oldPath = path.join(__dirname, '../../uploads/resumes', job.resume);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    job.resume = req.file.filename;
    await job.save();

    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job stats for dashboard
// @route   GET /api/jobs/stats
const getJobStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [statusCounts, typeCounts, monthlyApplications, recentJobs] = await Promise.all([
      // Count by status
      Job.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      // Count by type
      Job.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      // Monthly applications (last 6 months)
      Job.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: {
              year: { $year: '$appliedDate' },
              month: { $month: '$appliedDate' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 },
      ]),
      // Recent jobs
      Job.find({ user: userId }).sort('-createdAt').limit(5),
    ]);

    const total = statusCounts.reduce((acc, curr) => acc + curr.count, 0);
    const statusMap = {};
    statusCounts.forEach((s) => {
      statusMap[s._id] = s.count;
    });

    res.json({
      success: true,
      data: {
        total,
        statusCounts: statusMap,
        typeCounts: typeCounts.reduce((acc, t) => {
          acc[t._id] = t.count;
          return acc;
        }, {}),
        monthlyApplications: monthlyApplications.reverse(),
        recentJobs,
        responseRate: total > 0
          ? Math.round(((statusMap['Interview'] || 0) + (statusMap['Offer'] || 0)) / total * 100)
          : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  uploadResume,
  getJobStats,
};
