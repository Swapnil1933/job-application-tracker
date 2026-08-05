const Company = require('../models/Company');

// @desc    Get all companies for user
// @route   GET /api/companies
const getCompanies = async (req, res, next) => {
  try {
    const { search, sort = 'name' } = req.query;
    const query = { user: req.user._id };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const companies = await Company.find(query).sort(sort);

    res.json({ success: true, data: companies });
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
