import express from 'express';
import DogReport from '../models/dogReport.model.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all dog reports
router.get('/', async (req, res, next) => {
  try {
    const { status, condition, limit = 50, page = 1 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (condition) query.condition = condition;

    const reports = await DogReport.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await DogReport.countDocuments(query);

    res.json({
      success: true,
      data: reports,
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

// Get report by ID
router.get('/:id', async (req, res, next) => {
  try {
    const report = await DogReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
});

// Create dog report
router.post('/', authenticate, async (req, res, next) => {
  try {
    const reportData = {
      ...req.body,
      reportedBy: req.userId,
      status: 'PENDING'
    };

    const report = new DogReport(reportData);
    await report.save();

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
});

// Update dog report
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const report = await DogReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
});

// Delete dog report
router.delete('/:id', authenticate, authorize('ADMIN', 'VOLUNTEER'), async (req, res, next) => {
  try {
    const report = await DogReport.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Assign volunteer to report
router.patch('/:id/assign', authenticate, authorize('ADMIN', 'VOLUNTEER'), async (req, res, next) => {
  try {
    const { volunteerId, volunteerName } = req.body;

    const report = await DogReport.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo: volunteerId,
        assignedVolunteerName: volunteerName,
        status: 'ASSIGNED'
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      message: 'Volunteer assigned successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
});

// Add note to report
router.post('/:id/notes', authenticate, async (req, res, next) => {
  try {
    const { content } = req.body;

    const report = await DogReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.notes.push({
      content,
      addedBy: req.user.name,
      addedAt: new Date()
    });

    await report.save();

    res.json({
      success: true,
      message: 'Note added successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
});

export default router;
