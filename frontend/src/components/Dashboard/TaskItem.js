import React from 'react';
import { tasksAPI } from '../../services/api';
import './TaskItem.css';

const TaskItem = ({ task, onEdit, onDelete, onUpdate }) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await tasksAPI.updateTask(task._id, { status: newStatus });
      onUpdate();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(task._id);
        onDelete();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getPriorityClass = () => {
    switch (task.priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getStatusClass = () => {
    switch (task.status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  return (
    <div className={`task-item ${getStatusClass()}`}>
      <div className="task-header">
        <h4 className={task.status === 'completed' ? 'completed-title' : ''}>
          {task.title}
        </h4>
        <div className="task-actions">
          <button onClick={() => onEdit(task)} className="btn-icon" title="Edit">
            ✏️
          </button>
          <button onClick={handleDelete} className="btn-icon" title="Delete">
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <div className="task-badges">
          <span className={`priority-badge ${getPriorityClass()}`}>
            {task.priority}
          </span>
          {task.category && (
            <span className="category-badge">{task.category}</span>
          )}
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="task-tags">
            {task.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {task.dueDate && (
        <div className={`task-due-date ${isOverdue() ? 'overdue' : ''}`}>
          📅 Due: {formatDate(task.dueDate)}
          {isOverdue() && <span className="overdue-badge">Overdue</span>}
        </div>
      )}

      <div className="task-footer">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="status-select"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <span className="task-date">
          Created: {formatDate(task.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default TaskItem;
