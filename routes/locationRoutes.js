const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Route to get all states
router.get('/states', locationController.getStates);

// Route to get cities of a state
router.get('/cities/:stateCode', locationController.getCities);

module.exports = router;