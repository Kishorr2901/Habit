const HabitRecord = require('../models/HabitRecord');
const User = require('../models/User');

// Helper to format date YYYY-MM-DD
const formatDate = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to get day name (Mon, Tue, etc.)
const getDayLabel = (dateObj) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dateObj.getDay()];
};

// @desc    Get progress statistics & weekly completion history
// @route   GET /api/progress
const getProgressData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const totalCompleted = await HabitRecord.countDocuments({ userId: req.user._id, completed: true });

    // Calculate last 7 days chart data
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      const label = getDayLabel(d);

      const count = await HabitRecord.countDocuments({
        userId: req.user._id,
        date: dateStr,
        completed: true
      });

      last7Days.push({
        date: dateStr,
        day: label,
        completedCount: count
      });
    }

    // Monthly completed count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = formatDate(thirtyDaysAgo);

    const monthlyCompleted = await HabitRecord.countDocuments({
      userId: req.user._id,
      date: { $gte: thirtyDaysAgoStr },
      completed: true
    });

    // Recent completion history logs
    const history = await HabitRecord.find({ userId: req.user._id })
      .populate('habitId', 'name')
      .sort({ completedAt: -1 })
      .limit(15);

    res.json({
      stats: {
        totalCompleted,
        monthlyCompleted,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        totalPoints: user.points
      },
      weeklyChartData: last7Days,
      recentHistory: history
    });
  } catch (error) {
    console.error('GetProgressData error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

module.exports = {
  getProgressData
};
