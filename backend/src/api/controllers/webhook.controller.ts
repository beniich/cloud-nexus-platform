
import { Request, Response } from 'express';
import { pool } from '../../db/database';
import { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Send webhook HTTP request
 */
async function sendWebhookRequest(webhook: any, payload: any) {
    const headers: any = {
        'Content-Type': 'application/json',
        'User-Agent': 'AI-SiteBuilder-Webhook/1.0',
        'X-Webhook-Event': payload.event
    };

    if (webhook.secret) {
        // Generate HMAC signature
        const crypto = awaitimport('crypto');
        const signature = crypto
            .createHmac('sha256', webhook.secret)
            .update(JSON.stringify(payload))
            .digest('hex');

        headers['X-Webhook-Signature'] = `sha256=${signature}`;
    }

    return fetch(webhook.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });
}

export class WebhookController {

    /**
     * Create webhook
     * POST /api/webhooks
     */
    static async create(req: AuthRequest, res: Response) {
        try {
            const { name, url, events, secret } = req.body;
            const organizationId = req.user!.organizationId;

            const result = await pool.query(
                `INSERT INTO webhooks (name, organization_id, url, events, secret)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
                [name, organizationId, url, JSON.stringify(events), secret]
            );

            res.status(201).json(result.rows[0]);

        } catch (error) {
            console.error('Create webhook error:', error);
            res.status(500).json({ error: 'Failed to create webhook' });
        }
    }

    /**
     * Test webhook
     * POST /api/webhooks/:id/test
     */
    static async test(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const organizationId = req.user!.organizationId;

            const result = await pool.query(
                `SELECT * FROM webhooks WHERE id = $1 AND organization_id = $2`,
                [id, organizationId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Webhook not found' });
            }

            const webhook = result.rows[0];

            // Send test payload
            const testPayload = {
                event: 'test.webhook',
                timestamp: new Date().toISOString(),
                data: { message: 'This is a test webhook' }
            };

            const response = await sendWebhookRequest(webhook, testPayload);

            res.json({
                success: response.ok,
                statusCode: response.status,
                message: response.ok ? 'Webhook test successful' : 'Webhook test failed'
            });

        } catch (error) {
            console.error('Test webhook error:', error);
            res.status(500).json({ error: 'Failed to test webhook' });
        }
    }

    /**
     * List webhooks
     * GET /api/webhooks
     */
    static async list(req: AuthRequest, res: Response) {
        try {
            const organizationId = req.user!.organizationId;
            const result = await pool.query(
                `SELECT * FROM webhooks 
         WHERE organization_id = $1 
         ORDER BY created_at DESC`,
                [organizationId]
            );
            res.json(result.rows);
        } catch (error) {
            console.error('List webhooks error:', error);
            res.status(500).json({ error: 'Failed to fetch webhooks' });
        }
    }

    /**
     * Get webhook by ID
     * GET /api/webhooks/:id
     */
    static async getById(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const organizationId = req.user!.organizationId;
            const result = await pool.query(
                `SELECT * FROM webhooks 
         WHERE id = $1 AND organization_id = $2`,
                [id, organizationId]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Webhook not found' });
            }
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Get webhook error:', error);
            res.status(500).json({ error: 'Failed to fetch webhook' });
        }
    }

    /**
     * Update webhook
     * PATCH /api/webhooks/:id
     */
    static async update(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { name, url, events, active, secret } = req.body;
            const organizationId = req.user!.organizationId;

            // Build dynamic update query
            const fields: string[] = [];
            const values: any[] = [];
            let idx = 1;

            if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name); }
            if (url !== undefined) { fields.push(`url = $${idx++}`); values.push(url); }
            if (events !== undefined) { fields.push(`events = $${idx++}::jsonb`); values.push(JSON.stringify(events)); }
            if (active !== undefined) { fields.push(`active = $${idx++}`); values.push(active); }
            if (secret !== undefined) { fields.push(`secret = $${idx++}`); values.push(secret); }

            fields.push(`updated_at = NOW()`);

            if (fields.length === 1) { // only updated_at
                return res.status(400).json({ error: 'No fields to update' });
            }

            values.push(id);
            values.push(organizationId);

            const result = await pool.query(
                `UPDATE webhooks 
         SET ${fields.join(', ')} 
         WHERE id = $${idx++} AND organization_id = $${idx++}
         RETURNING *`,
                values
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Webhook not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Update webhook error:', error);
            res.status(500).json({ error: 'Failed to update webhook' });
        }
    }

    /**
     * Delete webhook
     * DELETE /api/webhooks/:id
     */
    static async delete(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const organizationId = req.user!.organizationId;
            const result = await pool.query(
                `DELETE FROM webhooks 
         WHERE id = $1 AND organization_id = $2
         RETURNING id`,
                [id, organizationId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Webhook not found' });
            }

            res.json({ message: 'Webhook deleted successfully' });
        } catch (error) {
            console.error('Delete webhook error:', error);
            res.status(500).json({ error: 'Failed to delete webhook' });
        }
    }

    /**
     * Get webhook delivery history
     * GET /api/webhooks/:id/deliveries
     */
    static async getDeliveries(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const organizationId = req.user!.organizationId;

            // Ensure webhook belongs to user
            const webhook = await pool.query(
                'SELECT id FROM webhooks WHERE id = $1 AND organization_id = $2',
                [id, organizationId]
            );

            if (webhook.rows.length === 0) {
                return res.status(404).json({ error: 'Webhook not found' });
            }

            const result = await pool.query(
                `SELECT * FROM webhook_deliveries 
         WHERE webhook_id = $1 
         ORDER BY created_at DESC 
         LIMIT 50`,
                [id]
            );

            res.json(result.rows);
        } catch (error) {
            console.error('Get webhook deliveries error:', error);
            res.status(500).json({ error: 'Failed to fetch webhook deliveries' });
        }
    }
}
