const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');

// Route to send consultation email
router.post('/send_consultation', consultationController.sendConsultation);

module.exports = router;