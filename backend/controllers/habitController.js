const Habit = require('../models/Habit');
const HabitRecord = require('../models/HabitRecord');
const User = require('../models/User');

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// @desc    Get user habits with today's status
// @route   GET /api/habits
const getHabits = async (req, res) => {
  try {
    const today = getTodayDateString();
    const habits = await Habit.find({ userId: req.user._id, active: true }).sort({ createdAt: -1 });

    // Fetch records for today
    const habitIds = habits.map(h => h._id);
    const todayRecords = await HabitRecord.find({
      userId: req.user._id,
      habitId: { $in: habitIds },
      date: today,
      completed: true
    });

    const completedHabitMap = new Set(todayRecords.map(r => r.habitId.toString()));

    const habitsWithStatus = habits.map(h => ({
      ...h.toObject(),
      completedToday: completedHabitMap.has(h._id.toString())
    }));

    res.json(habitsWithStatus);
  } catch (error) {
    console.error('GetHabits error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

// @desc    Create a new habit
// @route   POST /api/habits
const createHabit = async (req, res) => {
  try {
    const { name, description, frequency, target, startDate } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Please enter a habit name.' });
    }

    const newHabit = await Habit.create({
      userId: req.user._id,
      name: name.trim(),
      description: description ? description.trim() : '',
      frequency: frequency || 'Daily',
      target: target || '1 time per day',
      startDate: startDate || getTodayDateString()
    });

    res.status(201).json(newHabit);
  } catch (error) {
    console.error('CreateHabit error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

// @desc    Update a habit
// @route   PUT /api/habits/:id
const updateHabit = async (req, res) => {
  try {
    const { name, description, frequency, target } = req.body;

    let habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found.' });
    }

    if (habit.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to edit this habit.' });
    }

    if (name && !name.trim()) {
      return res.status(400).json({ message: 'Please enter a habit name.' });
    }

    habit.name = name ? name.trim() : habit.name;
    habit.description = description !== undefined ? description.trim() : habit.description;
    habit.frequency = frequency || habit.frequency;
    habit.target = target || habit.target;

    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (error) {
    console.error('UpdateHabit error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

// @desc    Delete (deactivate) a habit
// @route   DELETE /api/habits/:id
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found.' });
    }

    if (habit.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this habit.' });
    }

    habit.active = false;
    await habit.save();

    res.json({ message: 'Habit deleted successfully.' });
  } catch (error) {
    console.error('DeleteHabit error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

// @desc    Complete a habit for today (+10 Points & Streak logic)
// @route   POST /api/habits/:id/complete
const completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit || !habit.active) {
      return res.status(404).json({ message: 'Habit not found.' });
    }

    if (habit.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized.' });
    }

    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    // Check if user already completed this habit today
    const existingRecord = await HabitRecord.findOne({
      habitId: habit._id,
      date: today
    });

    if (existingRecord) {
      return res.status(400).json({ message: 'You already completed this habit today.' });
    }

    // Create habit completion record
    await HabitRecord.create({
      userId: req.user._id,
      habitId: habit._id,
      date: today,
      completed: true
    });

    // Update user points and streak
    const user = await User.findById(req.user._id);

    user.points += 10; // 1 completed habit = 10 points

    // Streak logic
    if (user.lastCompletedDate === today) {
      // User already logged another habit today, streak remains unchanged
    } else if (user.lastCompletedDate === yesterday) {
      // User completed a habit yesterday and now today -> increment streak
      user.currentStreak += 1;
      user.lastCompletedDate = today;
    } else {
      // Missed yesterday or new streak -> reset streak to 1
      user.currentStreak = 1;
      user.lastCompletedDate = today;
    }

    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }

    await user.save();

    res.json({
      message: 'Great job! Habit completed! (+10 pts)',
      points: user.points,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      habitId: habit._id,
      completedToday: true
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You already completed this habit today.' });
    }
    console.error('CompleteHabit error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

// @desc    Get completion history for user
// @route   GET /api/habits/history
const getHabitHistory = async (req, res) => {
  try {
    const records = await HabitRecord.find({ userId: req.user._id })
      .populate('habitId', 'name')
      .sort({ completedAt: -1 })
      .limit(30);

    res.json(records);
  } catch (error) {
    console.error('GetHabitHistory error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

module.exports = {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
  getHabitHistory
};
