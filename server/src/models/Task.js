import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Task title is required'], trim: true, maxlength: [160, 'Title must be 160 characters or fewer'] },
  description: { type: String, trim: true, default: '', maxlength: [2000, 'Description must be 2000 characters or fewer'] },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  due_date: { type: String, default: null, validate: { validator: v => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), message: 'Due date must be YYYY-MM-DD' } }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, versionKey: false });
taskSchema.index({ created_at: -1 });
taskSchema.index({ status: 1 });
export default mongoose.model('Task', taskSchema);
