
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../../db/database';
import { authenticate, requirePermission, AuthRequest } from '../middlewares/auth.middleware';

const userRouter = Router();

userRouter.use(authenticate);

/**
 * List users in organization
 */
userRouter.get('/', requirePermission('users.view'), async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT id, email, name, role, status, created_at, last_login
       FROM users
       WHERE organization_id = $1
       ORDER BY created_at DESC`,
            [req.user!.organizationId]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('List users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

/**
 * Invite user
 */
userRouter.post('/invite', requirePermission('users.invite'), async (req: AuthRequest, res: Response) => {
    try {
        const { email, role } = req.body;
        const organizationId = req.user!.organizationId;

        // Check if email exists
        const existing = await pool.query(
            'SELECT id FROM users WHERE email = $1 AND organization_id = $2',
            [email, organizationId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create invitation token
        const inviteToken = jwt.sign(
            { email, role, organizationId, invitedBy: req.user!.id },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        // Send invitation email (implement email service)
        // await sendInvitationEmail(email, inviteToken);

        res.json({
            message: 'Invitation sent',
            inviteLink: `${process.env.FRONTEND_URL}/accept-invite?token=${inviteToken}`
        });

    } catch (error) {
        console.error('Invite user error:', error);
        res.status(500).json({ error: 'Failed to send invitation' });
    }
});

/**
 * Update user role
 */
userRouter.patch('/:id/role',
    requirePermission('users.manage_roles'),
    async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { role } = req.body;

            const result = await pool.query(
                `UPDATE users 
         SET role = $1, updated_at = NOW()
         WHERE id = $2 AND organization_id = $3
         RETURNING *`,
                [role, id, req.user!.organizationId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(result.rows[0]);

        } catch (error) {
            console.error('Update role error:', error);
            res.status(500).json({ error: 'Failed to update role' });
        }
    }
);

/**
 * Delete user
 */
userRouter.delete('/:id',
    requirePermission('users.delete'),
    async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;

            // Prevent deleting owner
            const userCheck = await pool.query(
                'SELECT role FROM users WHERE id = $1',
                [id]
            );

            if (userCheck.rows[0]?.role === 'owner') {
                return res.status(400).json({ error: 'Cannot delete organization owner' });
            }

            await pool.query(
                'DELETE FROM users WHERE id = $1 AND organization_id = $2',
                [id, req.user!.organizationId]
            );

            res.json({ message: 'User deleted' });

        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }
);

export { userRouter };
