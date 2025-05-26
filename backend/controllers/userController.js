// controllers/userController.js

const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// ➕ Create user (by GM)
const createUser = async (req, res) => {
  const { fullName, email, password, role, company } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });

    const newUser = new User({
      fullName,
      email,
      password,
      role,
      company,
      createdBy: req.user._id,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      _id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      role: savedUser.role,
      company: savedUser.company,
    });

  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 📄 Get all users (by GM)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 🖊️ Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, password, role, company } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.role = role || user.role;
    user.company = company || user.company;

    // If password is changed, rehash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updated = await user.save();
    res.status(200).json({ message: 'User updated', user: updated });

  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// ❌ Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.remove();
    res.status(200).json({ message: 'User deleted' });

  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
