
// ============================================================
// 2. ANALYTICS SERVICE (Mixpanel/PostHog)
// ============================================================

import Mixpanel from 'mixpanel';
import { PostHog } from 'posthog-node';
import express from 'express';

const router = express.Router();

export class AnalyticsService {

    constructor() {
        if (process.env.MIXPANEL_TOKEN) {
            this.mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN);
        } else {
            console.warn('⚠️ MIXPANEL_TOKEN missing. Analytics disabled.');
            this.mixpanel = { track: () => { }, people: { set: () => { }, track_charge: () => { } } };
        }

        if (process.env.POSTHOG_API_KEY) {
            this.posthog = new PostHog(
                process.env.POSTHOG_API_KEY,
                { host: process.env.POSTHOG_HOST || 'https://app.posthog.com' }
            );
        } else {
            console.warn('⚠️ POSTHOG_API_KEY missing. Feature flags disabled.');
            this.posthog = { capture: () => { }, identify: () => { }, isFeatureEnabled: async () => false, getFeatureFlag: async () => null };
        }
    }

    // Track event
    track(userId, event, properties = {}) {
        const enriched = {
            ...properties,
            timestamp: new Date().toISOString(),
            platform: 'web'
        };

        // Send to Mixpanel
        this.mixpanel.track(event, {
            distinct_id: userId,
            ...enriched
        });

        // Send to PostHog
        this.posthog.capture({
            distinctId: userId,
            event,
            properties: enriched
        });

        console.log(`📊 Analytics: ${event} for user ${userId}`);
    }

    // Track page view
    pageView(userId, page, properties = {}) {
        this.track(userId, 'Page View', {
            page,
            ...properties
        });
    }

    // Identify user
    identify(userId, traits = {}) {
        this.mixpanel.people.set(userId, traits);
        this.posthog.identify({
            distinctId: userId,
            properties: traits
        });
    }

    // Track funnel
    trackFunnel(userId, step, funnelName) {
        this.track(userId, `Funnel: ${funnelName} - ${step}`, {
            funnel: funnelName,
            step
        });
    }

    // Revenue tracking
    trackRevenue(userId, amount, product) {
        this.mixpanel.people.track_charge(userId, amount);
        this.track(userId, 'Purchase', {
            amount,
            product,
            currency: 'USD'
        });
    }

    // Feature flag
    async isFeatureEnabled(userId, feature) {
        try {
            return await this.posthog.isFeatureEnabled(feature, userId);
        } catch (e) {
            return false;
        }
    }

    // A/B test variant
    async getVariant(userId, experiment) {
        try {
            return await this.posthog.getFeatureFlag(experiment, userId);
        } catch (e) {
            return null;
        }
    }
}

export const analytics = new AnalyticsService();

// API Routes
router.post('/track', (req, res) => {
    const { userId, event, properties } = req.body;
    analytics.track(userId, event, properties);
    res.json({ success: true });
});

router.post('/identify', (req, res) => {
    const { userId, traits } = req.body;
    analytics.identify(userId, traits);
    res.json({ success: true });
});

router.get('/feature/:userId/:feature', async (req, res) => {
    const enabled = await analytics.isFeatureEnabled(
        req.params.userId,
        req.params.feature
    );
    res.json({ enabled });
});

export default router;
