const express = require('express');
const router = express.Router();
const {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
  getHabitHistory
} = require('../controllers/habitController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getHabits);
router.post('/', createHabit);
router.put('/:id', updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/complete', completeHabit);
router.get('/history', getHabitHistory);

module.exports = router;
