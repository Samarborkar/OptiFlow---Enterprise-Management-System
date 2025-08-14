const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  // creatorId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',  // Reference to the User model
  //   required: true
  // },
  creatorUsername: {
    type: String,
    required: true
  },
  taskTitle: {
    type: String,
    required: [true, 'Task title is required'],
    minlength: [3, 'Minimum title length is 3 characters'],
    maxlength: [100, 'Maximum title length is 100 characters']
  },
  taskDetails: {
    type: String,
    required: [true, 'Task details are required']
  },
  assignedUsers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      //ref: 'User',  // Reference to User model for assigned users
      required: true
    }
    
  }],
  assigneeUsernames: {
    type: [String],  // Array of strings for assignee usernames
    required: true,
  },
  taskDeadline: {
    type: Date,
    required: [true, 'Task deadline is required']
  }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
