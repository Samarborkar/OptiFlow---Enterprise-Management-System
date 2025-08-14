import React, { useEffect, useState, useContext } from 'react';
import '../index.css';
import { UserContext } from '../context/user';

const TaskList = () => {
  const { username1 } = useContext(UserContext); 
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/task/user/${username1}`); 
        const data = await response.json();
        if (response.ok) {
          setTasks(data.tasks);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Error fetching tasks: ' + error.message);
      }
    };

    if (username1) { 
      fetchTasks();
    }
  }, [username1]); 

 
  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/task/${taskId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
       
        setTasks((prevTasks) => prevTasks.filter(task => task._id !== taskId));
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete task.');
      }
    } catch (error) {
      setError('Error deleting task: ' + error.message);
    }
  };

  return (
    <div className="task-list-container">
      <h2>All Tasks</h2>
      {error && <p className="error-message">{error}</p>}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <h3>{task.taskTitle}</h3>
            <p>{task.taskDetails}</p>
            <p>
              {task.assignedUsers.map(user => user.userId.username).join(', ')}
            </p>
            <p>Deadline: {new Date(task.taskDeadline).toLocaleDateString()}</p>
            <button onClick={() => handleDelete(task._id)}>Delete Task</button> 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
