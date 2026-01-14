import express from 'express';
import jwt from 'jsonwebtoken';
import { authLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Mock login for development
router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        // Default to admin for now
        const user = {
            id: '1',
            email: email,
            name: 'Admin User',
            role: 'admin'
        };

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});

export default router;
