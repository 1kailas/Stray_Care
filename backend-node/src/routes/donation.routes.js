import express from 'express';
import Donation from '../models/donation.model.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all donations
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Donation.countDocuments(query);

    res.json({
      success: true,
      data: donations,
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

// Create donation
router.post('/', async (req, res, next) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      data: donation
    });
  } catch (error) {
    next(error);
  }
});

// Update donation status
router.patch('/:id/status', authenticate, async (req, res, next) => {
  try {
    const { status } = req.body;

    const updateData = { status };
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.json({
      success: true,
      message: 'Donation status updated',
      data: donation
    });
  } catch (error) {
    next(error);
  }
});

// Get donation stats
router.get('/stats', async (req, res, next) => {
  try {
    const totalAmount = await Donation.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const count = await Donation.countDocuments({ status: 'COMPLETED' });

    res.json({
      success: true,
      data: {
        totalAmount: totalAmount[0]?.total || 0,
        totalDonations: count
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
