
import { Request, Response } from 'express';
import { pool } from '../../db/database';
import { jobQueue } from '../../jobs/queue';
import { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Upload dataset file to storage
 */
async function uploadDatasetFile(examples: any[], format: string): Promise<string> {
    // Implement S3/GCS upload
    // For now, return mock URL
    return `s3://datasets/${Date.now()}.${format}`;
}

export class FineTuningController {

    /**
     * Create training dataset
     * POST /api/finetuning/datasets
     */
    static async createDataset(req: AuthRequest, res: Response) {
        try {
            const { name, description, provider, format, examples } = req.body;
            const organizationId = req.user!.organizationId;

            // Store dataset file (S3, GCS, etc.)
            const fileUrl = await uploadDatasetFile(examples, format);

            const result = await pool.query(
                `INSERT INTO training_datasets 
         (name, description, organization_id, provider, format, size_bytes, example_count, file_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
                [
                    name,
                    description,
                    organizationId,
                    provider,
                    format,
                    JSON.stringify(examples).length,
                    examples.length,
                    fileUrl
                ]
            );

            res.status(201).json(result.rows[0]);

        } catch (error) {
            console.error('Create dataset error:', error);
            res.status(500).json({ error: 'Failed to create dataset' });
        }
    }

    /**
     * Start fine-tuning job
     * POST /api/finetuning/jobs
     */
    static async startJob(req: AuthRequest, res: Response) {
        try {
            const {
                name,
                provider,
                baseModel,
                datasetId,
                epochs,
                batchSize,
                learningRate
            } = req.body;

            const organizationId = req.user!.organizationId;

            // Create job record
            const result = await pool.query(
                `INSERT INTO finetuning_jobs 
         (name, organization_id, provider, base_model, dataset_id, epochs, batch_size, learning_rate)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
                [name, organizationId, provider, baseModel, datasetId, epochs, batchSize, learningRate]
            );

            const job = result.rows[0];

            // Add to job queue
            await jobQueue.add('fine-tuning', {
                jobId: job.id,
                provider,
                baseModel,
                datasetId
            });

            res.status(201).json(job);

        } catch (error) {
            console.error('Start fine-tuning error:', error);
            res.status(500).json({ error: 'Failed to start fine-tuning job' });
        }
    }

    /**
     * Get job status
     * GET /api/finetuning/jobs/:id
     */
    static async getJobStatus(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const organizationId = req.user!.organizationId;

            const result = await pool.query(
                `SELECT * FROM finetuning_jobs 
         WHERE id = $1 AND organization_id = $2`,
                [id, organizationId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Job not found' });
            }

            res.json(result.rows[0]);

        } catch (error) {
            console.error('Get job status error:', error);
            res.status(500).json({ error: 'Failed to fetch job status' });
        }
    }

    /**
     * List training datasets
     * GET /api/finetuning/datasets
     */
    static async listDatasets(req: AuthRequest, res: Response) {
        try {
            const organizationId = req.user!.organizationId;
            const result = await pool.query(
                `SELECT * FROM training_datasets 
             WHERE organization_id = $1 
             ORDER BY created_at DESC`,
                [organizationId]
            );
            res.json(result.rows);
        } catch (error) {
            console.error('List datasets error:', error);
            res.status(500).json({ error: 'Failed to fetch datasets' });
        }
    }

    /**
     * Get dataset details
     * GET /api/finetuning/datasets/:id
     */
    static async getDataset(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const organizationId = req.user!.organizationId;
            const result = await pool.query(
                `SELECT * FROM training_datasets 
             WHERE id = $1 AND organization_id = $2`,
                [id, organizationId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Dataset not found' });
            }
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Get dataset error:', error);
            res.status(500).json({ error: 'Failed to fetch dataset' });
        }
    }

    /**
     * Delete dataset
     * DELETE /api/finetuning/datasets/:id
     */
    static async deleteDataset(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const organizationId = req.user!.organizationId;

            // Check if used in any jobs
            const inUse = await pool.query(
                'SELECT id FROM finetuning_jobs WHERE dataset_id = $1 LIMIT 1',
                [id]
            );

            if (inUse.rows.length > 0) {
                return res.status(400).json({ error: 'Dataset is currently being used by a fine-tuning job' });
            }

            const result = await pool.query(
                `DELETE FROM training_datasets 
             WHERE id = $1 AND organization_id = $2
             RETURNING id`,
                [id, organizationId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Dataset not found' });
            }

            res.json({ message: 'Dataset deleted successfully' });
        } catch (error) {
            console.error('Delete dataset error:', error);
            res.status(500).json({ error: 'Failed to delete dataset' });
        }
    }

    /**
     * List fine-tuning jobs
     * GET /api/finetuning/jobs
     */
    static async listJobs(req: AuthRequest, res: Response) {
        try {
            const organizationId = req.user!.organizationId;
            const result = await pool.query(
                `SELECT j.*, d.name as dataset_name 
             FROM finetuning_jobs j
             JOIN training_datasets d ON j.dataset_id = d.id
             WHERE j.organization_id = $1 
             ORDER BY j.created_at DESC`,
                [organizationId]
            );
            res.json(result.rows);
        } catch (error) {
            console.error('List jobs error:', error);
            res.status(500).json({ error: 'Failed to fetch jobs' });
        }
    }

    /**
     * Cancel fine-tuning job
     * POST /api/finetuning/jobs/:id/cancel
     */
    static async cancelJob(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const organizationId = req.user!.organizationId;

            const result = await pool.query(
                `UPDATE finetuning_jobs 
             SET status = 'cancelled', updated_at = NOW()
             WHERE id = $1 AND organization_id = $2 AND status IN ('queued', 'running')
             RETURNING *`,
                [id, organizationId]
            );

            if (result.rows.length === 0) {
                // Check if job exists but wasn't cancellable
                const check = await pool.query(
                    'SELECT status FROM finetuning_jobs WHERE id = $1 AND organization_id = $2',
                    [id, organizationId]
                );
                if (check.rows.length === 0) {
                    return res.status(404).json({ error: 'Job not found' });
                }
                return res.status(400).json({ error: `Cannot cancel job with status: ${check.rows[0].status}` });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Cancel job error:', error);
            res.status(500).json({ error: 'Failed to cancel job' });
        }
    }
}
