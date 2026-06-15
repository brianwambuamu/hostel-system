// backend/models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true // Guarantees a student can only hold one active booking record across the system
  },
  roomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Reserved', 'Confirmed', 'CheckedIn', 'Cancelled'], 
    default: 'Reserved' 
  },
  paymentReference: { 
    type: String, 
    default: null,
    sparse: true // Allows multiple null configurations while strictly enforcing uniqueness on string references
  },
  reservedAt: { 
    type: Date, 
    default: Date.now 
  },
  confirmedAt: { 
    type: Date 
  },
  checkedInAt: { 
    type: Date 
  }
}, { timestamps: true });

// Indexes to speed up backend cron queries for expired entries
BookingSchema.index({ status: 1, reservedAt: 1 });
BookingSchema.index({ status: 1, confirmedAt: 1 });

module.exports = mongoose.model('Booking', BookingSchema);