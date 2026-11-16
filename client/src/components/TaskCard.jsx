const statusLabels = { pending: 'Pending', in_progress: 'In progress', completed: 'Completed' };
import React from 'react';

function formatDate(date) {
  if (!date) return null;
  return new Date(`${String(date).slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const overdue = task.due_date && task.status !== 'completed' &&
    new Date(`${String(task.due_date).slice(0, 10)}T23:59:59`) < new Date();

  return (
    <article className={`task-card ${task.status === 'completed' ? 'task-completed' : ''}`}>
      <button className={`task-check ${task.status === 'completed' ? 'checked' : ''}`} onClick={() => onToggle(task._id)} aria-label="Toggle task completion">
        {task.status === 'completed' && <i className="bi bi-check-lg" />}
      </button>
      <div className="task-content">
        <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
          <h3 className="task-title">{task.title}</h3>
          <span className={`priority-dot priority-${task.priority}`} />
          <span className={`priority-text priority-text-${task.priority}`}>{task.priority}</span>
        </div>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="d-flex flex-wrap align-items-center gap-3 task-meta">
          <span className={`status-label status-${task.status}`}>{statusLabels[task.status]}</span>
          {task.due_date && <span className={overdue ? 'due-overdue' : ''}><i className="bi bi-calendar3 me-1" />{formatDate(task.due_date)}{overdue ? ' · Overdue' : ''}</span>}
        </div>
      </div>
      <div className="task-actions">
        <button className="icon-button" onClick={() => onEdit(task)} aria-label="Edit task"><i className="bi bi-pencil" /></button>
        <button className="icon-button delete-button" onClick={() => onDelete(task)} aria-label="Delete task"><i className="bi bi-trash3" /></button>
      </div>
    </article>
  );
}
