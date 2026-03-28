import React from 'react';
import './TaskFilters.css';

const TaskFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  return (
    <div className="task-filters">
      <div className="filters-row">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search tasks..."
          className="search-input"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          name="priority"
          value={filters.priority}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="text"
          name="category"
          value={filters.category}
          onChange={handleChange}
          placeholder="Category"
          className="filter-input"
        />
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="createdAt">Created Date</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
        <select
          name="sortOrder"
          value={filters.sortOrder}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <button onClick={clearFilters} className="btn-clear">
          Clear
        </button>
      </div>
    </div>
  );
};

export default TaskFilters;
