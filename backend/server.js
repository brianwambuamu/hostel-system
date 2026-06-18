// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
require('./workers/releaseWorker'); // Initialize cron jobs

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/transfers', require('./routes/transferRoutes'));
app.use('/api/reports', require('./routes/reportRoutes')); // Fixed targeting folder reference
// DB Connection
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 System running on port ${PORT}`);
});