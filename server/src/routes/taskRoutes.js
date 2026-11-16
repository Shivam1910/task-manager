import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { listTasks, getTask, createTask, updateTask, toggleTask, deleteTask } from '../controllers/taskController.js';
const router = Router();
const validate = (req, res, next) => { const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() }); next(); };
const idRule = param('id').isMongoId().withMessage('Invalid task ID');
const taskRules = [
  body('title').isString().trim().notEmpty().withMessage('Title is required').isLength({ max: 160 }).withMessage('Title must be 160 characters or fewer'),
  body('description').optional().isString().isLength({ max: 2000 }).withMessage('Description must be 2000 characters or fewer'),
  body('status').optional().isIn(['pending', 'in_progress', 'completed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('due_date').optional({ nullable: true, checkFalsy: true }).matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Due date must be YYYY-MM-DD')
];
router.get('/', listTasks); router.get('/:id', idRule, validate, getTask); router.post('/', taskRules, validate, createTask); router.put('/:id', idRule, taskRules, validate, updateTask); router.patch('/:id/toggle', idRule, validate, toggleTask); router.delete('/:id', idRule, validate, deleteTask);
export default router;
