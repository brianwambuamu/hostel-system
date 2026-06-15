// backend/routes/transferRoutes.js
const express = require('express');
const router = express.Router();
const { requestTransfer, approveTransfer } = require('../controllers/transferController');

// @route   POST /api/transfers/request
// @desc    Submit an official audited room swap application
// @access  Protected (Student)
router.post('/request', requestTransfer);

// @route   PUT /api/transfers/approve/:requestId
// @desc    Warden sign-off execution to change room allocation configurations
// @access  Protected (Warden/Admin)
router.put('/approve/:requestId', approveTransfer);

module.exports = router;