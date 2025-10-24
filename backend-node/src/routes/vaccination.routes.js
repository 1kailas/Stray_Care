import express from 'express';
import Vaccination from '../models/vaccination.model.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all vaccination records
router.get('/', async (req, res, next) => {
  try {
    const { dogReportId, limit = 50, page = 1 } = req.query;
    
    const query = {};
    if (dogReportId) query.dogReportId = dogReportId;

    const vaccinations = await Vaccination.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Vaccination.countDocuments(query);

    res.json({
      success: true,
      data: vaccinations,
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

// Get vaccination by ID
router.get('/:id', async (req, res, next) => {
  try {
    const vaccination = await Vaccination.findById(req.params.id);
    
    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination record not found'
      });
    }

    res.json({
      success: true,
      data: vaccination
    });
  } catch (error) {
    next(error);
  }
});

// Create vaccination record
router.post('/', authenticate, authorize('ADMIN', 'VOLUNTEER'), async (req, res, next) => {
  try {
    const vaccination = new Vaccination(req.body);
    await vaccination.save();

    res.status(201).json({
      success: true,
      message: 'Vaccination record created successfully',
      data: vaccination
    });
  } catch (error) {
    next(error);
  }
});

// Update vaccination record
router.put('/:id', authenticate, authorize('ADMIN', 'VOLUNTEER'), async (req, res, next) => {
  try {
    const vaccination = await Vaccination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination record not found'
      });
    }

    res.json({
      success: true,
      message: 'Vaccination record updated successfully',
      data: vaccination
    });
  } catch (error) {
    next(error);
  }
});

// Delete vaccination record
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const vaccination = await Vaccination.findByIdAndDelete(req.params.id);

    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination record not found'
      });
    }

    res.json({
      success: true,
      message: 'Vaccination record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Add vaccination to record
router.post('/:id/records', authenticate, authorize('ADMIN', 'VOLUNTEER'), async (req, res, next) => {
  try {
    const vaccination = await Vaccination.findById(req.params.id);
    
    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination record not found'
      });
    }

    vaccination.records.push(req.body);
    await vaccination.save();

    res.json({
      success: true,
      message: 'Vaccination added to record',
      data: vaccination
    });
  } catch (error) {
    next(error);
  }
});

export default router;
