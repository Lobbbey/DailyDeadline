const express = require('express');
const router = express.Router();

// Import controller funciton
const {createTask, getTasks} = require('../controllers/userController');

const {protect} = require('../middleware/authMiddleware');
router.use(protect);

// @route POST /api/task
// @desc Create a task for the user
// @access Private
router.post('/', createTask);

// @route GET /api/tasks
// @desc Get all tasks for user
// @access Private
router.get('/', getTasks);

module.exports = router;