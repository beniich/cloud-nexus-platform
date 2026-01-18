// src/services/webhooks/webhook-service.ts

/**
 * Service de gestion des webhooks pour notifications d'événements
 */

export type WebhookEvent =
    | 'test.created'
    | 'test.started'
    | 'test.completed'
    | 'test.failed'
    | 'job.created'
    | 'job.started'
    | 'job.running'
    | 'job.completed'
    | 'job.failed'
    | 'model.deployed'
    | 'dataset.created';

export interface Webhook {
    id: string;
    name: string;
    url: string;
    events: WebhookEvent[];
    active: boolean;
    secret?: string;
    headers?: Record<string, string>;
    retryPolicy: {
        maxRetries: number;
        backoffMultiplier: number;
    };
    metadata: {
        createdBy: string;
        createdAt: string;
        updatedAt: string;
        lastTriggered?: string;
        successCount: number;
        failureCount: number;
    };
}

export interface WebhookPayload {
    event: WebhookEvent;
    timestamp: string;
    data: any;
    metadata: {
        webhookId: string;
        deliveryId: string;
    };
}

export interface WebhookDelivery {
    id: string;
    webhookId: string;
    event: WebhookEvent;
    payload: WebhookPayload;
    status: 'pending' | 'success' | 'failed' | 'retrying';
    attempts: number;
    response?: {
        statusCode: number;
        body: string;
        headers: Record<string, string>;
    };
    error?: string;
    sentAt: string;
    completedAt?: string;
}

export class WebhookService {
    private webhooks: Map<string, Webhook>;
    private deliveries: Map<string, WebhookDelivery>;
    private queue: WebhookDelivery[];

    constructor() {
        this.webhooks = new Map();
        this.deliveries = new Map();
        this.queue = [];
        this.loadWebhooks();
        this.startDeliveryWorker();
    }

    // ============================================================================
    // WEBHOOK MANAGEMENT
    // ============================================================================

    /**
     * Crée un nouveau webhook
     */
    createWebhook(config: {
        name: string;
        url: string;
        events: WebhookEvent[];
        secret?: string;
        headers?: Record<string, string>;
    }): Webhook {
        const webhook: Webhook = {
            id: this.generateId(),
            name: config.name,
            url: config.url,
            events: config.events,
            active: true,
            secret: config.secret,
            headers: config.headers,
            retryPolicy: {
                maxRetries: 3,
                backoffMultiplier: 2
            },
            metadata: {
                createdBy: 'system',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                successCount: 0,
                failureCount: 0
            }
        };

        this.webhooks.set(webhook.id, webhook);
        this.saveWebhooks();

        return webhook;
    }

    /**
     * Met à jour un webhook
     */
    updateWebhook(webhookId: string, updates: Partial<Webhook>): void {
        const webhook = this.webhooks.get(webhookId);
        if (!webhook) throw new Error('Webhook not found');

        Object.assign(webhook, updates);
        webhook.metadata.updatedAt = new Date().toISOString();

        this.saveWebhooks();
    }

    /**
     * Supprime un webhook
     */
    deleteWebhook(webhookId: string): void {
        this.webhooks.delete(webhookId);
        this.saveWebhooks();
    }

    /**
     * Active/Désactive un webhook
     */
    toggleWebhook(webhookId: string, active: boolean): void {
        const webhook = this.webhooks.get(webhookId);
        if (!webhook) throw new Error('Webhook not found');

        webhook.active = active;
        webhook.metadata.updatedAt = new Date().toISOString();

        this.saveWebhooks();
    }

    /**
     * Récupère tous les webhooks
     */
    getAllWebhooks(filter?: { event?: WebhookEvent; active?: boolean }): Webhook[] {
        let webhooks = Array.from(this.webhooks.values());

        if (filter) {
            if (filter.event) {
                webhooks = webhooks.filter(w => w.events.includes(filter.event!));
            }
            if (filter.active !== undefined) {
                webhooks = webhooks.filter(w => w.active === filter.active);
            }
        }

        return webhooks;
    }

    // ============================================================================
    // EVENT TRIGGERING
    // ============================================================================

    /**
     * Déclenche un événement webhook
     */
    async trigger(event: WebhookEvent, data: any): Promise<void> {
        const webhooks = this.getAllWebhooks({ event, active: true });

        if (webhooks.length === 0) {
            console.log(`No active webhooks for event: ${event}`);
            return;
        }

        // Créer les deliveries pour chaque webhook
        for (const webhook of webhooks) {
            const delivery = this.createDelivery(webhook, event, data);
            this.queue.push(delivery);
        }

        // Traiter immédiatement
        await this.processQueue();
    }

    /**
     * Crée une delivery
     */
    private createDelivery(
        webhook: Webhook,
        event: WebhookEvent,
        data: any
    ): WebhookDelivery {
        const deliveryId = this.generateId();

        const payload: WebhookPayload = {
            event,
            timestamp: new Date().toISOString(),
            data,
            metadata: {
                webhookId: webhook.id,
                deliveryId
            }
        };

        const delivery: WebhookDelivery = {
            id: deliveryId,
            webhookId: webhook.id,
            event,
            payload,
            status: 'pending',
            attempts: 0,
            sentAt: new Date().toISOString()
        };

        this.deliveries.set(delivery.id, delivery);
        return delivery;
    }

    /**
     * Traite la queue de deliveries
     */
    private async processQueue(): Promise<void> {
        while (this.queue.length > 0) {
            const delivery = this.queue.shift();
            if (!delivery) break;

            await this.sendWebhook(delivery);
        }
    }

    /**
     * Envoie un webhook
     */
    private async sendWebhook(delivery: WebhookDelivery): Promise<void> {
        const webhook = this.webhooks.get(delivery.webhookId);
        if (!webhook) {
            delivery.status = 'failed';
            delivery.error = 'Webhook not found';
            return;
        }

        delivery.attempts++;
        delivery.status = delivery.attempts > 1 ? 'retrying' : 'pending';

        try {
            // Préparer les headers
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'User-Agent': 'SiteBuilder-Webhook/1.0',
                'X-Webhook-Event': delivery.event,
                'X-Webhook-Delivery': delivery.id,
                ...webhook.headers
            };

            // Ajouter signature si secret présent
            if (webhook.secret) {
                const signature = await this.generateSignature(
                    JSON.stringify(delivery.payload),
                    webhook.secret
                );
                headers['X-Webhook-Signature'] = signature;
            }

            // Envoyer la requête
            const response = await fetch(webhook.url, {
                method: 'POST',
                headers,
                body: JSON.stringify(delivery.payload)
            });

            delivery.response = {
                statusCode: response.status,
                body: await response.text(),
                headers: Object.fromEntries(response.headers.entries())
            };

            if (response.ok) {
                delivery.status = 'success';
                delivery.completedAt = new Date().toISOString();
                webhook.metadata.successCount++;
                webhook.metadata.lastTriggered = new Date().toISOString();
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            delivery.error = error instanceof Error ? error.message : 'Unknown error';
            webhook.metadata.failureCount++;

            // Retry si nécessaire
            if (delivery.attempts < webhook.retryPolicy.maxRetries) {
                delivery.status = 'retrying';

                // Backoff exponentiel
                const delay = 1000 * Math.pow(
                    webhook.retryPolicy.backoffMultiplier,
                    delivery.attempts - 1
                );

                setTimeout(() => {
                    this.queue.push(delivery);
                    this.processQueue();
                }, delay);
            } else {
                delivery.status = 'failed';
                delivery.completedAt = new Date().toISOString();
            }
        }

        this.saveWebhooks();
    }

    /**
     * Génère une signature HMAC pour sécuriser le webhook
     */
    private async generateSignature(payload: string, secret: string): Promise<string> {
        // En production, utiliser crypto.subtle.sign avec HMAC-SHA256
        // Simulation pour l'exemple
        const encoder = new TextEncoder();
        const data = encoder.encode(payload + secret);

        // Simuler un hash
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash = ((hash << 5) - hash) + data[i];
            hash = hash & hash;
        }

        return `sha256=${Math.abs(hash).toString(16)}`;
    }

    // ============================================================================
    // DELIVERY HISTORY
    // ============================================================================

    /**
     * Récupère l'historique des deliveries
     */
    getDeliveries(
        webhookId?: string,
        filter?: {
            event?: WebhookEvent;
            status?: WebhookDelivery['status'];
            limit?: number;
        }
    ): WebhookDelivery[] {
        let deliveries = Array.from(this.deliveries.values());

        if (webhookId) {
            deliveries = deliveries.filter(d => d.webhookId === webhookId);
        }

        if (filter) {
            if (filter.event) {
                deliveries = deliveries.filter(d => d.event === filter.event);
            }
            if (filter.status) {
                deliveries = deliveries.filter(d => d.status === filter.status);
            }
        }

        deliveries.sort((a, b) =>
            new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
        );

        if (filter?.limit) {
            deliveries = deliveries.slice(0, filter.limit);
        }

        return deliveries;
    }

    /**
     * Récupère une delivery spécifique
     */
    getDelivery(deliveryId: string): WebhookDelivery | undefined {
        return this.deliveries.get(deliveryId);
    }

    /**
     * Retry une delivery échouée
     */
    async retryDelivery(deliveryId: string): Promise<void> {
        const delivery = this.deliveries.get(deliveryId);
        if (!delivery) throw new Error('Delivery not found');

        if (delivery.status !== 'failed') {
            throw new Error('Only failed deliveries can be retried');
        }

        // Reset et re-queue
        delivery.status = 'pending';
        delivery.attempts = 0;
        delivery.error = undefined;
        delivery.response = undefined;

        this.queue.push(delivery);
        await this.processQueue();
    }

    // ============================================================================
    // TESTING
    // ============================================================================

    /**
     * Teste un webhook avec un payload fictif
     */
    async testWebhook(webhookId: string): Promise<{
        success: boolean;
        statusCode?: number;
        response?: string;
        error?: string;
    }> {
        const webhook = this.webhooks.get(webhookId);
        if (!webhook) throw new Error('Webhook not found');

        const testPayload: WebhookPayload = {
            event: 'test.created',
            timestamp: new Date().toISOString(),
            data: {
                message: 'This is a test webhook'
            },
            metadata: {
                webhookId: webhook.id,
                deliveryId: 'test_' + this.generateId()
            }
        };

        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'User-Agent': 'SiteBuilder-Webhook/1.0 (Test)',
                ...webhook.headers
            };

            if (webhook.secret) {
                const signature = await this.generateSignature(
                    JSON.stringify(testPayload),
                    webhook.secret
                );
                headers['X-Webhook-Signature'] = signature;
            }

            const response = await fetch(webhook.url, {
                method: 'POST',
                headers,
                body: JSON.stringify(testPayload)
            });

            return {
                success: response.ok,
                statusCode: response.status,
                response: await response.text()
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // ============================================================================
    // STATISTICS
    // ============================================================================

    /**
     * Récupère les statistiques d'un webhook
     */
    getWebhookStats(webhookId: string): {
        totalDeliveries: number;
        successRate: number;
        avgResponseTime: number;
        recentDeliveries: WebhookDelivery[];
        errorRate: number;
    } {
        const webhook = this.webhooks.get(webhookId);
        if (!webhook) throw new Error('Webhook not found');

        const deliveries = this.getDeliveries(webhookId);
        const total = deliveries.length;
        const successful = deliveries.filter(d => d.status === 'success').length;

        return {
            totalDeliveries: total,
            successRate: total > 0 ? (successful / total) * 100 : 0,
            avgResponseTime: 0, // À implémenter avec timestamps
            recentDeliveries: deliveries.slice(0, 10),
            errorRate: total > 0 ? ((total - successful) / total) * 100 : 0
        };
    }

    /**
     * Récupère les statistiques globales
     */
    getGlobalStats(): {
        totalWebhooks: number;
        activeWebhooks: number;
        totalDeliveries: number;
        successRate: number;
        topEvents: Array<{ event: WebhookEvent; count: number }>;
    } {
        const webhooks = Array.from(this.webhooks.values());
        const deliveries = Array.from(this.deliveries.values());

        const eventCounts = new Map<WebhookEvent, number>();
        deliveries.forEach(d => {
            eventCounts.set(d.event, (eventCounts.get(d.event) || 0) + 1);
        });

        const topEvents = Array.from(eventCounts.entries())
            .map(([event, count]) => ({ event, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const successful = deliveries.filter(d => d.status === 'success').length;

        return {
            totalWebhooks: webhooks.length,
            activeWebhooks: webhooks.filter(w => w.active).length,
            totalDeliveries: deliveries.length,
            successRate: deliveries.length > 0 ? (successful / deliveries.length) * 100 : 0,
            topEvents
        };
    }

    // ============================================================================
    // WORKER
    // ============================================================================

    /**
     * Démarre le worker de delivery
     */
    private startDeliveryWorker(): void {
        // Traiter la queue toutes les 5 secondes
        setInterval(() => {
            if (this.queue.length > 0) {
                this.processQueue();
            }
        }, 5000);
    }

    // ============================================================================
    // PERSISTENCE
    // ============================================================================

    private loadWebhooks(): void {
        try {
            const stored = localStorage.getItem('webhooks');
            if (stored) {
                this.webhooks = new Map(Object.entries(JSON.parse(stored)));
            }

            const storedDeliveries = localStorage.getItem('webhook_deliveries');
            if (storedDeliveries) {
                this.deliveries = new Map(Object.entries(JSON.parse(storedDeliveries)));
            }
        } catch (error) {
            console.error('Failed to load webhooks:', error);
        }
    }

    private saveWebhooks(): void {
        try {
            const data = Object.fromEntries(this.webhooks);
            localStorage.setItem('webhooks', JSON.stringify(data));

            const deliveriesData = Object.fromEntries(this.deliveries);
            localStorage.setItem('webhook_deliveries', JSON.stringify(deliveriesData));
        } catch (error) {
            console.error('Failed to save webhooks:', error);
        }
    }

    private generateId(): string {
        return `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

export default WebhookService;
