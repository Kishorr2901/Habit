const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/habitgarden';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HabitGarden API is running.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`HabitGarden server running on port ${PORT}`);
});
