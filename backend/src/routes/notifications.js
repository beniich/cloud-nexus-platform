
// ============================================================
// FIREBASE PUSH NOTIFICATIONS SERVICE
// Web Push, Mobile (iOS/Android), Topics, Scheduling
// ============================================================

import admin from 'firebase-admin';
import express from 'express';
// @ts-ignore
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const router = express.Router();
const prisma = new PrismaClient();

// ============================================================
// FIREBASE INITIALIZATION
// ============================================================

// Initialize Firebase Admin SDK if credentials exist
let messaging;

try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 && process.env.FIREBASE_PROJECT_ID) {
        const serviceAccount = JSON.parse(
            Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString()
        );

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID
        });

        messaging = admin.messaging();
        console.log('✅ Firebase Admin SDK initialized');
    } else {
        console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_BASE64 or FIREBASE_PROJECT_ID missing. Push notifications disabled.');
    }
} catch (error) {
    console.error('❌ Failed to initialize Firebase:', error.message);
}

// ============================================================
// NOTIFICATION TEMPLATES
// ============================================================

export const NOTIFICATION_TYPES = {
    SITE_DEPLOYED: {
        title: '🚀 Site Deployed!',
        body: 'Your site {{siteName}} is now live',
        icon: '/icons/rocket.png',
        badge: '/icons/badge.png',
        click_action: '/dashboard/sites/{{siteId}}'
    },
    DEPLOYMENT_FAILED: {
        title: '⚠️ Deployment Failed',
        body: 'There was an issue deploying {{siteName}}',
        icon: '/icons/warning.png',
        click_action: '/dashboard/sites/{{siteId}}'
    },
    NEW_LEAD: {
        title: '👤 New Lead Assigned',
        body: '{{leadName}} from {{company}}',
        icon: '/icons/user.png',
        click_action: '/crm/leads/{{leadId}}'
    },
    PAYMENT_SUCCESS: {
        title: '✅ Payment Received',
        body: 'Your payment of ${{amount}} was successful',
        icon: '/icons/check.png',
        click_action: '/billing'
    },
    PAYMENT_FAILED: {
        title: '❌ Payment Failed',
        body: 'Please update your payment method',
        icon: '/icons/error.png',
        click_action: '/billing'
    },
    TEAM_INVITE: {
        title: '🤝 Team Invitation',
        body: 'You\'ve been invited to join {{teamName}}',
        icon: '/icons/team.png',
        click_action: '/teams/invites'
    },
    SECURITY_ALERT: {
        title: '🔒 Security Alert',
        body: '{{message}}',
        icon: '/icons/lock.png',
        priority: 'high',
        click_action: '/security'
    }
};

// ============================================================
// PUSH NOTIFICATION SERVICE CLASS
// ============================================================

export class PushNotificationService {

    /**
     * Send notification to single device
     */
    async sendToDevice(token, notification, data = {}) {
        if (!messaging) throw new Error('Firebase not initialized');
        try {
            const message = {
                token,
                notification: {
                    title: notification.title,
                    body: notification.body,
                    imageUrl: notification.imageUrl
                },
                data: {
                    ...data,
                    click_action: notification.click_action || '/dashboard'
                },
                webpush: {
                    notification: {
                        icon: notification.icon || '/icons/default.png',
                        badge: notification.badge || '/icons/badge.png',
                        vibrate: [200, 100, 200],
                        requireInteraction: notification.priority === 'high'
                    },
                    fcmOptions: {
                        link: notification.click_action
                    }
                },
                android: {
                    priority: notification.priority === 'high' ? 'high' : 'normal',
                    notification: {
                        sound: 'default',
                        channelId: 'default'
                    }
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1
                        }
                    }
                }
            };

            const response = await messaging.send(message);

            // Log notification
            await this.logNotification({
                token,
                type: data.type,
                title: notification.title,
                status: 'SENT',
                messageId: response
            });

            console.log(`✅ Push notification sent: ${response}`);
            return { success: true, messageId: response };

        } catch (error) {
            console.error('Push notification error:', error);

            // Log failure
            await this.logNotification({
                token,
                type: data.type,
                title: notification.title,
                status: 'FAILED',
                error: error.message
            });

            // Remove invalid tokens
            if (error.code === 'messaging/invalid-registration-token' ||
                error.code === 'messaging/registration-token-not-registered') {
                await this.removeInvalidToken(token);
            }

            throw error;
        }
    }

    /**
     * Send notification to multiple devices
     */
    async sendToMultipleDevices(tokens, notification, data = {}) {
        if (!messaging) throw new Error('Firebase not initialized');
        try {
            const message = {
                tokens,
                notification: {
                    title: notification.title,
                    body: notification.body
                },
                data,
                webpush: {
                    notification: {
                        icon: notification.icon,
                        badge: notification.badge
                    }
                }
            };

            const response = await messaging.sendEachForMulticast(message);

            console.log(`✅ Sent to ${response.successCount}/${tokens.length} devices`);

            // Handle failures
            if (response.failureCount > 0) {
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        console.error(`Failed to send to ${tokens[idx]}:`, resp.error);
                        this.removeInvalidToken(tokens[idx]);
                    }
                });
            }

            return {
                success: true,
                successCount: response.successCount,
                failureCount: response.failureCount
            };

        } catch (error) {
            console.error('Multicast error:', error);
            throw error;
        }
    }

    /**
     * Send notification to topic subscribers
     */
    async sendToTopic(topic, notification, data = {}) {
        if (!messaging) throw new Error('Firebase not initialized');
        try {
            const message = {
                topic,
                notification: {
                    title: notification.title,
                    body: notification.body
                },
                data,
                webpush: {
                    notification: {
                        icon: notification.icon
                    }
                }
            };

            const response = await messaging.send(message);

            console.log(`✅ Topic notification sent to ${topic}: ${response}`);
            return { success: true, messageId: response };

        } catch (error) {
            console.error('Topic notification error:', error);
            throw error;
        }
    }

    /**
     * Subscribe device to topic
     */
    async subscribeToTopic(tokens, topic) {
        if (!messaging) throw new Error('Firebase not initialized');
        try {
            const tokensArray = Array.isArray(tokens) ? tokens : [tokens];

            const response = await messaging.subscribeToTopic(tokensArray, topic);

            console.log(`✅ Subscribed ${response.successCount} devices to ${topic}`);

            // Save subscription
            for (const token of tokensArray) {
                await prisma.pushSubscription.upsert({
                    where: { token_topic: { token, topic } },
                    update: { active: true },
                    create: { token, topic, active: true }
                });
            }

            return response;

        } catch (error) {
            console.error('Topic subscription error:', error);
            throw error;
        }
    }

    /**
     * Unsubscribe device from topic
     */
    async unsubscribeFromTopic(tokens, topic) {
        if (!messaging) throw new Error('Firebase not initialized');
        try {
            const tokensArray = Array.isArray(tokens) ? tokens : [tokens];

            const response = await messaging.unsubscribeFromTopic(tokensArray, topic);

            // Update subscriptions
            for (const token of tokensArray) {
                await prisma.pushSubscription.updateMany({
                    where: { token, topic },
                    data: { active: false }
                });
            }

            return response;

        } catch (error) {
            console.error('Topic unsubscription error:', error);
            throw error;
        }
    }

    /**
     * Send templated notification
     */
    async sendTemplatedNotification(userId, templateType, variables = {}) {
        try {
            const template = NOTIFICATION_TYPES[templateType];

            if (!template) {
                throw new Error(`Invalid template type: ${templateType}`);
            }

            // Replace variables in template
            const notification = {
                title: this.replaceVariables(template.title, variables),
                body: this.replaceVariables(template.body, variables),
                icon: template.icon,
                badge: template.badge,
                click_action: this.replaceVariables(template.click_action, variables),
                priority: template.priority
            };

            // Get user's device tokens
            const tokens = await this.getUserTokens(userId);

            if (tokens.length === 0) {
                console.log(`No tokens found for user ${userId}`);
                return { success: false, message: 'No tokens found' };
            }

            return await this.sendToMultipleDevices(tokens, notification, {
                type: templateType,
                userId,
                ...variables
            });

        } catch (error) {
            console.error('Templated notification error:', error);
            throw error;
        }
    }

    /**
     * Replace template variables
     */
    replaceVariables(text, variables) {
        if (!text) return '';

        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return variables[key] !== undefined ? variables[key] : match;
        });
    }

    /**
     * Get all device tokens for a user
     */
    async getUserTokens(userId) {
        const devices = await prisma.deviceToken.findMany({
            where: {
                userId,
                active: true
            },
            select: { token: true }
        });

        return devices.map(d => d.token);
    }

    /**
     * Register device token
     */
    async registerToken(userId, token, deviceType, deviceInfo = {}) {
        try {
            await prisma.deviceToken.upsert({
                where: { token },
                update: {
                    userId,
                    deviceType,
                    deviceInfo,
                    active: true,
                    lastUsed: new Date()
                },
                create: {
                    userId,
                    token,
                    deviceType,
                    deviceInfo,
                    active: true
                }
            });

            console.log(`✅ Device token registered for user ${userId}`);
            return { success: true };

        } catch (error) {
            console.error('Token registration error:', error);
            throw error;
        }
    }

    /**
     * Remove invalid token
     */
    async removeInvalidToken(token) {
        await prisma.deviceToken.updateMany({
            where: { token },
            data: { active: false }
        });

        console.log(`🗑️ Invalid token removed: ${token}`);
    }

    /**
     * Log notification
     */
    async logNotification(data) {
        try {
            await prisma.notificationLog.create({
                data: {
                    token: data.token,
                    type: data.type,
                    title: data.title,
                    status: data.status,
                    messageId: data.messageId,
                    error: data.error
                }
            });
        } catch (error) {
            console.error('Failed to log notification:', error);
        }
    }

    /**
     * Schedule notification
     */
    async scheduleNotification(userId, notification, scheduledFor) {
        try {
            const scheduled = await prisma.scheduledNotification.create({
                data: {
                    userId,
                    notification: notification,
                    scheduledFor,
                    status: 'PENDING'
                }
            });

            console.log(`📅 Notification scheduled for ${scheduledFor}`);
            return scheduled;

        } catch (error) {
            console.error('Schedule notification error:', error);
            throw error;
        }
    }

    /**
     * Process scheduled notifications (called by cron)
     */
    async processScheduledNotifications() {
        const now = new Date();

        const pending = await prisma.scheduledNotification.findMany({
            where: {
                status: 'PENDING',
                scheduledFor: { lte: now }
            }
        });

        if (pending.length > 0) {
            console.log(`📨 Processing ${pending.length} scheduled notifications`);
        }

        for (const scheduled of pending) {
            try {
                // Parse notification JSON if string
                const notifData = typeof scheduled.notification === 'string'
                    ? JSON.parse(scheduled.notification)
                    : scheduled.notification;

                await this.sendTemplatedNotification(
                    scheduled.userId,
                    notifData.type,
                    notifData.variables || {}
                );

                await prisma.scheduledNotification.update({
                    where: { id: scheduled.id },
                    data: { status: 'SENT', sentAt: new Date() }
                });

            } catch (error) {
                console.error(`Failed to send scheduled notification ${scheduled.id}:`, error);

                await prisma.scheduledNotification.update({
                    where: { id: scheduled.id },
                    data: {
                        status: 'FAILED',
                        error: error.message
                    }
                });
            }
        }
    }

    /**
     * Get notification preferences
     */
    async getPreferences(userId) {
        let prefs = await prisma.notificationPreferences.findUnique({
            where: { userId }
        });

        if (!prefs) {
            // Create default preferences
            prefs = await prisma.notificationPreferences.create({
                data: {
                    userId,
                    deployments: true,
                    payments: true,
                    crm: true,
                    security: true,
                    marketing: false
                }
            });
        }

        return prefs;
    }

    /**
     * Update notification preferences
     */
    async updatePreferences(userId, preferences) {
        return await prisma.notificationPreferences.upsert({
            where: { userId },
            update: preferences,
            create: { userId, ...preferences }
        });
    }

    /**
     * Check if user wants this type of notification
     */
    async shouldNotify(userId, type) {
        const prefs = await this.getPreferences(userId);

        const typeMap = {
            SITE_DEPLOYED: 'deployments',
            DEPLOYMENT_FAILED: 'deployments',
            PAYMENT_SUCCESS: 'payments',
            PAYMENT_FAILED: 'payments',
            NEW_LEAD: 'crm',
            SECURITY_ALERT: 'security'
        };

        const prefKey = typeMap[type];
        if (prefKey && prefs[prefKey] === false) {
            return false;
        }
        return true;
    }
}

// ============================================================
// CRON JOBS
// ============================================================

export const pushService = new PushNotificationService();

// Process scheduled notifications every minute
cron.schedule('* * * * *', async () => {
    await pushService.processScheduledNotifications();
});

// ============================================================
// API ROUTES
// ============================================================

/**
 * POST /notifications/register
 * Register device token
 */
router.post('/register', async (req, res) => {
    try {
        const { userId, token, deviceType, deviceInfo } = req.body;

        await pushService.registerToken(userId, token, deviceType, deviceInfo);

        res.json({
            success: true,
            message: 'Device registered successfully'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /notifications/send
 * Send notification to user
 */
router.post('/send', async (req, res) => {
    try {
        const { userId, type, variables } = req.body;

        // Check preferences
        const shouldSend = await pushService.shouldNotify(userId, type);

        if (!shouldSend) {
            return res.json({
                success: false,
                message: 'User has disabled this notification type'
            });
        }

        const result = await pushService.sendTemplatedNotification(userId, type, variables);

        res.json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /notifications/topic/subscribe
 * Subscribe to topic
 */
router.post('/topic/subscribe', async (req, res) => {
    try {
        const { userId, topic } = req.body;

        const tokens = await pushService.getUserTokens(userId);
        await pushService.subscribeToTopic(tokens, topic);

        res.json({
            success: true,
            message: `Subscribed to ${topic}`
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /notifications/schedule
 * Schedule notification
 */
router.post('/schedule', async (req, res) => {
    try {
        const { userId, notification, scheduledFor } = req.body;

        const scheduled = await pushService.scheduleNotification(
            userId,
            notification,
            new Date(scheduledFor)
        );

        res.json({
            success: true,
            scheduledId: scheduled.id
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /notifications/preferences/:userId
 * Get notification preferences
 */
router.get('/preferences/:userId', async (req, res) => {
    try {
        const prefs = await pushService.getPreferences(req.params.userId);

        res.json({
            success: true,
            preferences: prefs
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /notifications/preferences/:userId
 * Update preferences
 */
router.put('/preferences/:userId', async (req, res) => {
    try {
        const prefs = await pushService.updatePreferences(
            req.params.userId,
            req.body
        );

        res.json({
            success: true,
            preferences: prefs
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
