// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  regNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true,
    trim: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  role: { 
    type: String, 
    enum: ['Student', 'Warden', 'Admin'], 
    default: 'Student' 
  },
  gender: { 
    type: String, 
    enum: ['Male', 'Female'], 
    required: true 
  },
  phoneNumber: { 
    type: String, 
    required: true,
    trim: true // Crucial formatting target for automated SMS triggers
  },
  password: { 
    type: String, 
    required: true // Stored as a secure bcrypt hash string
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);