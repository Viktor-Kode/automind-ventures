import React from 'react';
import './TaskStats.css';

const TaskStats = ({ stats }) => {
  if (!stats) {
    return (
      <div className="task-stats">
        <h3>Statistics</h3>
        <div className="stats-loading">Loading...</div>
      </div>
    );
  }

  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <div className="task-stats">
      <h3>Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card in-progress">
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
      </div>
      <div className="completion-rate">
        <div className="rate-label">Completion Rate</div>
        <div className="rate-bar">
          <div 
            className="rate-fill" 
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <div className="rate-value">{completionRate}%</div>
      </div>
    </div>
  );
};

export default TaskStats;
