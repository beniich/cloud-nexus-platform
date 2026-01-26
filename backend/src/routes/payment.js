
// ============================================================
// STRIPE PAYMENT SERVICE
// Subscriptions, One-time payments, Webhooks, Invoices
// ============================================================

import Stripe from 'stripe';
import express from 'express';
// @ts-ignore
import { PrismaClient } from '@prisma/client';
import { emailService } from './email.js';

const router = express.Router();
const prisma = new PrismaClient();

// Initialize Stripe if key exists, otherwise warn
const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

if (!stripe) {
    console.warn('⚠️ STRIPE_SECRET_KEY not found in environment variables. Payment features will be disabled.');
}

// ============================================================
// PRICING PLANS
// ============================================================

export const PRICING_PLANS = {
    STARTER: {
        id: 'starter',
        name: 'Starter',
        price: 9.99,
        interval: 'month',
        features: [
            '5 AI-generated sites',
            '1GB storage',
            'Basic analytics',
            'Email support'
        ],
        stripePriceId: process.env.STRIPE_PRICE_STARTER
    },
    PRO: {
        id: 'pro',
        name: 'Pro',
        price: 29.99,
        interval: 'month',
        features: [
            'Unlimited AI sites',
            '10GB storage',
            'Advanced analytics',
            'Priority support',
            'Custom domains',
            'White-label'
        ],
        stripePriceId: process.env.STRIPE_PRICE_PRO
    },
    ENTERPRISE: {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99.99,
        interval: 'month',
        features: [
            'Everything in Pro',
            '100GB storage',
            'Dedicated support',
            'Custom integrations',
            'SLA guarantee',
            'Team collaboration'
        ],
        stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE
    }
};

// ============================================================
// PAYMENT SERVICE CLASS
// ============================================================

export class PaymentService {

    /**
     * Create Stripe customer for user
     */
    async createCustomer(user) {
        if (!stripe) throw new Error('Stripe not configured');
        try {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user.id
                }
            });

            await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId: customer.id }
            });

            console.log(`✅ Stripe customer created: ${customer.id}`);
            return customer;

        } catch (error) {
            console.error('Failed to create Stripe customer:', error);
            throw error;
        }
    }

    /**
     * Create checkout session for subscription
     */
    async createCheckoutSession(userId, planId, successUrl, cancelUrl) {
        if (!stripe) throw new Error('Stripe not configured');
        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });

            // Ensure customer exists
            let customerId = user.stripeCustomerId;
            if (!customerId) {
                const customer = await this.createCustomer(user);
                customerId = customer.id;
            }

            const plan = PRICING_PLANS[planId.toUpperCase()];
            if (!plan) {
                throw new Error('Invalid plan ID');
            }

            const session = await stripe.checkout.sessions.create({
                customer: customerId,
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [{
                    price: plan.stripePriceId,
                    quantity: 1
                }],
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata: {
                    userId,
                    planId
                },
                subscription_data: {
                    metadata: {
                        userId,
                        planId
                    }
                },
                billing_address_collection: 'required',
                allow_promotion_codes: true
            });

            console.log(`✅ Checkout session created: ${session.id}`);
            return session;

        } catch (error) {
            console.error('Checkout session error:', error);
            throw error;
        }
    }

    /**
     * Create one-time payment for credits/add-ons
     */
    async createOneTimePayment(userId, amount, description, successUrl, cancelUrl) {
        if (!stripe) throw new Error('Stripe not configured');
        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });

            let customerId = user.stripeCustomerId;
            if (!customerId) {
                const customer = await this.createCustomer(user);
                customerId = customer.id;
            }

            const session = await stripe.checkout.sessions.create({
                customer: customerId,
                mode: 'payment',
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: description
                        },
                        unit_amount: Math.round(amount * 100) // Convert to cents
                    },
                    quantity: 1
                }],
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata: {
                    userId,
                    type: 'one_time'
                }
            });

            return session;

        } catch (error) {
            console.error('One-time payment error:', error);
            throw error;
        }
    }

    /**
     * Get customer portal URL for managing subscription
     */
    async createPortalSession(userId, returnUrl) {
        if (!stripe) throw new Error('Stripe not configured');
        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });

            if (!user.stripeCustomerId) {
                throw new Error('No Stripe customer found');
            }

            const session = await stripe.billingPortal.sessions.create({
                customer: user.stripeCustomerId,
                return_url: returnUrl
            });

            return session;

        } catch (error) {
            console.error('Portal session error:', error);
            throw error;
        }
    }

    /**
     * Cancel subscription
     */
    async cancelSubscription(subscriptionId) {
        if (!stripe) throw new Error('Stripe not configured');
        try {
            const subscription = await stripe.subscriptions.cancel(subscriptionId);

            await prisma.subscription.update({
                where: { stripeSubscriptionId: subscriptionId },
                data: {
                    status: 'CANCELLED',
                    cancelledAt: new Date()
                }
            });

            console.log(`✅ Subscription cancelled: ${subscriptionId}`);
            return subscription;

        } catch (error) {
            console.error('Cancel subscription error:', error);
            throw error;
        }
    }

    /**
     * Upgrade/Downgrade subscription
     */
    async updateSubscription(subscriptionId, newPlanId) {
        if (!stripe) throw new Error('Stripe not configured');
        try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const newPlan = PRICING_PLANS[newPlanId.toUpperCase()];

            const updated = await stripe.subscriptions.update(subscriptionId, {
                items: [{
                    id: subscription.items.data[0].id,
                    price: newPlan.stripePriceId
                }],
                proration_behavior: 'create_prorations'
            });

            await prisma.subscription.update({
                where: { stripeSubscriptionId: subscriptionId },
                data: {
                    planId: newPlanId,
                    updatedAt: new Date()
                }
            });

            console.log(`✅ Subscription updated to ${newPlanId}`);
            return updated;

        } catch (error) {
            console.error('Update subscription error:', error);
            throw error;
        }
    }

    /**
     * Handle webhook events
     */
    async handleWebhook(event) {
        try {
            console.log(`📥 Webhook received: ${event.type}`);

            switch (event.type) {
                case 'checkout.session.completed':
                    await this.handleCheckoutCompleted(event.data.object);
                    break;

                case 'customer.subscription.created':
                    await this.handleSubscriptionCreated(event.data.object);
                    break;

                case 'customer.subscription.updated':
                    await this.handleSubscriptionUpdated(event.data.object);
                    break;

                case 'customer.subscription.deleted':
                    await this.handleSubscriptionDeleted(event.data.object);
                    break;

                case 'invoice.paid':
                    await this.handleInvoicePaid(event.data.object);
                    break;

                case 'invoice.payment_failed':
                    await this.handlePaymentFailed(event.data.object);
                    break;

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

        } catch (error) {
            console.error('Webhook handler error:', error);
            throw error;
        }
    }

    /**
     * Handle successful checkout
     */
    async handleCheckoutCompleted(session) {
        const userId = session.metadata.userId;
        const planId = session.metadata.planId;

        if (session.mode === 'subscription') {
            // Subscription will be handled by subscription.created event
            console.log(`Checkout completed for user ${userId}`);
        } else {
            // One-time payment
            await prisma.payment.create({
                data: {
                    userId,
                    stripePaymentId: session.payment_intent,
                    amount: session.amount_total / 100,
                    status: 'PAID',
                    type: 'ONE_TIME'
                }
            });

            // Send receipt email
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (emailService) {
                await emailService.send({
                    to: user.email,
                    subject: 'Payment Receipt - Cloud Nexus',
                    html: `<h1>Payment Received</h1><p>Amount: $${session.amount_total / 100}</p>`,
                    userId
                });
            }
        }
    }

    /**
     * Handle new subscription
     */
    async handleSubscriptionCreated(subscription) {
        const userId = subscription.metadata.userId;
        const planId = subscription.metadata.planId;

        await prisma.subscription.create({
            data: {
                userId,
                stripeSubscriptionId: subscription.id,
                planId,
                status: subscription.status.toUpperCase(),
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000)
            }
        });

        // Update user plan
        await prisma.user.update({
            where: { id: userId },
            data: { currentPlan: planId }
        });

        // Send confirmation email
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const plan = PRICING_PLANS[planId.toUpperCase()];

        if (emailService) {
            await emailService.send({
                to: user.email,
                subject: `Welcome to ${plan.name}!`,
                html: `<h1>Subscription Active</h1><p>Your ${plan.name} plan is now active.</p>`,
                userId
            });
        }

        console.log(`✅ Subscription created for user ${userId}`);
    }

    /**
     * Handle subscription update
     */
    async handleSubscriptionUpdated(subscription) {
        await prisma.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
                status: subscription.status.toUpperCase(),
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000)
            }
        });
    }

    /**
     * Handle subscription cancellation
     */
    async handleSubscriptionDeleted(subscription) {
        const userId = subscription.metadata.userId;

        await prisma.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date()
            }
        });

        // Downgrade to free plan
        await prisma.user.update({
            where: { id: userId },
            data: { currentPlan: 'FREE' }
        });

        console.log(`✅ Subscription cancelled for user ${userId}`);
    }

    /**
     * Handle successful invoice payment
     */
    async handleInvoicePaid(invoice) {
        await prisma.payment.create({
            data: {
                userId: invoice.customer_metadata?.userId,
                stripePaymentId: invoice.payment_intent,
                amount: invoice.amount_paid / 100,
                status: 'PAID',
                type: 'SUBSCRIPTION',
                invoiceUrl: invoice.hosted_invoice_url
            }
        });

        console.log(`✅ Invoice paid: ${invoice.id}`);
    }

    /**
     * Handle failed payment
     */
    async handlePaymentFailed(invoice) {
        const userId = invoice.customer_metadata?.userId;

        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId } });

            // Send payment failed notification
            if (emailService) {
                await emailService.send({
                    to: user.email,
                    subject: 'Payment Failed - Action Required',
                    html: `<h1>Payment Failed</h1><p>Please update your payment method.</p>`,
                    userId,
                    eventType: 'payment.failed'
                });
            }
        }

        console.log(`⚠️ Payment failed: ${invoice.id}`);
    }

    /**
     * Get usage stats for metered billing
     */
    async recordUsage(userId, metric, quantity) {
        if (!stripe) return;
        try {
            const subscription = await prisma.subscription.findFirst({
                where: { userId, status: 'ACTIVE' }
            });

            if (!subscription) {
                throw new Error('No active subscription');
            }

            const stripeSubscription = await stripe.subscriptions.retrieve(
                subscription.stripeSubscriptionId
            );

            // Record usage for metered item
            await stripe.subscriptionItems.createUsageRecord(
                stripeSubscription.items.data[0].id,
                {
                    quantity,
                    timestamp: Math.floor(Date.now() / 1000),
                    action: 'increment'
                }
            );

            // Log in database
            await prisma.usageRecord.create({
                data: {
                    userId,
                    subscriptionId: subscription.id,
                    metric,
                    quantity,
                    recordedAt: new Date()
                }
            });

            console.log(`✅ Usage recorded: ${quantity} ${metric} for user ${userId}`);

        } catch (error) {
            console.error('Usage recording error:', error);
        }
    }
}

// ============================================================
// API ROUTES
// ============================================================

export const paymentService = new PaymentService();

/**
 * GET /payments/plans
 * Get available pricing plans
 */
router.get('/plans', (req, res) => {
    res.json({
        success: true,
        plans: Object.values(PRICING_PLANS)
    });
});

/**
 * POST /payments/checkout
 * Create checkout session
 */
router.post('/checkout', async (req, res) => {
    try {
        const { planId, userId } = req.body;

        const successUrl = `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${process.env.CLIENT_URL}/pricing`;

        const session = await paymentService.createCheckoutSession(
            userId,
            planId,
            successUrl,
            cancelUrl
        );

        res.json({
            success: true,
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /payments/one-time
 * Create one-time payment
 */
router.post('/one-time', async (req, res) => {
    try {
        const { userId, amount, description } = req.body;

        const successUrl = `${process.env.CLIENT_URL}/dashboard?payment=success`;
        const cancelUrl = `${process.env.CLIENT_URL}/dashboard?payment=cancelled`;

        const session = await paymentService.createOneTimePayment(
            userId,
            amount,
            description,
            successUrl,
            cancelUrl
        );

        res.json({
            success: true,
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /payments/portal
 * Create customer portal session
 */
router.post('/portal', async (req, res) => {
    try {
        const { userId } = req.body;
        const returnUrl = `${process.env.CLIENT_URL}/dashboard`;

        const session = await paymentService.createPortalSession(userId, returnUrl);

        res.json({
            success: true,
            url: session.url
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /payments/cancel
 * Cancel subscription
 */
router.post('/cancel', async (req, res) => {
    try {
        const { subscriptionId } = req.body;

        await paymentService.cancelSubscription(subscriptionId);

        res.json({
            success: true,
            message: 'Subscription cancelled successfully'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /payments/upgrade
 * Upgrade/downgrade subscription
 */
router.post('/upgrade', async (req, res) => {
    try {
        const { subscriptionId, newPlanId } = req.body;

        await paymentService.updateSubscription(subscriptionId, newPlanId);

        res.json({
            success: true,
            message: 'Subscription updated successfully'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /payments/webhook
 * Stripe webhook endpoint
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['stripe-signature'];
    if (!stripe) {
        return res.status(503).send('Stripe not configured');
    }

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        await paymentService.handleWebhook(event);

        res.json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

/**
 * GET /payments/subscription/:userId
 * Get user's current subscription
 */
router.get('/subscription/:userId', async (req, res) => {
    try {
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: req.params.userId,
                status: { in: ['ACTIVE', 'TRIALING'] }
            }
        });

        if (!subscription) {
            return res.json({
                success: true,
                subscription: null,
                plan: 'FREE'
            });
        }

        res.json({
            success: true,
            subscription,
            plan: PRICING_PLANS[subscription.planId.toUpperCase()]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /payments/invoices/:userId
 * Get user's invoice history
 */
router.get('/invoices/:userId', async (req, res) => {
    try {
        if (!stripe) return res.json({ success: true, invoices: [] });

        const user = await prisma.user.findUnique({
            where: { id: req.params.userId }
        });

        if (!user.stripeCustomerId) {
            return res.json({ success: true, invoices: [] });
        }

        const invoices = await stripe.invoices.list({
            customer: user.stripeCustomerId,
            limit: 20
        });

        res.json({
            success: true,
            invoices: invoices.data
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /payments/usage
 * Record usage for metered billing
 */
router.post('/usage', async (req, res) => {
    try {
        const { userId, metric, quantity } = req.body;

        await paymentService.recordUsage(userId, metric, quantity);

        res.json({
            success: true,
            message: 'Usage recorded'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
