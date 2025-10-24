import express from 'express';
import AdoptionDog from '../models/adoptionDog.model.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all adoption dogs
router.get('/', async (req, res, next) => {
  try {
    const { status, size, gender, limit = 20, page = 1 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (size) query.size = size;
    if (gender) query.gender = gender;

    const dogs = await AdoptionDog.find(query)
      .sort({ addedDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await AdoptionDog.countDocuments(query);

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
    const dog = await AdoptionDog.findById(req.params.id);
    
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

// Add dog for adoption
router.post('/', authenticate, authorize('ADMIN', 'VOLUNTEER'), async (req, res, next) => {
  try {
    const dogData = {
      ...req.body,
      addedBy: req.userId,
      status: 'AVAILABLE'
    };

    const dog = new AdoptionDog(dogData);
    await dog.save();

    res.status(201).json({
      success: true,
      message: 'Dog added for adoption successfully',
      data: dog
    });
  } catch (error) {
    next(error);
  }
});

// Update adoption dog
router.put('/:id', authenticate, authorize('ADMIN', 'VOLUNTEER'), async (req, res, next) => {
  try {
    const dog = await AdoptionDog.findByIdAndUpdate(
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
      message: 'Dog updated successfully',
      data: dog
    });
  } catch (error) {
    next(error);
  }
});

// Delete adoption dog
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const dog = await AdoptionDog.findByIdAndDelete(req.params.id);

    if (!dog) {
      return res.status(404).json({
        success: false,
        message: 'Dog not found'
      });
    }

    res.json({
      success: true,
      message: 'Dog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
