const express = require('express');
const taskController = require('../controllers/taskController');
const router = express.Router();

// Create a new task
router.post('/create', taskController.create_task);

// Get all tasks
router.get('/', taskController.get_all_tasks);

// Get a specific task by ID
router.get('/:id', taskController.get_task);

// Delete a task by ID
router.delete('/:id', taskController.delete_task);

router.patch('/:id', taskController.update_task);

router.get('/user/:username', taskController.get_task_by_username)


module.exports = router;
