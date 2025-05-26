// seeders/GeneralManagerSeeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');

dotenv.config();

const seedGeneralManager = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const gmExists = await User.findOne({ email: 'gm@company.com' });

    if (gmExists) {
      console.log('⚠️ General Manager already exists');
      process.exit();
    }

    const gm = new User({
      fullName: 'General Manager',
      email: 'gm@company.com',
      password: 'Password123!', // will be hashed automatically
      role: 'GeneralManager',
      company: 'CAM-TAC',
      createdBy: null,
    });

    await gm.save();
    console.log('✅ General Manager seeded successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Seeder Error:', err);
    process.exit(1);
  }
};

seedGeneralManager();
