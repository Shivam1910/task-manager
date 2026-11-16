import { useEffect, useState } from 'react';
import React from 'react';

const emptyForm = { title: '', description: '', priority: 'medium', status: 'pending', due_date: '' };

export default function TaskModal({ open, task, onClose, onSave, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(task ? {
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        due_date: task.due_date ? String(task.due_date).slice(0, 10) : ''
      } : emptyForm);
      setError('');
    }
  }, [open, task]);

  if (!open) return null;

  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async event => {
    event.preventDefault();
    if (!form.title.trim()) return setError('Please enter a task title.');
    try {
      await onSave({ ...form, title: form.title.trim(), due_date: form.due_date || null });
    } catch (err) {
      setError(err.message || 'Unable to save task.');
    }
  };

  return (
    <div className="modal-backdrop-custom" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="task-modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="eyebrow">TASK DETAILS</div>
            <h2 id="task-modal-title" className="h4 fw-bold mb-0">{task ? 'Edit task' : 'Create a task'}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg" /></button>
        </div>
        <form onSubmit={submit}>
          <label className="form-label">Task title <span className="text-danger">*</span></label>
          <input className="form-control mb-3" name="title" maxLength="160" value={form.title} onChange={change} placeholder="e.g. Prepare project presentation" autoFocus />
          <label className="form-label">Description</label>
          <textarea className="form-control mb-3" name="description" rows="3" maxLength="2000" value={form.description} onChange={change} placeholder="Add some details..." />
          <div className="row">
            <div className="col-sm-6 mb-3">
              <label className="form-label">Priority</label>
              <select className="form-select" name="priority" value={form.priority} onChange={change}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </div>
            <div className="col-sm-6 mb-3">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={form.status} onChange={change}>
                <option value="pending">Pending</option><option value="in_progress">In progress</option><option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <label className="form-label">Due date</label>
          <input className="form-control mb-3" type="date" name="due_date" value={form.due_date} onChange={change} />
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-light px-3" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary px-4" disabled={saving}>{saving ? 'Saving...' : task ? 'Save changes' : 'Create task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
