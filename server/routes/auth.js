import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, department, rollNumber } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
            department,
            rollNumber
        });

        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
    res.json(req.user);
});

// @route   POST /api/auth/seed
// @desc    Seed demo accounts (for demo mode)
// @access  Public
router.post('/seed', async (req, res) => {
    try {
        // Check if demo accounts exist
        const demoStudent = await User.findOne({ email: 'student@demo.com' });
        const demoAdmin = await User.findOne({ email: 'admin@demo.com' });

        if (!demoStudent) {
            await User.create({
                name: 'Demo Student',
                email: 'student@demo.com',
                password: 'demo123',
                role: 'student',
                department: 'Computer Science',
                rollNumber: 'CS2024001'
            });
        }

        if (!demoAdmin) {
            await User.create({
                name: 'Admin User',
                email: 'admin@demo.com',
                password: 'admin123',
                role: 'admin',
                department: 'Administration'
            });
        }

        res.json({ message: 'Demo accounts created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
