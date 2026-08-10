const express = require('express');
const { searchLiveJobs, importLiveJob } = require('../controllers/externalJob.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', searchLiveJobs);
router.post('/import', importLiveJob);

module.exports = router;
