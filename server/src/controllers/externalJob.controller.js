const Job = require('../models/Job');
const Company = require('../models/Company');

// Normalize Remotive API job
const normalizeRemotiveJob = (job) => ({
  id: `remotive-${job.id}`,
  company: job.company_name || 'Unknown Company',
  position: job.title || 'Untitled Role',
  location: job.candidate_required_location || 'Worldwide',
  remote: true,
  salary: job.salary || 'Competitive',
  url: job.url,
  tags: job.tags || [job.category].filter(Boolean),
  logo: job.company_logo || '',
  description: job.description ? job.description.replace(/<[^>]*>?/gm, '').substring(0, 250) + '...' : '',
  publishedDate: job.publication_date || new Date().toISOString(),
  source: 'Remotive',
});

// Normalize Arbeitnow API job
const normalizeArbeitnowJob = (job) => ({
  id: `arbeitnow-${job.slug}`,
  company: job.company_name || 'Unknown Company',
  position: job.title || 'Untitled Role',
  location: job.location || 'Remote',
  remote: job.remote || false,
  salary: 'Competitive',
  url: job.url,
  tags: job.tags || [],
  logo: '',
  description: job.description ? job.description.replace(/<[^>]*>?/gm, '').substring(0, 250) + '...' : '',
  publishedDate: job.created_at ? new Date(job.created_at * 1000).toISOString() : new Date().toISOString(),
  source: 'Arbeitnow',
});

// @desc    Search live external company jobs
// @route   GET /api/external-jobs
const searchLiveJobs = async (req, res, next) => {
  try {
    const { search = '', category = '' } = req.query;

    const remotiveUrl = search
      ? `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(search)}`
      : 'https://remotive.com/api/remote-jobs?limit=25';

    const arbeitnowUrl = 'https://www.arbeitnow.com/api/job-board-api';

    const [remotiveRes, arbeitnowRes] = await Promise.allSettled([
      fetch(remotiveUrl).then((r) => r.json()),
      fetch(arbeitnowUrl).then((r) => r.json()),
    ]);

    let combinedJobs = [];

    if (remotiveRes.status === 'fulfilled' && remotiveRes.value?.jobs) {
      combinedJobs.push(...remotiveRes.value.jobs.map(normalizeRemotiveJob));
    }

    if (arbeitnowRes.status === 'fulfilled' && arbeitnowRes.value?.data) {
      combinedJobs.push(...arbeitnowRes.value.data.map(normalizeArbeitnowJob));
    }

    // Filter by search query if needed
    if (search) {
      const q = search.toLowerCase();
      combinedJobs = combinedJobs.filter(
        (j) =>
          j.position.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.tags.some((t) => String(t).toLowerCase().includes(q))
      );
    }

    // Filter by category if needed
    if (category && category !== 'All') {
      const cat = category.toLowerCase();
      combinedJobs = combinedJobs.filter(
        (j) =>
          j.position.toLowerCase().includes(cat) ||
          j.tags.some((t) => String(t).toLowerCase().includes(cat))
      );
    }

    // Check which jobs user has already imported
    const userJobUrls = await Job.find({ user: req.user._id }).select('url position company');
    const importedUrlSet = new Set(userJobUrls.map((j) => j.url));
    const importedTitleSet = new Set(userJobUrls.map((j) => `${j.company.toLowerCase()}-${j.position.toLowerCase()}`));

    const annotatedJobs = combinedJobs.map((job) => ({
      ...job,
      isImported: importedUrlSet.has(job.url) || importedTitleSet.has(`${job.company.toLowerCase()}-${job.position.toLowerCase()}`),
    }));

    res.json({
      success: true,
      count: annotatedJobs.length,
      data: annotatedJobs.slice(0, 40),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import live company job directly into application tracker
// @route   POST /api/external-jobs/import
const importLiveJob = async (req, res, next) => {
  try {
    const { company, position, location, remote, salary, url, tags, notes, status = 'Applied' } = req.body;

    if (!company || !position) {
      return res.status(400).json({
        success: false,
        error: 'Company and position are required for import',
      });
    }

    // Check if already imported
    const existingJob = await Job.findOne({
      user: req.user._id,
      $or: [{ url: url }, { company, position }],
    });

    if (existingJob) {
      return res.status(400).json({
        success: false,
        error: 'This job application is already in your tracker!',
      });
    }

    // Ensure company exists or create new Company profile
    let companyDoc = await Company.findOne({
      user: req.user._id,
      name: { $regex: new RegExp(`^${company}$`, 'i') },
    });

    if (!companyDoc) {
      companyDoc = await Company.create({
        user: req.user._id,
        name: company,
        location: location || 'Remote',
        website: url ? new URL(url).origin : '',
        industry: tags && tags[0] ? tags[0] : 'Technology',
        notes: `Automatically created from live job application import (${position}).`,
      });
    }

    // Create job application
    const job = await Job.create({
      user: req.user._id,
      company: companyDoc.name,
      position,
      location: location || 'Remote',
      remote: Boolean(remote),
      salary: salary || 'Not specified',
      url: url || '',
      tags: Array.isArray(tags) ? tags : [],
      status,
      appliedDate: new Date(),
      notes: notes || `Imported live job posting from ${url || company}`,
    });

    res.status(201).json({
      success: true,
      data: job,
      message: `Successfully imported ${position} at ${company} into your tracker!`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchLiveJobs,
  importLiveJob,
};
