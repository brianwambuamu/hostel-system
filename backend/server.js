// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// ... your other imports (mongoose, redis, etc.)

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ─── AUTHENTICATION ROUTE MOUNTING ─────────────────────────────────
// This links http://localhost:5000/api/auth/* to your auth routes file
app.use('/api/auth', require('./routes/authRoutes'));
// ───────────────────────────────────────────────────────────────────

// Your other routes
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/transfers', require('./routes/transferRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 System running on port ${PORT}`));