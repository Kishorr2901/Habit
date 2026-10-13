const HabitRecord = require('../models/HabitRecord');
const User = require('../models/User');

// @desc    Get user achievements and unlocked status
// @route   GET /api/achievements
const getAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const totalCompleted = await HabitRecord.countDocuments({ userId: req.user._id, completed: true });

    const maxStreak = Math.max(user.currentStreak || 0, user.longestStreak || 0);

    const achievementsList = [
      {
        id: 'first_step',
        title: 'First Step',
        icon: '🌱',
        description: 'Complete your first habit.',
        unlocked: totalCompleted >= 1,
        progressText: `${Math.min(totalCompleted, 1)} / 1 habit completed`
      },
      {
        id: 'streak_7',
        title: '7 Day Streak',
        icon: '🔥',
        description: 'Maintain a 7-day streak.',
        unlocked: maxStreak >= 7,
        progressText: `${Math.min(maxStreak, 7)} / 7 days streak`
      },
      {
        id: 'growing_25',
        title: 'Growing',
        icon: '🌿',
        description: 'Complete 25 habits.',
        unlocked: totalCompleted >= 25,
        progressText: `${Math.min(totalCompleted, 25)} / 25 habits completed`
      },
      {
        id: 'consistent_50',
        title: 'Consistent',
        icon: '🌳',
        description: 'Complete 50 habits.',
        unlocked: totalCompleted >= 50,
        progressText: `${Math.min(totalCompleted, 50)} / 50 habits completed`
      },
      {
        id: 'master_100',
        title: 'Habit Master',
        icon: '🌸',
        description: 'Complete 100 habits.',
        unlocked: totalCompleted >= 100,
        progressText: `${Math.min(totalCompleted, 100)} / 100 habits completed`
      }
    ];

    res.json({
      totalUnlocked: achievementsList.filter(a => a.unlocked).length,
      totalCount: achievementsList.length,
      achievements: achievementsList
    });
  } catch (error) {
    console.error('GetAchievements error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

module.exports = {
  getAchievements
};
