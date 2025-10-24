import express from 'express';
import DogReport from '../models/dogReport.model.js';
import AdoptionDog from '../models/adoptionDog.model.js';
import Donation from '../models/donation.model.js';
import Volunteer from '../models/volunteer.model.js';
import User from '../models/user.model.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    // Count documents
    const [
      totalReports,
      pendingReports,
      rescuedDogs,
      totalAdoptionDogs,
      availableDogs,
      totalDonations,
      completedDonations,
      totalVolunteers,
      activeVolunteers
    ] = await Promise.all([
      DogReport.countDocuments(),
      DogReport.countDocuments({ status: 'PENDING' }),
      DogReport.countDocuments({ status: 'RESCUED' }),
      AdoptionDog.countDocuments(),
      AdoptionDog.countDocuments({ status: 'AVAILABLE' }),
      Donation.countDocuments(),
      Donation.countDocuments({ status: 'COMPLETED' }),
      Volunteer.countDocuments(),
      Volunteer.countDocuments({ status: 'ACTIVE' })
    ]);

    // Calculate total donation amount
    const donationStats = await Donation.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        reports: {
          total: totalReports,
          pending: pendingReports,
          rescued: rescuedDogs
        },
        adoptions: {
          total: totalAdoptionDogs,
          available: availableDogs
        },
        donations: {
          total: totalDonations,
          completed: completedDonations,
          totalAmount: donationStats[0]?.total || 0
        },
        volunteers: {
          total: totalVolunteers,
          active: activeVolunteers
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get activity feed
router.get('/activity', authenticate, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent reports
    const recentReports = await DogReport.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('dogName status reporterName createdAt');

    // Get recent adoptions
    const recentAdoptions = await AdoptionDog.find()
      .sort({ addedDate: -1 })
      .limit(limit)
      .select('name status addedDate');

    // Get recent donations
    const recentDonations = await Donation.find({ status: 'COMPLETED' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('donorName amount createdAt');

    // Combine and sort by date
    const activities = [
      ...recentReports.map(r => ({
        type: 'REPORT',
        title: `New dog report: ${r.dogName || 'Unnamed'}`,
        description: `Reported by ${r.reporterName}`,
        date: r.createdAt
      })),
      ...recentAdoptions.map(a => ({
        type: 'ADOPTION',
        title: `${a.name} added for adoption`,
        description: `Status: ${a.status}`,
        date: a.addedDate
      })),
      ...recentDonations.map(d => ({
        type: 'DONATION',
        title: `Donation received`,
        description: `₹${d.amount} from ${d.donorName}`,
        date: d.createdAt
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    next(error);
  }
});

// Get chart data
router.get('/charts/reports', authenticate, async (req, res, next) => {
  try {
    const { period = '7days' } = req.query;
    
    let startDate = new Date();
    if (period === '7days') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === '30days') {
      startDate.setDate(startDate.getDate() - 30);
    }

    const reports = await DogReport.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: reports.map(r => ({
        date: r._id,
        count: r.count
      }))
    });
  } catch (error) {
    next(error);
  }
});

export default router;
