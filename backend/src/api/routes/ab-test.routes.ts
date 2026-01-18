
import { Router } from 'express';
import { ABTestController } from '../controllers/ab-test.controller';
import { authenticate, requirePermission, rateLimitUser } from '../middlewares/auth.middleware';

const abTestRouter = Router();

// All routes require authentication
abTestRouter.use(authenticate);

abTestRouter.post('/',
    requirePermission('ab_tests.create'),
    ABTestController.create
);

abTestRouter.get('/',
    requirePermission('ab_tests.view'),
    ABTestController.list
);

abTestRouter.get('/:id',
    requirePermission('ab_tests.view'),
    ABTestController.getById
);

abTestRouter.post('/:id/start',
    requirePermission('ab_tests.start'),
    ABTestController.start
);

abTestRouter.post('/:id/pause',
    requirePermission('ab_tests.pause'),
    ABTestController.pause
);

abTestRouter.post('/:id/complete',
    requirePermission('ab_tests.start'),
    ABTestController.complete
);

abTestRouter.post('/:id/select-variant',
    requirePermission('ab_tests.view'),
    ABTestController.selectVariant
);

abTestRouter.post('/:id/record',
    requirePermission('ab_tests.view'),
    rateLimitUser,
    ABTestController.recordResult
);

abTestRouter.delete('/:id',
    requirePermission('ab_tests.delete'),
    ABTestController.delete
);

export { abTestRouter };
