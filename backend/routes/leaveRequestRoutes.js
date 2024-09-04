const express = require('express');
const { LeaveRequestController } = require('./controllers/LeaveRequestController');

const router = express.Router();

// Define the route
router.post('/api/leave-requests', LeaveRequestController);

module.exports = router;
