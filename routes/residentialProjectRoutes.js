const express = require('express');
const router = express.Router();
const residentialProjectController = require('../controllers/residentialProjectController');

// Route to post a residential project
router.post('/post', residentialProjectController.postResidentialProject);

// Route to fetch all residential projects
router.post('/all', residentialProjectController.getAllResidentialProjects);

// Route to filter residential projects
router.post('/filter', residentialProjectController.filterResidentialProjects);

// Route to filter residential projects by map
router.post('/filter_map', residentialProjectController.filterMapResidentialProjects);

module.exports = router;