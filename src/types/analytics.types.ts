export interface AnalyticsData {
    siteId: string;
    period: DateRange;
    metrics: SiteMetrics;
    pageViews: PageViewMetric[];
    topPages: PageMetric[];
    referrers: ReferrerMetric[];
    devices: DeviceMetric[];
    locations: GeoMetric[];
    events: EventMetric[];
}

export interface DateRange {
    start: string;
    end: string;
    preset?: '7d' | '30d' | '90d' | 'all';
}

export interface SiteMetrics {
    totalPageViews: number;
    uniqueVisitors: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate?: number;
    previousPeriod?: {
        totalPageViews: number;
        uniqueVisitors: number;
        change: number;
    };
}

export interface PageViewMetric {
    date: string;
    views: number;
    uniqueVisitors: number;
}

export interface PageMetric {
    path: string;
    title: string;
    views: number;
    uniqueVisitors: number;
    avgDuration: number;
    bounceRate: number;
}

export interface ReferrerMetric {
    source: string;
    medium: 'organic' | 'direct' | 'referral' | 'social' | 'email' | 'paid';
    visits: number;
    percentage: number;
}

export interface DeviceMetric {
    type: 'desktop' | 'mobile' | 'tablet';
    count: number;
    percentage: number;
    browsers: {
        name: string;
        count: number;
    }[];
}

export interface GeoMetric {
    country: string;
    countryCode: string;
    city?: string;
    visits: number;
    percentage: number;
}

export interface EventMetric {
    name: string;
    category: string;
    count: number;
    value?: number;
}

export interface AnalyticsEvent {
    type: 'pageview' | 'event' | 'conversion';
    timestamp: string;
    page: string;
    referrer?: string;
    device: {
        type: 'desktop' | 'mobile' | 'tablet';
        browser: string;
        os: string;
    };
    location?: {
        country: string;
        city: string;
    };
    sessionId: string;
    visitorId: string;
    metadata?: Record<string, unknown>;
}

export interface SEOScore {
    overall: number;
    categories: {
        technical: SEOCategoryScore;
        content: SEOCategoryScore;
        performance: SEOCategoryScore;
        mobile: SEOCategoryScore;
    };
    issues: SEOIssue[];
    suggestions: string[];
}

export interface SEOCategoryScore {
    score: number;
    maxScore: number;
    checks: SEOCheck[];
}

export interface SEOCheck {
    name: string;
    passed: boolean;
    impact: 'high' | 'medium' | 'low';
    description: string;
}

export interface SEOIssue {
    severity: 'error' | 'warning' | 'info';
    message: string;
    element?: string;
    solution: string;
}
