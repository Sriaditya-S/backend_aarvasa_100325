const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateRequiredFields } = require('../middleware/validationMiddleware');

// Route for user signup with validation middleware
router.post('/signup', validateRequiredFields(['email', 'password', 'fullName']), userController.signup);

module.exports = router;