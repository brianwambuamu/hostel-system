// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { exportEmergencyRoster } = require('../controllers/reportController');

// @route   GET /api/reports/emergency-manifest
// @desc    Streams a real-time CSV file download matching physical check-ins
// @access  Protected (Warden/Admin)
router.get('/emergency-manifest', exportEmergencyRoster);

module.exports = router;