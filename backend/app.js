const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // ⚠️ this is required for JSON parsing

// ✅ THIS IS MISSING IN YOUR SETUP
app.use('/api/auth', require('./routes/authRoutes'));


const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Fallback route for 404
app.use((req, res) => {
  res.status(404).json({ message: '🔍 API route not found' });
});

const PORT = process.env.PORT || 4700;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
