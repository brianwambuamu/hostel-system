// backend/models/Room.js
const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  hostelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hostel', 
    required: true 
  },
  roomNumber: { 
    type: String, 
    required: true,
    trim: true 
  },
  capacity: { 
    type: Number, 
    default: 4,
    min: 1
  },
  occupiedBeds: { 
    type: Number, 
    default: 0,
    min: 0
  }
}, { timestamps: true });

// CRITICAL INDEX: Ensures Room 101 cannot be created twice within the same Hostel block
RoomSchema.index({ hostelId: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('Room', RoomSchema);