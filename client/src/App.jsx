import { useCallback, useEffect, useMemo, useState } from 'react';
import { taskApi, getErrorMessage } from './services/api.js';
import TaskCard from './components/TaskCard.jsx';
import TaskModal from './components/TaskModal.jsx';
import React from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await taskApi.list({
        search,
        status: activeTab === 'all' ? status : activeTab,
        priority
      });
      setTasks(response.data.tasks);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, activeTab]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status !== 'completed').length
  }), [tasks]);

  const notify = message => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const openCreate = () => { setEditingTask(null); setModalOpen(true); };
  const openEdit = task => { setEditingTask(task); setModalOpen(true); };

  const saveTask = async data => {
    setSaving(true);
    try {
      if (editingTask) await taskApi.update(editingTask._id, data);
      else await taskApi.create(data);
      setModalOpen(false);
      notify(editingTask ? 'Task updated successfully' : 'Task created successfully');
      await loadTasks();
    } catch (err) {
      throw new Error(getErrorMessage(err));
    } finally { setSaving(false); }
  };

  const toggleTask = async id => {
    try {
      await taskApi.toggle(id);
      await loadTasks();
    } catch (err) { setError(getErrorMessage(err)); }
  };

  const deleteTask = async task => {
    if (!window.confirm(`Delete "${task.title}"? This action cannot be undone.`)) return;
    try {
      await taskApi.remove(task._id);
      notify('Task deleted successfully');
      await loadTasks();
    } catch (err) { setError(getErrorMessage(err)); }
  };

  const clearFilters = () => { setSearch(''); setStatus('all'); setPriority('all'); setActiveTab('all'); };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container app-container d-flex align-items-center justify-content-between">
          <a className="brand" href="#"><span className="brand-mark"><i className="bi bi-check2-square" /></span> taskflow</a>
          <div className="topbar-right"><span className="avatar">S</span><span className="small fw-semibold text-dark">My workspace</span></div>
        </div>
      </header>

      <main className="container app-container main-content">
        <section className="welcome-row">
          <div><div className="eyebrow">YOUR WORKSPACE</div><h1>Good things get done.</h1><p>Keep your day focused, organized, and moving forward.</p></div>
          <button className="btn btn-primary create-button" onClick={openCreate}><i className="bi bi-plus-lg me-2" />New task</button>
        </section>

        <section className="stats-grid">
          <div className="stat-card"><div className="stat-icon icon-blue"><i className="bi bi-list-check" /></div><div><div className="stat-number">{stats.total}</div><div className="stat-label">Tasks shown</div></div></div>
          <div className="stat-card"><div className="stat-icon icon-amber"><i className="bi bi-hourglass-split" /></div><div><div className="stat-number">{stats.pending}</div><div className="stat-label">To do</div></div></div>
          <div className="stat-card"><div className="stat-icon icon-green"><i className="bi bi-check-circle" /></div><div><div className="stat-number">{stats.completed}</div><div className="stat-label">Completed</div></div></div>
        </section>

        <section className="tasks-panel">
          <div className="panel-heading"><div><h2>My tasks</h2><p>Everything you need to get done.</p></div><span className="task-count">{stats.total} {stats.total === 1 ? 'task' : 'tasks'}</span></div>

          <div className="task-tabs" role="tablist" aria-label="Task status filters">
            {[['all','All tasks'],['pending','Pending'],['in_progress','In progress'],['completed','Completed']].map(([value,label]) =>
              <button key={value} className={`task-tab ${activeTab === value ? 'active' : ''}`} onClick={() => { setActiveTab(value); setStatus('all'); }}>{label}</button>
            )}
          </div>

          <div className="filters-row">
            <div className="search-box"><i className="bi bi-search" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." aria-label="Search tasks" />{search && <button onClick={() => setSearch('')} aria-label="Clear search"><i className="bi bi-x" /></button>}</div>
            <select className="form-select filter-select" value={priority} onChange={e => setPriority(e.target.value)} aria-label="Filter by priority"><option value="all">All priorities</option><option value="high">High priority</option><option value="medium">Medium priority</option><option value="low">Low priority</option></select>
            <button className="clear-filters" onClick={clearFilters}>Clear filters</button>
          </div>

          {error && <div className="alert alert-danger mx-4 mt-3 mb-0 d-flex justify-content-between"><span>{error}</span><button className="btn-close" onClick={() => setError('')} /></div>}

          <div className="task-list">
            {loading ? <div className="empty-state"><div className="spinner-border text-primary" /><p>Loading your tasks...</p></div> :
              tasks.length ? tasks.map(task => <TaskCard key={task._id} task={task} onToggle={toggleTask} onEdit={openEdit} onDelete={deleteTask} />) :
              <div className="empty-state"><div className="empty-icon"><i className="bi bi-clipboard2-check" /></div><h3>No tasks found</h3><p>{search || priority !== 'all' || activeTab !== 'all' ? 'Try changing your search or filters.' : 'You’re all clear. Add a task to get started.'}</p><button className="btn btn-outline-primary btn-sm" onClick={search || priority !== 'all' || activeTab !== 'all' ? clearFilters : openCreate}>{search || priority !== 'all' || activeTab !== 'all' ? 'Clear filters' : 'Create your first task'}</button></div>
            }
          </div>
        </section>
        <footer className="app-footer">Made to help you focus on what matters. <span>TaskFlow © {new Date().getFullYear()}</span></footer>
      </main>

      <TaskModal open={modalOpen} task={editingTask} onClose={() => setModalOpen(false)} onSave={saveTask} saving={saving} />
      {toast && <div className="toast-message"><i className="bi bi-check-circle-fill me-2" />{toast}</div>}
    </div>
  );
}
