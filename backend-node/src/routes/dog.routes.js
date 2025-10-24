import express from 'express';
import Dog from '../models/dog.model.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all dogs
router.get('/', async (req, res, next) => {
  try {
    const { status, breed, gender, limit = 50, page = 1 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (breed) query.breed = new RegExp(breed, 'i');
    if (gender) query.gender = gender;

    const dogs = await Dog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Dog.countDocuments(query);

    res.json({
      success: true,
      data: dogs,
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

// Get dog by ID
router.get('/:id', async (req, res, next) => {
  try {
    const dog = await Dog.findById(req.params.id)
      .populate('reportId')
      .populate('rescuedBy', 'name email');
    
    if (!dog) {
      return res.status(404).json({
        success: false,
        message: 'Dog not found'
      });
    }

    res.json({
      success: true,
      data: dog
    });
  } catch (error) {
    next(error);
  }
});

// Create dog record
router.post('/', authenticate, authorize('ADMIN', 'VOLUNTEER'), async (req, res, next) => {
  try {
    const dog = new Dog(req.body);
    await dog.save();

    res.status(201).json({
      success: true,
      message: 'Dog record created successfully',
      data: dog
    });
  } catch (error) {
    next(error);
  }
});

// Update dog record
router.put('/:id', authenticate, authorize('ADMIN', 'VOLUNTEER'), async (req, res, next) => {
  try {
    const dog = await Dog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!dog) {
      return res.status(404).json({
        success: false,
        message: 'Dog not found'
      });
    }

    res.json({
      success: true,
      message: 'Dog record updated successfully',
      data: dog
    });
  } catch (error) {
    next(error);
  }
});

// Delete dog record
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const dog = await Dog.findByIdAndDelete(req.params.id);

    if (!dog) {
      return res.status(404).json({
        success: false,
        message: 'Dog not found'
      });
    }

    res.json({
      success: true,
      message: 'Dog record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get dogs by status
router.get('/status/:status', async (req, res, next) => {
  try {
    const dogs = await Dog.find({ status: req.params.status.toUpperCase() })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: dogs
    });
  } catch (error) {
    next(error);
  }
});

export default router;
