const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please enter a habit name'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Weekdays'],
    default: 'Daily'
  },
  target: {
    type: String,
    default: '1 time per day'
  },
  startDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Habit', habitSchema);
