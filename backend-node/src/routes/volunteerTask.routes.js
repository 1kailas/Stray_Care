import express from 'express';
import VolunteerTask from '../models/volunteerTask.model.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all volunteer tasks
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { volunteerId, status, priority, limit = 50, page = 1 } = req.query;
    
    const query = {};
    if (volunteerId) query.volunteerId = volunteerId;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await VolunteerTask.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await VolunteerTask.countDocuments(query);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get task by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const task = await VolunteerTask.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
});

// Create volunteer task
router.post('/', authenticate, authorize('ADMIN', 'VOLUNTEER'), async (req, res, next) => {
  try {
    const taskData = {
      ...req.body,
      assignedDate: new Date().toISOString()
    };

    const task = new VolunteerTask(taskData);
    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
});

// Update volunteer task
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const task = await VolunteerTask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
});

// Update task status
router.patch('/:id/status', authenticate, async (req, res, next) => {
  try {
    const { status } = req.body;

    const updateData = { status };
    if (status === 'COMPLETED') {
      updateData.completedDate = new Date().toISOString();
    }

    const task = await VolunteerTask.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task status updated',
      data: task
    });
  } catch (error) {
    next(error);
  }
});

// Delete volunteer task
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const task = await VolunteerTask.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
