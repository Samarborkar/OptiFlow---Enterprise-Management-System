const Task = require('../models/Task');
const User = require('../models/User');

// Create a new task - only admin can create a task
module.exports.create_task = async (req, res) => {
  try {
    const { username, taskTitle, taskDetails, assigneeUsernames, taskDeadline } = req.body;

    // Find the user who is creating the task
    const creator = await User.findOne({ username });
    if (!creator) {
      return res.status(404).json({ message: 'Creator user not found' });
    }

    // Find users by their usernames and extract their IDs
    const assignedUsers = await Promise.all(
      assigneeUsernames.map(async (username) => {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error(`User with username ${username} not found`);
        }
        return { userId: user._id, assigneeUsername: user.username };
      })
    );

    // Create a new task
    const newTask = new Task({
      creatorId: creator._id,
      creatorUsername: creator.username,
      taskTitle,
      taskDetails,
      assignedUsers,
      assigneeUsernames,
      taskDeadline,
    });

    // Save the task
    await newTask.save();

    // Update each assigned user's task list
    await Promise.all(
      assignedUsers.map(async ({ userId }) => {
        const user = await User.findById(userId);
        user.assignedTasks.push(newTask._id);
        await user.save();
      })
    );

    creator.createdTasks.push(newTask._id); // Add to the creator's created task list
    await creator.save();

    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

  
  module.exports.get_task_by_username = async (req, res) => {
    try {
      const { username } = req.params; // Assuming username is passed in the request params
  
      // Find the user by username
      console.log(username)
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found'  
   });
      }
  
      // Get the task IDs from the user's assignedTasks array
      const assignedTaskIds = user.assignedTasks.map((taskId) => taskId.toString()); // Convert ObjectIds to strings
  
      // Find all tasks matching the assigned task IDs
      const tasks = await Task.find({ _id: { $in: assignedTaskIds } });
  
      res.status(200).json({ message: 'Tasks retrieved successfully', tasks });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
// Get all tasks
module.exports.get_all_tasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedUsers.userId', 'username');
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get an individual task by ID
module.exports.get_task = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate('assignedUsers.userId', 'username');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task by ID
// module.exports.delete_task = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const task = await Task.findByIdAndDelete(id);
//     console.log(task);
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     // Remove the task from users' assigned task lists
//     task.assignedUsers.forEach(async ({ userId }) => {
//       const user = await User.findById(userId);
//       user.assignedTasks = user.assignedTasks.filter(taskId => taskId.toString() !== id);
//       await user.save();
//     });

//     // Remove from the creator's created task list
//     const creator = await User.findById(task.creatorId);
//     creator.createdTasks = creator.createdTasks.filter(taskId => taskId.toString() !== id);
//     await creator.save();

//     res.status(200).json({ message: 'Task deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

module.exports.update_task = async (req, res) => {
  try {
    const { id } = req.params;
    const  taskId=id;
    const { taskTitle, taskDetails, assigneeUsernames, taskDeadline } = req.body;

    // Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task details
    task.taskTitle = taskTitle;
    task.taskDetails = taskDetails;
    task.taskDeadline = taskDeadline;

    // Find new users by their usernames and extract their IDs
    const newAssignedUsers = await Promise.all(
      assigneeUsernames.map(async (username) => {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error(`User with username ${username} not found`);
        }
        return { userId: user._id, assigneeUsername: user.username };
      })
    );

    // Update the assigned users list
    const oldAssignedUsers = task.assignedUsers;
    task.assignedUsers = newAssignedUsers;
    task.assigneeUsernames = assigneeUsernames;

    // Save the updated task
    await task.save();

    // Remove task from old assigned users' assignedTasks list
    await Promise.all(
      oldAssignedUsers.map(async ({ userId }) => {
        const user = await User.findById(userId);
        if (user) {
          user.assignedTasks = user.assignedTasks.filter(id => id.toString() !== taskId);
          await user.save();
        }
      })
    );

    // Add task to new assigned users' assignedTasks list
    await Promise.all(
      newAssignedUsers.map(async ({ userId }) => {
        const user = await User.findById(userId);
        if (!user.assignedTasks.includes(taskId)) {
          user.assignedTasks.push(taskId);
          await user.save();
        }
      })
    );

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports.delete_task = async (req, res) => {
  try {
    const { id } = req.params;
    const taskId=id;
    console.log(taskId);
    
    // Find the task by ID
    const task = await Task.findById(taskId);
    console.log(task)
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Remove the task from the creator's createdTasks list
    const creator = await User.findOne({ username: task.creatorUsername });
    console.log(creator);
    
    if (creator) {
      creator.createdTasks = creator.createdTasks.filter(id => id.toString() !== taskId);
      await creator.save();
    }

    // Remove the task from each assigned user's assignedTasks list
    const assignedUsers = task.assignedUsers;
    await Promise.all(
      assignedUsers.map(async ({ userId }) => {
        const user = await User.findById(userId);
        if (user) {
          user.assignedTasks = user.assignedTasks.filter(id => id.toString() !== taskId);
          await user.save();
        }
      })
    );

    // Delete the task from the database
    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

