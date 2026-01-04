import express from 'express';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/stats
// @desc    Get dashboard statistics (for Landing Page Live Stats Ticker)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const totalComplaints = await Complaint.countDocuments();
        const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
        const totalStudents = await User.countDocuments({ role: 'student' });

        // Calculate satisfaction rate (resolved / total * 100)
        const satisfactionRate = totalComplaints > 0
            ? Math.round((resolvedComplaints / totalComplaints) * 100)
            : 98; // Default for demo

        // Get category distribution
        const categoryStats = await Complaint.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Get status distribution
        const statusStats = await Complaint.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            totalComplaints: totalComplaints || 1250, // Fallback for demo
            resolvedComplaints: resolvedComplaints || 1180,
            totalStudents: totalStudents || 850,
            satisfactionRate: satisfactionRate || 98,
            categoryStats,
            statusStats,
            // For landing page ticker display
            displayStats: {
                issuesResolved: `${(resolvedComplaints || 1180).toLocaleString()}+`,
                satisfaction: `${satisfactionRate || 98}%`,
                activeStudents: `${(totalStudents || 850).toLocaleString()}+`,
                avgResponseTime: '24hrs'
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
