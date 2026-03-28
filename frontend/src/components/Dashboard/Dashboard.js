import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { removeToken, removeUser } from '../../utils/auth';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskStats from './TaskStats';
import TaskFilters from './TaskFilters';
import './Dashboard.css';

const Dashboard = ({ setIsAuthenticated }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const { tasksAPI } = await import('../../services/api');
      const response = await tasksAPI.getTasks(filters);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { tasksAPI } = await import('../../services/api');
      const response = await tasksAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    removeToken();
    removeUser();
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleTaskCreated = () => {
    fetchTasks();
    fetchStats();
    setShowForm(false);
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    fetchStats();
    setEditingTask(null);
    setShowForm(false);
  };

  const handleTaskDeleted = () => {
    fetchTasks();
    fetchStats();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Manager</h1>
        <div className="dashboard-header-actions">
          <Link to="/payment" className="btn-payment">
            Pay
          </Link>
          <button type="button" onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <TaskStats stats={stats} />
          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
            className="btn-add-task"
          >
            + New Task
          </button>
        </div>

        <div className="dashboard-main">
          <TaskFilters filters={filters} setFilters={setFilters} />
          {showForm && (
            <TaskForm
              task={editingTask}
              onSuccess={editingTask ? handleTaskUpdated : handleTaskCreated}
              onCancel={handleCancel}
            />
          )}
          <TaskList
            tasks={tasks}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleTaskDeleted}
            onUpdate={handleTaskUpdated}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
