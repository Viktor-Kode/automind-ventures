import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ tasks, loading, onEdit, onDelete, onUpdate }) => {
  if (loading) {
    return (
      <div className="task-list">
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <div className="empty-state">
          <p>No tasks found. Create your first task to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="tasks-grid">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
