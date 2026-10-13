const mongoose = require('mongoose');

const habitRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index to prevent duplicate completion on the same date
habitRecordSchema.index({ habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitRecord', habitRecordSchema);
