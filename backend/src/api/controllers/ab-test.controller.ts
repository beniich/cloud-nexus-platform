
import { Request, Response } from 'express';
import { pool } from '../../db/database';
import { getCache, setCache, delCache } from '../../db/redis';
import { AuthRequest } from '../middlewares/auth.middleware';
import { webhookQueue } from '../../jobs/queue';

// Temporary helper until WebhookController is fully defined or imported if circular dep allows
// In a real app, this might be a service method.
async function triggerWebhook(organizationId: string, event: string, data: any) {
    try {
        // Get all active webhooks for this event
        const result = await pool.query(
            `SELECT * FROM webhooks 
       WHERE organization_id = $1 
       AND active = true 
       AND events @> $2::jsonb`,
            [organizationId, JSON.stringify([event])]
        );

        // Queue webhook deliveries
        for (const webhook of result.rows) {
            await webhookQueue.add('deliver-webhook', {
                webhookId: webhook.id,
                event,
                data
            });
        }

    } catch (error) {
        console.error('Trigger webhook error:', error);
    }
}

export class ABTestController {

    /**
     * Create new A/B test
     * POST /api/ab-tests
     */
    static async create(req: AuthRequest, res: Response) {
        try {
            const { name, description, category, variants, targetSampleSize } = req.body;
            const organizationId = req.user!.organizationId;

            // Start transaction
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                // Create test
                const testResult = await client.query(
                    `INSERT INTO ab_tests (name, description, category, organization_id, target_sample_size)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
                    [name, description, category, organizationId, targetSampleSize]
                );

                const test = testResult.rows[0];

                // Create variants
                const variantPromises = variants.map((v: any) =>
                    client.query(
                        `INSERT INTO ab_variants (test_id, name, prompt, system_prompt, weight)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
                        [test.id, v.name, v.prompt, v.systemPrompt, v.weight]
                    )
                );

                const variantResults = await Promise.all(variantPromises);

                await client.query('COMMIT');

                // Clear cache
                await delCache(`org:${organizationId}:ab-tests`);

                res.status(201).json({
                    test,
                    variants: variantResults.map(r => r.rows[0])
                });

            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }

        } catch (error) {
            console.error('Create AB test error:', error);
            res.status(500).json({ error: 'Failed to create A/B test' });
        }
    }

    /**
     * Get all A/B tests for organization
     * GET /api/ab-tests
     */
    static async list(req: AuthRequest, res: Response) {
        try {
            const organizationId = req.user!.organizationId;
            const { status } = req.query;

            // Try cache first
            const cacheKey = `org:${organizationId}:ab-tests:${status || 'all'}`;
            const cached = await getCache(cacheKey);
            if (cached) {
                return res.json(cached);
            }

            let query = `
        SELECT 
          t.*,
          json_agg(
            json_build_object(
              'id', v.id,
              'name', v.name,
              'impressions', v.impressions,
              'successCount', v.success_count,
              'avgRating', v.avg_rating
            )
          ) as variants
        FROM ab_tests t
        LEFT JOIN ab_variants v ON v.test_id = t.id
        WHERE t.organization_id = $1
      `;

            const params: any[] = [organizationId];

            if (status) {
                query += ` AND t.status = $2`;
                params.push(status);
            }

            query += ` GROUP BY t.id ORDER BY t.created_at DESC`;

            const result = await pool.query(query, params);

            // Cache for 5 minutes
            await setCache(cacheKey, result.rows, 300);

            res.json(result.rows);

        } catch (error) {
            console.error('List AB tests error:', error);
            res.status(500).json({ error: 'Failed to fetch A/B tests' });
        }
    }

    /**
     * Start A/B test
     * POST /api/ab-tests/:id/start
     */
    static async start(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const organizationId = req.user!.organizationId;

            const result = await pool.query(
                `UPDATE ab_tests 
         SET status = 'running', start_date = NOW(), updated_at = NOW()
         WHERE id = $1 AND organization_id = $2
         RETURNING *`,
                [id, organizationId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Test not found' });
            }

            // Clear cache
            await delCache(`org:${organizationId}:ab-tests`);

            // Trigger webhook
            await triggerWebhook(organizationId, 'test.started', { test: result.rows[0] });

            res.json(result.rows[0]);

        } catch (error) {
            console.error('Start AB test error:', error);
            res.status(500).json({ error: 'Failed to start A/B test' });
        }
    }

    /**
     * Get A/B test by ID
     * GET /api/ab-tests/:id
     */
    static async getById(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const organizationId = req.user!.organizationId;

            const result = await pool.query(
                `SELECT 
          t.*,
          json_agg(
            json_build_object(
              'id', v.id,
              'name', v.name,
              'prompt', v.prompt,
              'systemPrompt', v.system_prompt,
              'weight', v.weight,
              'impressions', v.impressions,
              'successCount', v.success_count,
              'avgRating', v.avg_rating
            )
          ) as variants
        FROM ab_tests t
        LEFT JOIN ab_variants v ON v.test_id = t.id
        WHERE t.id = $1 AND t.organization_id = $2
        GROUP BY t.id`,
                [id, organizationId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Test not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Get AB test error:', error);
            res.status(500).json({ error: 'Failed to fetch A/B test' });
        }
    }

    /**
     * Pause A/B test
     * POST /api/ab-tests/:id/pause
     */
    static async pause(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const organizationId = req.user!.organizationId;

            const result = await pool.query(
                `UPDATE ab_tests 
         SET status = 'paused', updated_at = NOW()
         WHERE id = $1 AND organization_id = $2
         RETURNING *`,
                [id, organizationId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Test not found' });
            }

            await delCache(`org:${organizationId}:ab-tests`);
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Pause AB test error:', error);
            res.status(500).json({ error: 'Failed to pause A/B test' });
        }
    }

    /**
     * Complete A/B test
     * POST /api/ab-tests/:id/complete
     */
    static async complete(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { winnerId } = req.body; // Optional: manually set winner
            const organizationId = req.user!.organizationId;

            // Ensure test exists and belongs to org
            const check = await pool.query(
                'SELECT id FROM ab_tests WHERE id = $1 AND organization_id = $2',
                [id, organizationId]
            );

            if (check.rows.length === 0) {
                return res.status(404).json({ error: 'Test not found' });
            }

            // If no winner specified, calculate one based on highest success rate
            let winnerVariantId = winnerId;
            if (!winnerVariantId) {
                const variants = await pool.query(
                    `SELECT id, success_count::float / NULLIF(impressions, 0) as rate 
              FROM ab_variants WHERE test_id = $1 ORDER BY rate DESC LIMIT 1`,
                    [id]
                );
                if (variants.rows.length > 0) {
                    winnerVariantId = variants.rows[0].id;
                }
            }

            const result = await pool.query(
                `UPDATE ab_tests 
         SET status = 'completed', end_date = NOW(), winner_variant_id = $3, updated_at = NOW()
         WHERE id = $1 AND organization_id = $2
         RETURNING *`,
                [id, organizationId, winnerVariantId]
            );

            await delCache(`org:${organizationId}:ab-tests`);

            // Trigger webhook
            await triggerWebhook(organizationId, 'test.completed', { test: result.rows[0] });

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Complete AB test error:', error);
            res.status(500).json({ error: 'Failed to complete A/B test' });
        }
    }

    /**
     * Delete A/B test
     * DELETE /api/ab-tests/:id
     */
    static async delete(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const organizationId = req.user!.organizationId;

            const result = await pool.query(
                `DELETE FROM ab_tests 
         WHERE id = $1 AND organization_id = $2
         RETURNING id`,
                [id, organizationId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Test not found' });
            }

            await delCache(`org:${organizationId}:ab-tests`);
            res.json({ message: 'Test deleted successfully' });
        } catch (error) {
            console.error('Delete AB test error:', error);
            res.status(500).json({ error: 'Failed to delete A/B test' });
        }
    }

    /**
     * Select variant for test
     * POST /api/ab-tests/:id/select-variant
     */
    static async selectVariant(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Get variants with weights
            const result = await pool.query(
                `SELECT * FROM ab_variants WHERE test_id = $1`,
                [id]
            );

            const variants = result.rows;
            const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
            const random = Math.random() * totalWeight;

            let cumulative = 0;
            let selected = variants[0];

            for (const variant of variants) {
                cumulative += variant.weight;
                if (random <= cumulative) {
                    selected = variant;
                    break;
                }
            }

            res.json(selected);

        } catch (error) {
            console.error('Select variant error:', error);
            res.status(500).json({ error: 'Failed to select variant' });
        }
    }

    /**
     * Record result for variant
     * POST /api/ab-tests/:id/record
     */
    static async recordResult(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { variantId, success, rating, responseTime, tokens } = req.body;

            await pool.query(
                `UPDATE ab_variants 
         SET 
           impressions = impressions + 1,
           success_count = success_count + $1,
           failure_count = failure_count + $2,
           avg_rating = (avg_rating * impressions + $3) / (impressions + 1),
           avg_response_time = (avg_response_time * impressions + $4) / (impressions + 1),
           avg_tokens = (avg_tokens * impressions + $5) / (impressions + 1)
         WHERE id = $6`,
                [
                    success ? 1 : 0,
                    success ? 0 : 1,
                    rating || 0,
                    responseTime,
                    tokens,
                    variantId
                ]
            );

            // Increment test sample size
            await pool.query(
                `UPDATE ab_tests 
         SET current_sample_size = current_sample_size + 1
         WHERE id = $1`,
                [id]
            );

            res.json({ success: true });

        } catch (error) {
            console.error('Record result error:', error);
            res.status(500).json({ error: 'Failed to record result' });
        }
    }
}
