import express from 'express';
import Volunteer from '../models/volunteer.model.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all volunteers
router.get('/', async (req, res, next) => {
  try {
    const { status, role, limit = 50, page = 1 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (role) query.role = role;

    const volunteers = await Volunteer.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Volunteer.countDocuments(query);

    res.json({
      success: true,
      data: volunteers,
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

// Register as volunteer
router.post('/register', authenticate, async (req, res, next) => {
  try {
    const volunteerData = {
      ...req.body,
      userId: req.userId,
      status: 'PENDING'
    };

    const volunteer = new Volunteer(volunteerData);
    await volunteer.save();

    res.status(201).json({
      success: true,
      message: 'Volunteer registration submitted',
      data: volunteer
    });
  } catch (error) {
    next(error);
  }
});

// Approve/reject volunteer
router.patch('/:id/status', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { status } = req.body;

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.json({
      success: true,
      message: `Volunteer ${status.toLowerCase()}`,
      data: volunteer
    });
  } catch (error) {
    next(error);
  }
});

// Get volunteer by user ID
router.get('/user/:userId', authenticate, async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.params.userId });

    res.json({
      success: true,
      data: volunteer
    });
  } catch (error) {
    next(error);
  }
});

export default router;
