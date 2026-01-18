
import { Router } from 'express';
import { FineTuningController } from '../controllers/finetuning.controller';
import { authenticate, requirePermission } from '../middlewares/auth.middleware';

const fineTuningRouter = Router();

fineTuningRouter.use(authenticate);

// Datasets
fineTuningRouter.post('/datasets',
    requirePermission('finetuning.create_dataset'),
    FineTuningController.createDataset
);

fineTuningRouter.get('/datasets',
    requirePermission('finetuning.view_dataset'),
    FineTuningController.listDatasets
);

fineTuningRouter.get('/datasets/:id',
    requirePermission('finetuning.view_dataset'),
    FineTuningController.getDataset
);

fineTuningRouter.delete('/datasets/:id',
    requirePermission('finetuning.delete_dataset'),
    FineTuningController.deleteDataset
);

// Jobs
fineTuningRouter.post('/jobs',
    requirePermission('finetuning.start_job'),
    FineTuningController.startJob
);

fineTuningRouter.get('/jobs',
    requirePermission('finetuning.view_job'),
    FineTuningController.listJobs
);

fineTuningRouter.get('/jobs/:id',
    requirePermission('finetuning.view_job'),
    FineTuningController.getJobStatus
);

fineTuningRouter.post('/jobs/:id/cancel',
    requirePermission('finetuning.cancel_job'),
    FineTuningController.cancelJob
);

export { fineTuningRouter };
