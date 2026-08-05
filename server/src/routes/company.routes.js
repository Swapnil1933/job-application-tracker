const express = require('express');
const { body } = require('express-validator');
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} = require('../controllers/company.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getCompanies);
router.get('/:id', getCompany);

router.post(
  '/',
  validate([
    body('name').trim().notEmpty().withMessage('Company name is required'),
  ]),
  createCompany
);

router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

module.exports = router;
