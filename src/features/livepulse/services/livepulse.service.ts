// ============================================
// LIVE PULSE SERVICE - API Client
// ============================================

import type {
    ServiceHealth,
    LivePulseAnalytics,
    Alert,
    SystemMetrics,
    UserActivity,
    CreateAlertInput,
    UpdateAlertInput,
    ServiceHealthResponse,
    AnalyticsResponse,
    AlertResponse,
    MetricsResponse,
    ActivityResponse,
    TimeRange,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Health Monitoring API
 */
export const livePulseHealthAPI = {
    /**
     * Get health status for all services
     */
    async getServicesHealth(): Promise<ServiceHealth[]> {
        const response = await fetch(`${API_BASE_URL}/livepulse/health`);
        const data: ServiceHealthResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch services health');
        }

        return Array.isArray(data.data) ? data.data : [data.data];
    },

    /**
     * Get health for a specific service
     */
    async getServiceById(id: string): Promise<ServiceHealth> {
        const response = await fetch(`${API_BASE_URL}/livepulse/health/${id}`);
        const data: ServiceHealthResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch service health');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },
};

/**
 * Analytics API
 */
export const livePulseAnalyticsAPI = {
    /**
     * Get comprehensive dashboard analytics
     */
    async getDashboardAnalytics(timeRange: TimeRange = '24h'): Promise<LivePulseAnalytics> {
        const response = await fetch(`${API_BASE_URL}/livepulse/analytics?range=${timeRange}`);
        const data: AnalyticsResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch analytics data');
        }

        return data.data;
    },

    /**
     * Get system performance metrics
     */
    async getSystemMetrics(range: TimeRange = '1h'): Promise<SystemMetrics[]> {
        const response = await fetch(`${API_BASE_URL}/livepulse/metrics/system?range=${range}`);
        const data: MetricsResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch system metrics');
        }

        return Array.isArray(data.data) ? data.data : [data.data];
    },

    /**
     * Get user activity logs
     */
    async getUserActivity(page = 1, limit = 50): Promise<{ activities: UserActivity[]; total: number }> {
        const response = await fetch(`${API_BASE_URL}/livepulse/activities?page=${page}&limit=${limit}`);
        const data: ActivityResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch user activity');
        }

        const activities = Array.isArray(data.data) ? data.data : [data.data];
        const total = data.pagination?.total || activities.length;

        return { activities, total };
    },
};

/**
 * Alerts API
 */
export const livePulseAlertsAPI = {
    /**
     * Get active alerts
     */
    async getAlerts(status: string = 'active'): Promise<Alert[]> {
        const response = await fetch(`${API_BASE_URL}/livepulse/alerts?status=${status}`);
        const data: AlertResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch alerts');
        }

        return Array.isArray(data.data) ? data.data : [data.data];
    },

    /**
     * Create a new alert manually
     */
    async create(alertData: CreateAlertInput): Promise<Alert> {
        const response = await fetch(`${API_BASE_URL}/livepulse/alerts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alertData),
        });
        const data: AlertResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to create alert');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Acknowledge an alert
     */
    async acknowledge(id: string): Promise<Alert> {
        const response = await fetch(`${API_BASE_URL}/livepulse/alerts/${id}/acknowledge`, {
            method: 'POST',
        });
        const data: AlertResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to acknowledge alert');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Resolve an alert
     */
    async resolve(id: string, resolution: string): Promise<Alert> {
        const response = await fetch(`${API_BASE_URL}/livepulse/alerts/${id}/resolve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resolution }),
        });
        const data: AlertResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to resolve alert');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },
};

/**
 * Combined LivePulse service
 */
export const livePulseService = {
    health: livePulseHealthAPI,
    analytics: livePulseAnalyticsAPI,
    alerts: livePulseAlertsAPI,
};

export default livePulseService;
