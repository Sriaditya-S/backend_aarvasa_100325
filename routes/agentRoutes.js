const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

// Route to add an agent
router.post('/add_agents', agentController.addAgent);

// Route to fetch all agents(updated to use GET)
router.post('/all', agentController.getAllAgents);

module.exports = router;