import express from 'express';
import Complaint from '../models/Complaint.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/complaints
// @desc    Create a new complaint
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, category, priority, isAnonymous } = req.body;

        const complaint = await Complaint.create({
            title,
            description,
            category,
            priority: priority || 'Medium',
            isAnonymous: isAnonymous || false, // Enhancement #2
            user: req.user._id,
            statusHistory: [{ status: 'Submitted', changedBy: req.user._id }]
        });

        // Populate user info for response
        await complaint.populate('user', 'name email department');

        // Enhancement #2: Return anonymized response if isAnonymous
        const responseData = complaint.toPublicJSON(!complaint.isAnonymous);

        res.status(201).json(responseData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/complaints
// @desc    Get all complaints (Admin: all, Student: own)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let complaints;
        const { status, category, page = 1, limit = 10 } = req.query;

        // Build filter
        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;

        // Admin sees all, student sees only their own
        if (req.user.role !== 'admin') {
            filter.user = req.user._id;
        }

        complaints = await Complaint.find(filter)
            .populate('user', 'name email department rollNumber')
            .populate('statusHistory.changedBy', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Complaint.countDocuments(filter);

        // Enhancement #2: Anonymize responses for non-admin users viewing others' complaints
        const responseData = complaints.map(complaint => {
            if (complaint.isAnonymous && req.user.role !== 'admin' && complaint.user._id.toString() !== req.user._id.toString()) {
                return complaint.toPublicJSON(false);
            }
            return complaint.toPublicJSON(true);
        });

        res.json({
            complaints: responseData,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/complaints/:id
// @desc    Get single complaint
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('user', 'name email department rollNumber')
            .populate('statusHistory.changedBy', 'name');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Check permission
        if (req.user.role !== 'admin' && complaint.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this complaint' });
        }

        // Enhancement #2: Admin always sees full info
        const responseData = complaint.toPublicJSON(req.user.role === 'admin' || !complaint.isAnonymous);

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/complaints/:id
// @desc    Update complaint status (Admin only)
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const { status, adminResponse, expectedResolutionDate } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Update status and add to history
        if (status && status !== complaint.status) {
            complaint.status = status;
            complaint.statusHistory.push({
                status,
                changedAt: new Date(),
                changedBy: req.user._id
            });
        }

        if (adminResponse) {
            complaint.adminResponse = adminResponse;
        }

        // Update expected resolution date if provided
        if (expectedResolutionDate !== undefined) {
            complaint.expectedResolutionDate = expectedResolutionDate ? new Date(expectedResolutionDate) : null;
        }

        await complaint.save();
        await complaint.populate('user', 'name email department');
        await complaint.populate('statusHistory.changedBy', 'name');
        await complaint.populate('messages.sender', 'name');

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/complaints/:id/messages
// @desc    Add a message to a complaint
// @access  Private (Admin or complaint owner)
router.post('/:id/messages', protect, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'Message text is required' });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Check permission: Admin can message any complaint, student can only message their own
        if (req.user.role !== 'admin' && complaint.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to message on this complaint' });
        }

        // Add the message
        complaint.messages.push({
            text: text.trim(),
            sender: req.user._id,
            senderRole: req.user.role,
            senderName: req.user.name,
            createdAt: new Date()
        });

        await complaint.save();
        await complaint.populate('user', 'name email department');
        await complaint.populate('messages.sender', 'name');

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/complaints/:id
// @desc    Delete complaint
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Only admin or owner can delete
        if (req.user.role !== 'admin' && complaint.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this complaint' });
        }

        await complaint.deleteOne();

        res.json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
