import mongoose from 'mongoose';
import Task from '../models/Task.js';
const statuses = ['pending', 'in_progress', 'completed'];
const priorities = ['low', 'medium', 'high'];

export async function listTasks(req, res, next) {
  try {
    const { search = '', status = 'all', priority = 'all' } = req.query;
    const filter = {};
    if (search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [{ title: { $regex: escaped, $options: 'i' } }, { description: { $regex: escaped, $options: 'i' } }];
    }
    if (status !== 'all') { if (!statuses.includes(status)) return res.status(400).json({ message: 'Invalid status filter' }); filter.status = status; }
    if (priority !== 'all') { if (!priorities.includes(priority)) return res.status(400).json({ message: 'Invalid priority filter' }); filter.priority = priority; }
    const tasks = await Task.find(filter).sort({ created_at: -1 }).lean();
    res.json({ tasks });
  } catch (err) { next(err); }
}
export async function getTask(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID' });
    const task = await Task.findById(req.params.id).lean();
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) { next(err); }
}
export async function createTask(req, res, next) {
  try {
    const { title, description = '', priority = 'medium', status = 'pending', due_date = null } = req.body;
    const task = await Task.create({ title, description, priority, status, due_date: due_date || null });
    res.status(201).json({ task });
  } catch (err) { next(err); }
}
export async function updateTask(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID' });
    const { title, description = '', status = 'pending', priority = 'medium', due_date = null } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { title, description, status, priority, due_date: due_date || null }, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) { next(err); }
}
export async function toggleTask(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    await task.save(); res.json({ task });
  } catch (err) { next(err); }
}
export async function deleteTask(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID' });
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) { next(err); }
}
