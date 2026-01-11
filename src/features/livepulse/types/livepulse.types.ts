// ============================================
// LIVE PULSE MODULE - TYPE DEFINITIONS
// ============================================

/**
 * Service health status
 */
export type HealthStatus = 'healthy' | 'degraded' | 'down' | 'maintenance';

/**
 * Alert severity levels
 */
export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Alert status
 */
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'ignored';

/**
 * Metric types for tracking
 */
export type MetricType =
    | 'form_submission'
    | 'hosting_request'
    | 'service_request'
    | 'user_registration'
    | 'login'
    | 'api_call'
    | 'page_view'
    | 'error'
    | 'conversion';

/**
 * Time range for analytics
 */
export type TimeRange =
    | '1h'   // Last hour
    | '24h'  // Last 24 hours
    | '7d'   // Last 7 days
    | '30d'  // Last 30 days
    | '90d'  // Last 90 days
    | 'custom'; // Custom date range

/**
 * Real-time metric data point
 */
export interface MetricDataPoint {
    timestamp: Date;
    value: number;
    label?: string;
    metadata?: Record<string, any>;
}

/**
 * Service health monitor
 */
export interface ServiceHealth {
    serviceName: string;
    status: HealthStatus;
    uptime: number; // percentage
    responseTime: number; // in ms
    lastChecked: Date;

    // Detailed metrics
    metrics: {
        cpu?: number; // percentage
        memory?: number; // percentage
        requests?: number; // requests per second
        errors?: number; // error count
    };

    // Recent incidents
    incidents?: {
        timestamp: Date;
        message: string;
        severity: AlertSeverity;
    }[];
}

/**
 * Form analytics data
 */
export interface FormAnalytics {
    formType: 'hosting' | 'service' | 'contact' | 'other';

    // Submission metrics
    totalSubmissions: number;
    successfulSubmissions: number;
    failedSubmissions: number;

    // Performance
    averageCompletionTime: number; // in seconds
    abandonmentRate: number; // percentage

    // User behavior
    fieldInteractions: {
        fieldName: string;
        interactions: number;
        errors: number;
    }[];

    // Conversion
    conversionRate: number; // percentage
    conversionToSale?: number; // percentage

    // Time-based data
    submissionsByHour: MetricDataPoint[];
    submissionsByDay: MetricDataPoint[];
}

/**
 * User activity tracking
 */
export interface UserActivity {
    userId: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };

    sessionId: string;

    // Activity details
    action: string;
    page: string;
    timestamp: Date;

    // Context
    ipAddress?: string;
    userAgent?: string;
    location?: {
        country?: string;
        city?: string;
    };

    // Metadata
    metadata?: Record<string, any>;
}

/**
 * Alert configuration
 */
export interface Alert {
    id: string;

    // Alert details
    title: string;
    message: string;
    severity: AlertSeverity;
    status: AlertStatus;

    // Trigger
    triggerType: string; // e.g., 'threshold', 'anomaly', 'manual'
    triggerCondition?: string;

    // Assignment
    assignedTo?: string;
    assignedUser?: {
        id: string;
        name: string;
    };

    // Resolution
    acknowledgedAt?: Date;
    acknowledgedBy?: string;
    resolvedAt?: Date;
    resolvedBy?: string;
    resolution?: string;

    // Notifications
    notificationsSent: number;
    lastNotificationAt?: Date;

    // Related data
    relatedService?: string;
    relatedMetric?: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

/**
 * System performance metrics
 */
export interface SystemMetrics {
    timestamp: Date;

    // Server metrics
    server: {
        cpu: number; // percentage
        memory: number; // percentage
        disk: number; // percentage
        network: {
            incoming: number; // MB/s
            outgoing: number; // MB/s
        };
    };

    // Application metrics
    application: {
        activeUsers: number;
        requestsPerSecond: number;
        averageResponseTime: number; // ms
        errorRate: number; // percentage
    };

    // Database metrics
    database?: {
        connections: number;
        queryTime: number; // ms
        slowQueries: number;
    };
}

/**
 * Analytics dashboard data
 */
export interface LivePulseAnalytics {
    timeRange: TimeRange;
    fromDate?: Date;
    toDate?: Date;

    // Overview metrics
    overview: {
        totalRequests: number;
        totalUsers: number;
        activeUsers: number;
        conversionRate: number;
    };

    // Form analytics
    forms: {
        hosting: FormAnalytics;
        service: FormAnalytics;
        contact: FormAnalytics;
    };

    // User engagement
    userEngagement: {
        newUsers: number;
        returningUsers: number;
        averageSessionDuration: number; // seconds
        bounceRate: number; // percentage
    };

    // Traffic sources
    trafficSources: {
        source: string;
        visits: number;
        conversions: number;
    }[];

    // Popular pages
    popularPages: {
        page: string;
        views: number;
        averageTime: number; // seconds
    }[];

    // Real-time data
    realTime: {
        activeNow: number;
        requestsLastMinute: number;
        errorsLastMinute: number;
    };
}

/**
 * Monitoring configuration
 */
export interface MonitoringConfig {
    id: string;
    name: string;
    enabled: boolean;

    // What to monitor
    target: {
        type: 'service' | 'endpoint' | 'metric';
        identifier: string;
    };

    // Check configuration
    checkInterval: number; // in seconds
    timeout: number; // in seconds

    // Alert thresholds
    thresholds: {
        warning?: number;
        error?: number;
        critical?: number;
    };

    // Notification settings
    notifications: {
        email?: string[];
        webhook?: string;
        slack?: string;
    };

    createdAt: Date;
    updatedAt: Date;
}

/**
 * Request tracking for analytics
 */
export interface RequestTracking {
    id: string;
    type: MetricType;

    // Request details
    endpoint?: string;
    method?: string;
    statusCode?: number;

    // Performance
    duration: number; // in ms

    // User context
    userId?: string;
    sessionId?: string;

    // Result
    success: boolean;
    errorMessage?: string;

    timestamp: Date;
}

/**
 * Conversion funnel data
 */
export interface ConversionFunnel {
    name: string;
    steps: {
        stepName: string;
        visitors: number;
        conversions: number;
        conversionRate: number; // percentage
        dropOffRate: number; // percentage
    }[];
    overallConversionRate: number;
}

/**
 * Form inputs
 */
export interface CreateAlertInput {
    title: string;
    message: string;
    severity: AlertSeverity;
    triggerType: string;
    triggerCondition?: string;
    relatedService?: string;
    relatedMetric?: string;
    assignedTo?: string;
}

export interface UpdateAlertInput {
    status?: AlertStatus;
    assignedTo?: string;
    resolution?: string;
}

export interface AcknowledgeAlertInput {
    alertId: string;
    note?: string;
}

/**
 * Filters
 */
export interface AlertFilters {
    severity?: AlertSeverity | AlertSeverity[];
    status?: AlertStatus | AlertStatus[];
    assignedTo?: string;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
}

export interface ActivityFilters {
    userId?: string;
    action?: string;
    page?: string;
    dateFrom?: Date;
    dateTo?: Date;
}

/**
 * API Response types
 */
export interface ServiceHealthResponse {
    success: boolean;
    data?: ServiceHealth | ServiceHealth[];
    error?: string;
}

export interface AnalyticsResponse {
    success: boolean;
    data?: LivePulseAnalytics;
    error?: string;
}

export interface AlertResponse {
    success: boolean;
    data?: Alert | Alert[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    error?: string;
}

export interface MetricsResponse {
    success: boolean;
    data?: SystemMetrics | SystemMetrics[];
    error?: string;
}

export interface ActivityResponse {
    success: boolean;
    data?: UserActivity | UserActivity[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    error?: string;
}

/**
 * WebSocket events for real-time updates
 */
export interface LivePulseEvent {
    type: 'metric' | 'alert' | 'activity' | 'health';
    timestamp: Date;
    data: any;
}

export interface MetricUpdateEvent extends LivePulseEvent {
    type: 'metric';
    data: {
        metricType: MetricType;
        value: number;
        label?: string;
    };
}

export interface AlertEvent extends LivePulseEvent {
    type: 'alert';
    data: Alert;
}

export interface HealthUpdateEvent extends LivePulseEvent {
    type: 'health';
    data: ServiceHealth;
}
