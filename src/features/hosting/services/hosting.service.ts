// ============================================
// HOSTING SERVICE - API Client
// ============================================

import type {
    HostingPlan,
    HostingRequest,
    HostingQuote,
    CreateHostingRequestInput,
    UpdateHostingRequestInput,
    HostingRequestFilters,
    HostingPlanResponse,
    HostingRequestResponse,
    HostingQuoteResponse,
    BillingCycle,
    CustomHostingConfig,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Hosting Plans API
 */
export const hostingPlansAPI = {
    /**
     * Get all hosting plans
     */
    async getAll(): Promise<HostingPlan[]> {
        const response = await fetch(`${API_BASE_URL}/hosting/plans`);
        const data: HostingPlanResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch hosting plans');
        }

        return Array.isArray(data.data) ? data.data : [data.data];
    },

    /**
     * Get a specific hosting plan by ID
     */
    async getById(id: string): Promise<HostingPlan> {
        const response = await fetch(`${API_BASE_URL}/hosting/plans/${id}`);
        const data: HostingPlanResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch hosting plan');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Get active hosting plans only
     */
    async getActive(): Promise<HostingPlan[]> {
        const response = await fetch(`${API_BASE_URL}/hosting/plans?active=true`);
        const data: HostingPlanResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch active plans');
        }

        return Array.isArray(data.data) ? data.data : [data.data];
    },

    /**
     * Create a new hosting plan (Admin only)
     */
    async create(plan: Partial<HostingPlan>): Promise<HostingPlan> {
        const response = await fetch(`${API_BASE_URL}/hosting/plans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plan),
            credentials: 'include',
        });

        const data: HostingPlanResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to create hosting plan');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Update a hosting plan (Admin only)
     */
    async update(id: string, updates: Partial<HostingPlan>): Promise<HostingPlan> {
        const response = await fetch(`${API_BASE_URL}/hosting/plans/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
            credentials: 'include',
        });

        const data: HostingPlanResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to update hosting plan');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Delete a hosting plan (Admin only)
     */
    async delete(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/hosting/plans/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        const data: HostingPlanResponse = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to delete hosting plan');
        }
    },
};

/**
 * Hosting Requests API
 */
export const hostingRequestsAPI = {
    /**
     * Get all hosting requests (filtered)
     */
    async getAll(filters?: HostingRequestFilters, page = 1, limit = 10): Promise<{ requests: HostingRequest[]; total: number }> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...Object.fromEntries(
                Object.entries(filters || {}).map(([key, value]) => [
                    key,
                    Array.isArray(value) ? value.join(',') : String(value),
                ])
            ),
        });

        const response = await fetch(`${API_BASE_URL}/hosting/requests?${params}`, {
            credentials: 'include',
        });
        const data: HostingRequestResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch hosting requests');
        }

        const requests = Array.isArray(data.data) ? data.data : [data.data];
        const total = data.pagination?.total || requests.length;

        return { requests, total };
    },

    /**
     * Get a specific hosting request by ID
     */
    async getById(id: string): Promise<HostingRequest> {
        const response = await fetch(`${API_BASE_URL}/hosting/requests/${id}`, {
            credentials: 'include',
        });
        const data: HostingRequestResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch hosting request');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Get current user's hosting requests
     */
    async getMy(): Promise<HostingRequest[]> {
        const response = await fetch(`${API_BASE_URL}/hosting/requests/my`, {
            credentials: 'include',
        });
        const data: HostingRequestResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch your hosting requests');
        }

        return Array.isArray(data.data) ? data.data : [data.data];
    },

    /**
     * Create a new hosting request
     */
    async create(requestData: CreateHostingRequestInput): Promise<HostingRequest> {
        const response = await fetch(`${API_BASE_URL}/hosting/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
            credentials: 'include',
        });

        const data: HostingRequestResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to create hosting request');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Update a hosting request
     */
    async update(id: string, updates: UpdateHostingRequestInput): Promise<HostingRequest> {
        const response = await fetch(`${API_BASE_URL}/hosting/requests/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
            credentials: 'include',
        });

        const data: HostingRequestResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to update hosting request');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Cancel a hosting request
     */
    async cancel(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/hosting/requests/${id}/cancel`, {
            method: 'POST',
            credentials: 'include',
        });

        const data: HostingRequestResponse = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to cancel hosting request');
        }
    },

    /**
     * Delete a hosting request
     */
    async delete(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/hosting/requests/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        const data: HostingRequestResponse = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to delete hosting request');
        }
    },
};

/**
 * Hosting Quote Calculator API
 */
export const hostingQuoteAPI = {
    /**
     * Calculate quote for a custom configuration
     */
    async calculate(
        config: CustomHostingConfig,
        billingCycle: BillingCycle,
        addons?: string[]
    ): Promise<HostingQuote> {
        const response = await fetch(`${API_BASE_URL}/hosting/quote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ config, billingCycle, addons }),
            credentials: 'include',
        });

        const data: HostingQuoteResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to calculate quote');
        }

        return data.data;
    },

    /**
     * Get quote for a predefined plan
     */
    async forPlan(
        planId: string,
        billingCycle: BillingCycle,
        addons?: string[]
    ): Promise<HostingQuote> {
        const response = await fetch(`${API_BASE_URL}/hosting/quote/plan/${planId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ billingCycle, addons }),
            credentials: 'include',
        });

        const data: HostingQuoteResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to get plan quote');
        }

        return data.data;
    },
};

/**
 * Combined hosting service
 */
export const hostingService = {
    plans: hostingPlansAPI,
    requests: hostingRequestsAPI,
    quote: hostingQuoteAPI,
};

export default hostingService;
