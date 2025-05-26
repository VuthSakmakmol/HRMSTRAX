// models/userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  role: {
    type: String,
    enum: ['GeneralManager', 'Manager', 'HR', 'HROfficer'],
    default: 'HROfficer',
    required: true,
  },

  company: {
    type: String,
    required: true,
    enum: [
      'TH-ROI',
      'TH-CYP',
      'VN-A1A',
      'VN-TRANS',
      'CAM-TAC'
    ]
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  }

}, {
  timestamps: true,
});

// 🔐 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
