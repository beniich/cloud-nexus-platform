import express, { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../../db/database';

// ============================================================================
// AUTHENTICATION MIDDLEWARE (api/middlewares/auth.middleware.ts)
// ============================================================================

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        organizationId: string;
    };
}

/**
 * Verify JWT token
 */
export async function authenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

        // Get user from database
        const result = await pool.query(
            'SELECT id, email, role, organization_id FROM users WHERE id = $1 AND status = $2',
            [decoded.userId, 'active']
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const user = result.rows[0];

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            organizationId: user.organization_id
        };

        next();

    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

/**
 * Check permission
 */
export function requirePermission(permission: string) {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const hasPermission = await checkUserPermission(req.user.id, permission);

        if (!hasPermission) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
}

async function checkUserPermission(userId: string, permission: string): Promise<boolean> {
    // Get user role
    const result = await pool.query(
        'SELECT role FROM users WHERE id = $1',
        [userId]
    );

    if (result.rows.length === 0) return false;

    const role = result.rows[0].role;

    // Owner has all permissions
    if (role === 'owner') return true;

    // Check role permissions (simplified)
    const rolePermissions: Record<string, string[]> = {
        admin: [
            'ab_tests.*', 'finetuning.*', 'webhooks.*', 'users.view', 'users.invite'
        ],
        editor: [
            'ab_tests.create', 'ab_tests.view', 'finetuning.view', 'webhooks.view'
        ],
        viewer: [
            'ab_tests.view', 'finetuning.view', 'webhooks.view'
        ]
    };

    const permissions = rolePermissions[role] || [];

    return permissions.some(p => {
        if (p.endsWith('.*')) {
            return permission.startsWith(p.slice(0, -2));
        }
        return p === permission;
    });
}

/**
 * Rate limiting per user
 */
export async function rateLimitUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    if (!req.user) return next();

    const key = `ratelimit:${req.user.id}:${req.path}`;
    const limit = 100; // requests per minute

    // Use Redis for rate limiting
    const { redisClient } = require('../../db/redis');

    const count = await redisClient.incr(key);

    if (count === 1) {
        await redisClient.expire(key, 60);
    }

    if (count > limit) {
        return res.status(429).json({
            error: 'Too many requests',
            retryAfter: await redisClient.ttl(key)
        });
    }

    next();
}
