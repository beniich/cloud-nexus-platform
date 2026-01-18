
import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';
import { authenticate, requirePermission } from '../middlewares/auth.middleware';

const webhookRouter = Router();

webhookRouter.use(authenticate);

webhookRouter.post('/',
  requirePermission('webhooks.create'),
  WebhookController.create
);

webhookRouter.get('/',
  requirePermission('webhooks.view'),
  WebhookController.list
);

webhookRouter.get('/:id',
  requirePermission('webhooks.view'),
  WebhookController.getById
);

webhookRouter.patch('/:id',
  requirePermission('webhooks.edit'),
  WebhookController.update
);

webhookRouter.delete('/:id',
  requirePermission('webhooks.delete'),
  WebhookController.delete
);

webhookRouter.post('/:id/test',
  requirePermission('webhooks.test'),
  WebhookController.test
);

webhookRouter.get('/:id/deliveries',
  requirePermission('webhooks.view'),
  WebhookController.getDeliveries
);

export { webhookRouter };
