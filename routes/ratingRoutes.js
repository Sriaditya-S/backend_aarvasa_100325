const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

// Route to rate a property
router.post('/rate_property', ratingController.rateProperty);

module.exports = router;