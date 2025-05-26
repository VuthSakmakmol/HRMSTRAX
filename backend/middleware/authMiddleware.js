// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// 🔐 Verify token
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token failed or expired' });
  }
};

// 🧑‍⚖️ Role check middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
};

module.exports = {
  protect,
  authorizeRoles,
};
