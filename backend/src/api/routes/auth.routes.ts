
import express, { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../../db/database';
import { authenticate, AuthRequest } from '../middlewares/auth.middleware';

const authRouter = Router();

/**
 * Register new user
 * POST /api/auth/register
 */
authRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, name, password, organizationName } = req.body;

        // Validate input
        if (!email || !name || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user exists
        const existing = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Start transaction
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Create organization
            const orgResult = await client.query(
                `INSERT INTO organizations (name, plan, max_users, features)
         VALUES ($1, 'free', 1, '["ab_tests", "basic_analytics"]')
         RETURNING *`,
                [organizationName || `${name}'s Organization`]
            );

            const organization = orgResult.rows[0];

            // Create user
            const userResult = await client.query(
                `INSERT INTO users (email, name, password_hash, role, organization_id, status)
         VALUES ($1, $2, $3, 'owner', $4, 'active')
         RETURNING id, email, name, role, organization_id`,
                [email, name, passwordHash, organization.id]
            );

            const user = userResult.rows[0];

            // Update organization owner
            await client.query(
                'UPDATE organizations SET owner_id = $1 WHERE id = $2',
                [user.id, organization.id]
            );

            await client.query('COMMIT');

            // Generate JWT
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET!,
                { expiresIn: '7d' }
            );

            res.status(201).json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                organization,
                token
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

/**
 * Login
 * POST /api/auth/login
 */
authRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Get user
        const result = await pool.query(
            `SELECT id, email, name, password_hash, role, organization_id, status
       FROM users WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        if (user.status !== 'active') {
            return res.status(401).json({ error: 'Account is not active' });
        }

        // Verify password
        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await pool.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [user.id]
        );

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                organizationId: user.organization_id
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * Get current user
 * GET /api/auth/me
 */
authRouter.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT 
         u.id, u.email, u.name, u.role, u.organization_id,
         o.name as organization_name, o.plan
       FROM users u
       JOIN organizations o ON o.id = u.organization_id
       WHERE u.id = $1`,
            [req.user!.id]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

/**
 * Logout (invalidate token)
 * POST /api/auth/logout
 */
authRouter.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
    // In a production app, you might:
    // 1. Blacklist the token in Redis
    // 2. Store token revocation list
    // 3. Use short-lived tokens with refresh tokens

    res.json({ message: 'Logged out successfully' });
});

export default authRouter;
