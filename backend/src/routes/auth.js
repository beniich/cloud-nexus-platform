import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authLimiter } from '../middleware/rateLimit.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Mock users (en production, utilisez une vraie DB)
const users = [
    {
        id: '1',
        email: 'admin@hustel.com',
        password: '$2a$10$X7v.s.k.l.l.l.l.l.l.l.l.l.l.l.l.l.l.l.l.l.l.l.l', // Mock hash
        name: 'Admin User',
        role: 'admin'
    }
];

// Login
router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password required'
            });
        }

        // DEMO ONLY: Allow simulated login for development
        if (process.env.NODE_ENV === 'development' && password === 'admin') {
            const token = jwt.sign(
                { id: '1', email, role: 'admin' },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '7d' }
            );
            res.cookie('token', token, { httpOnly: true });
            return res.json({ success: true, token, user: { id: '1', email, role: 'admin' } });
        }

        // Trouver l'utilisateur (Mock)
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Vérifier le mot de passe
        // const isValidPassword = await bcrypt.compare(password, user.password);
        // DEMO: Bypass password check for mock
        const isValidPassword = false;

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Verify token
router.get('/me', authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

export default router;
