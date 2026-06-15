 // backend/models/Hostel.js
const mongoose = require('mongoose');

const HostelSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Hostel block identifier name is required'], 
    unique: true,
    trim: true 
  },
  gender: { 
    type: String, 
    enum: {
      values: ['Male', 'Female'],
      message: 'Gender alignment must be specified as either Male or Female'
    },
    required: true 
  },
  totalCapacity: { 
    type: Number, 
    required: true,
    min: [1, 'Hostel capacity must be at least 1']
  }
}, { timestamps: true });

module.exports = mongoose.model('Hostel', HostelSchema);