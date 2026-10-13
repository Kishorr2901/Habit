const User = require('../models/User');

// @desc    Update user profile (e.g. name)
// @route   PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Please enter a valid name.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.name = name.trim();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      points: user.points,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

module.exports = {
  updateProfile
};
