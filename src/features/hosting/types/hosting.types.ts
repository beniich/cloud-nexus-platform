// ============================================
// HOSTING MODULE - TYPE DEFINITIONS
// ============================================

/**
 * Billing cycle options for hosting services
 */
export type BillingCycle = 'monthly' | 'yearly' | 'quarterly';

/**
 * Status of a hosting request
 */
export type HostingRequestStatus =
    | 'pending'      // Initial state, waiting for review
    | 'processing'   // Being processed by team
    | 'active'       // Service is active
    | 'suspended'    // Temporarily suspended
    | 'cancelled'    // Cancelled by client or admin
    | 'expired';     // Contract expired

/**
 * Hosting plan tiers
 */
export type PlanTier = 'starter' | 'professional' | 'enterprise' | 'custom';

/**
 * Additional hosting features/addons
 */
export interface HostingFeature {
    id: string;
    name: string;
    description?: string;
    price: number;
    included: boolean;
}

/**
 * Hosting Plan - Represents a predefined hosting package
 */
export interface HostingPlan {
    id: string;
    name: string;
    description?: string;
    tier: PlanTier;

    // Resources
    cpu: number;          // Number of vCPUs
    ram: number;          // RAM in GB
    storage: number;      // Storage in GB
    bandwidth: number;    // Bandwidth in GB/month

    // Pricing
    price: number;        // Base price
    setupFee?: number;    // One-time setup fee

    // Features
    features: {
        ssl: boolean;
        backup: boolean;
        cdn: boolean;
        support: '24/7' | 'business-hours' | 'email-only';
        customDomain: boolean;
        emailAccounts?: number;
        databases?: number;
        ftp?: boolean;
        autoScaling?: boolean;
    };

    // Metadata
    active: boolean;
    popular?: boolean;    // Highlight as popular choice
    recommended?: boolean; // Recommended plan
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Custom configuration for hosting
 */
export interface CustomHostingConfig {
    cpu?: number;
    ram?: number;
    storage?: number;
    bandwidth?: number;
    ssl?: boolean;
    backup?: boolean;
    cdn?: boolean;
    emailAccounts?: number;
    databases?: number;
    autoScaling?: boolean;
}

/**
 * Domain configuration
 */
export interface DomainConfig {
    domain?: string;           // Custom domain
    transferExisting?: boolean; // Transfer from another registrar
    registerNew?: boolean;      // Register new domain
    useSubdomain?: boolean;     // Use platform subdomain
    subdomain?: string;         // Subdomain name if applicable
}

/**
 * Hosting Request - A client's request for hosting service
 */
export interface HostingRequest {
    id: string;
    userId: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };

    // Plan details
    planId?: string;
    plan?: HostingPlan;

    // Custom configuration (if plan is 'custom')
    customConfig?: CustomHostingConfig;

    // Domain
    domainConfig?: DomainConfig;

    // Optional addons
    addons?: string[];  // IDs of additional features

    // Pricing
    totalPrice: number;
    setupFee?: number;
    billingCycle: BillingCycle;

    // Status
    status: HostingRequestStatus;

    // Additional info
    notes?: string;
    projectDescription?: string;
    estimatedTraffic?: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    activatedAt?: Date;
    expiresAt?: Date;
}

/**
 * Hosting quote calculation result
 */
export interface HostingQuote {
    basePrice: number;
    setupFee: number;
    addonsPrice: number;
    subtotal: number;
    discount?: {
        percentage: number;
        amount: number;
        reason: string;
    };
    tax?: {
        percentage: number;
        amount: number;
    };
    total: number;
    billingCycle: BillingCycle;
    monthlyEquivalent: number; // For comparison
}

/**
 * Form data for creating a hosting request
 */
export interface CreateHostingRequestInput {
    planId?: string;
    customConfig?: CustomHostingConfig;
    domainConfig: DomainConfig;
    addons?: string[];
    billingCycle: BillingCycle;
    projectDescription?: string;
    estimatedTraffic?: string;
    notes?: string;
}

/**
 * Form data for updating a hosting request
 */
export interface UpdateHostingRequestInput {
    status?: HostingRequestStatus;
    notes?: string;
    customConfig?: Partial<CustomHostingConfig>;
    domainConfig?: Partial<DomainConfig>;
}

/**
 * Filter options for listing hosting requests
 */
export interface HostingRequestFilters {
    userId?: string;
    status?: HostingRequestStatus | HostingRequestStatus[];
    planId?: string;
    billingCycle?: BillingCycle;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string; // Search in domain, notes, etc.
}

/**
 * Hosting statistics for analytics
 */
export interface HostingStats {
    totalRequests: number;
    activeServices: number;
    pendingRequests: number;
    monthlyRevenue: number;
    popularPlan: {
        planId: string;
        planName: string;
        count: number;
    };
    conversionRate: number; // percentage
    averageLifetime: number; // in days
}

/**
 * Hosting plan comparison data
 */
export interface PlanComparison {
    plans: HostingPlan[];
    features: {
        name: string;
        values: (string | number | boolean)[];
    }[];
}

/**
 * API Response types
 */
export interface HostingPlanResponse {
    success: boolean;
    data?: HostingPlan | HostingPlan[];
    error?: string;
}

export interface HostingRequestResponse {
    success: boolean;
    data?: HostingRequest | HostingRequest[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    error?: string;
}

export interface HostingQuoteResponse {
    success: boolean;
    data?: HostingQuote;
    error?: string;
}
