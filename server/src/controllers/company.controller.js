const Company = require('../models/Company');

// Helper to normalize live job object
const normalizeLiveJob = (job, source) => ({
  id: `${source}-${job.id || job.slug}`,
  position: job.title || 'Untitled Role',
  company: job.company_name || 'Unknown Company',
  location: job.candidate_required_location || job.location || 'Remote',
  remote: true,
  salary: job.salary || 'Competitive',
  url: job.url,
  tags: job.tags || [job.category].filter(Boolean),
  logo: job.company_logo || '',
  description: job.description ? job.description.replace(/<[^>]*>?/gm, '').substring(0, 200) + '...' : '',
  publishedDate: job.publication_date || (job.created_at ? new Date(job.created_at * 1000).toISOString() : new Date().toISOString()),
  source,
});

// @desc    Get all companies (saved + live hiring companies with open vacancies)
// @route   GET /api/companies
const getCompanies = async (req, res, next) => {
  try {
    const { search = '', filter = 'all', sort = 'name' } = req.query;

    // 1. Fetch user saved companies
    const savedCompanies = await Company.find({ user: req.user._id }).sort(sort);

    // 2. Fetch live job postings from external APIs
    const remotiveUrl = search
      ? `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(search)}`
      : 'https://remotive.com/api/remote-jobs?limit=50';

    const arbeitnowUrl = 'https://www.arbeitnow.com/api/job-board-api';

    const [remotiveRes, arbeitnowRes] = await Promise.allSettled([
      fetch(remotiveUrl).then((r) => r.json()),
      fetch(arbeitnowUrl).then((r) => r.json()),
    ]);

    let liveJobs = [];
    if (remotiveRes.status === 'fulfilled' && remotiveRes.value?.jobs) {
      liveJobs.push(...remotiveRes.value.jobs.map((j) => normalizeLiveJob(j, 'Remotive')));
    }
    if (arbeitnowRes.status === 'fulfilled' && arbeitnowRes.value?.data) {
      liveJobs.push(...arbeitnowRes.value.data.map((j) => normalizeLiveJob(j, 'Arbeitnow')));
    }

    // Group live jobs by company name (normalized lowercase)
    const companyJobsMap = new Map();
    liveJobs.forEach((job) => {
      if (!job.company) return;
      const key = job.company.trim().toLowerCase();
      if (!companyJobsMap.has(key)) {
        companyJobsMap.set(key, []);
      }
      companyJobsMap.get(key).push(job);
    });

    // 3. Build unified companies array
    const savedNameSet = new Set();
    const resultCompanies = [];

    // Add saved target companies
    savedCompanies.forEach((comp) => {
      const key = comp.name.trim().toLowerCase();
      savedNameSet.add(key);

      // Find matching live vacancies if any
      let vacancies = companyJobsMap.get(key) || [];
      if (vacancies.length === 0 && search) {
        // Partial match
        for (const [cKey, vList] of companyJobsMap.entries()) {
          if (cKey.includes(key) || key.includes(cKey)) {
            vacancies = vList;
            break;
          }
        }
      }

      resultCompanies.push({
        ...comp.toObject(),
        isSaved: true,
        liveVacancies: vacancies,
        totalVacancies: vacancies.length,
      });
    });

    // Add live hiring companies not already saved
    for (const [cKey, vacancies] of companyJobsMap.entries()) {
      if (vacancies.length === 0) continue;
      const sample = vacancies[0];
      const companyName = sample.company;

      // Skip if already in saved set
      if (savedNameSet.has(cKey)) continue;

      resultCompanies.push({
        _id: `live-${encodeURIComponent(companyName.toLowerCase())}`,
        name: companyName,
        industry: sample.tags[0] || 'Technology',
        location: sample.location || 'Remote',
        website: sample.url ? new URL(sample.url).origin : '',
        logo: sample.logo || '',
        notes: `Active hiring company with ${vacancies.length} live open vacancy role(s).`,
        rating: 5,
        isSaved: false,
        isLiveHiring: true,
        liveVacancies: vacancies,
        totalVacancies: vacancies.length,
      });
    }

    // 4. Apply search filtering if specified
    let filtered = resultCompanies;
    if (search) {
      const q = search.toLowerCase();
      filtered = resultCompanies.filter((c) => {
        const nameMatch = c.name.toLowerCase().includes(q);
        const industryMatch = c.industry && c.industry.toLowerCase().includes(q);
        const vacancyMatch = c.liveVacancies.some((v) =>
          v.position.toLowerCase().includes(q) || v.tags.some((t) => String(t).toLowerCase().includes(q))
        );
        return nameMatch || industryMatch || vacancyMatch;
      });
    }

    // 5. Apply tab filter if specified
    if (filter === 'saved') {
      filtered = filtered.filter((c) => c.isSaved);
    } else if (filter === 'hiring') {
      filtered = filtered.filter((c) => c.totalVacancies > 0);
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
const getCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found',
      });
    }

    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

// @desc    Create company
// @route   POST /api/companies
const createCompany = async (req, res, next) => {
  try {
    req.body.user = req.user._id;
    const company = await Company.create(req.body);

    res.status(201).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found',
      });
    }

    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found',
      });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCompanies, getCompany, createCompany, updateCompany, deleteCompany };
