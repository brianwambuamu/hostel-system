// backend/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const { reserveRoom, verifyPayment } = require('../controllers/bookingController');

// @route   POST /api/bookings/reserve
// @desc    Lock a room bed in Redis cache for 30 minutes
// @access  Protected (Student)
router.post('/reserve', reserveRoom);

// @route   POST /api/bookings/verify-payment
// @desc    Validate incoming M-Pesa transaction token code and commit to MongoDB
// @access  Protected (Student)
router.post('/verify-payment', verifyPayment);

module.exports = router;