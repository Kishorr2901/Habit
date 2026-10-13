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

const getGardenStage = (points) => {
  if (points >= 300) {
    return { level: 4, name: 'Mature Garden', icon: '🌸', nextMilestone: null, pointsNeeded: 0 };
  } else if (points >= 150) {
    return { level: 3, name: 'Growing Plant', icon: '🌳', nextMilestone: 'Mature Garden', pointsNeeded: 300 - points };
  } else if (points >= 50) {
    return { level: 2, name: 'Small Plant', icon: '🌿', nextMilestone: 'Growing Plant', pointsNeeded: 150 - points };
  } else {
    return { level: 1, name: 'Seed', icon: '🌱', nextMilestone: 'Small Plant', pointsNeeded: 50 - points };
  }
};

// @desc    Get dashboard metrics & today's habits
// @route   GET /api/dashboard
const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const today = getTodayDateString();

    const habits = await Habit.find({ userId: req.user._id, active: true }).sort({ createdAt: -1 });
    const habitIds = habits.map(h => h._id);

    const todayRecords = await HabitRecord.find({
      userId: req.user._id,
      habitId: { $in: habitIds },
      date: today,
      completed: true
    });

    const completedSet = new Set(todayRecords.map(r => r.habitId.toString()));

    const habitsWithStatus = habits.map(h => ({
      ...h.toObject(),
      completedToday: completedSet.has(h._id.toString())
    }));

    const totalActive = habits.length;
    const completedTodayCount = todayRecords.length;
    const completionPercentage = totalActive > 0 ? Math.round((completedTodayCount / totalActive) * 100) : 0;

    const gardenStage = getGardenStage(user.points);

    res.json({
      user: {
        name: user.name,
        email: user.email,
        points: user.points,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak
      },
      stats: {
        totalActive,
        completedTodayCount,
        completionPercentage,
        currentStreak: user.currentStreak,
        points: user.points
      },
      gardenStage,
      todayHabits: habitsWithStatus
    });
  } catch (error) {
    console.error('GetDashboardData error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

module.exports = {
  getDashboardData
};
