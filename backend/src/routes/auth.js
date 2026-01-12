import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authLimiter } from '../middleware/rateLimit.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Mock users (en production, utilisez une vraie DB)
// Mot de passe pour tous : "password123"
const users = [
    {
        id: '1',
        email: 'admin@hustel.com',
        password: '$2a$10$8K9V/0j.Zq6u/qS8W7lG0.V.K.Z.B.M.N.T.H.E.M.O.C.K.D.A.T.A', // mock hash for password123
        name: 'Administrateur',
        role: 'owner',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
    },
    {
        id: '2',
        email: 'seller@hustel.com',
        password: '$2a$10$8K9V/0j.Zq6u/qS8W7lG0.V.K.Z.B.M.N.T.H.E.M.O.C.K.D.A.T.A',
        name: 'Vendeur Pro',
        role: 'seller',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller'
    },
    {
        id: '3',
        email: 'client@hustel.com',
        password: '$2a$10$8K9V/0j.Zq6u/qS8W7lG0.V.K.Z.B.M.N.T.H.E.M.O.C.K.D.A.T.A',
        name: 'Client VIP',
        role: 'client',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client'
    }
];

// Helper to find user and compare password
const validateUser = async (email, password) => {
    // Special dev bypass
    if (process.env.NODE_ENV === 'development' && password === 'admin') {
        const devUser = users.find(u => u.email === email) || users[0];
        return devUser;
    }

    const user = users.find(u => u.email === email);
    if (!user) return null;

    // In this mock, we accept 'password123' or whatever matches the hash
    // For simplicity in this demo, let's just allow 'password123'
    if (password === 'password123') return user;

    // const isMatch = await bcrypt.compare(password, user.password);
    // return isMatch ? user : null;
    return null;
};

// Login
router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email et mot de passe requis'
            });
        }

        const user = await validateUser(email, password);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Identifiants invalides'
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'cloud-nexus-secret-key-2024',
            { expiresIn: '7d' }
        );

        // Set Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            user: userWithoutPassword,
            token // Also return token for clients that don't support cookies easily (like mobile)
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la connexion'
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({
        success: true,
        message: 'Déconnexion réussie'
    });
});

// Verify token / Get Current User
router.get('/me', authMiddleware, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json({
        success: true,
        user: userWithoutPassword
    });
});

export default router;
