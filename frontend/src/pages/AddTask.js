import React, { useState, useContext } from 'react';
import '../index.css';
import { UserContext } from '../context/user';
import Navbar from '../components/Navbar';

const Task = () => {
  const { username1 } = useContext(UserContext); 
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [username, setUsername] = useState('');
  const [assigneeUsernames, setAssigneeUsernames] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const taskData = {
        username,
        taskTitle,
        taskDetails,
        assigneeUsernames: assigneeUsernames.split(',').map(username => username.trim()), 
        taskDeadline,
      };

      console.log(JSON.stringify(taskData));
      const response = await fetch('http://localhost:4000/api/task/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('Task created successfully!');
        setTaskTitle('');
        setTaskDetails('');
        setAssigneeUsernames('');
        setTaskDeadline('');
        setError(null); 
      } else {
        setError(result.message);
        setSuccessMessage(null); 
      }
    } catch (error) {
      setError('Error creating task: ' + error.message);
      setSuccessMessage(null);
    }
  };

  return (
    <div>
      <Navbar />

      {/* Spacer div to add space between Navbar and form */}
      <div className="spacer2"></div>

      <div className="task-form-container">
        <h2>Create a New Task</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Creator Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Task Title:</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Task Details:</label>
            <textarea
              value={taskDetails}
              onChange={(e) => setTaskDetails(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Assignee Usernames (comma separated):</label>
            <input
              type="text"
              value={assigneeUsernames}
              onChange={(e) => setAssigneeUsernames(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Task Deadline:</label>
            <input
              type="date"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
              required
            />
          </div>
          
          <button type="submit">Create Task</button>
        </form>
      </div>
    </div>
  );
};

export default Task;
