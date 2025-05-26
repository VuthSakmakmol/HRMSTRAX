// controllers/authController.js

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// 🔐 Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      role: user.role,
      company: user.company,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// 🔐 Login Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      company: user.company,
      token: generateToken(user),
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// 👤 Get Logged-In User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

module.exports = {
  loginUser,
  getUserProfile,
};
