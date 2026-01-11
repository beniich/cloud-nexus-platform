// ============================================
// CRM HUSTEL SERVICE - API Client
// ============================================

import type {
    CRMLead,
    CRMActivity,
    CRMTicket,
    TicketComment,
    CreateLeadInput,
    UpdateLeadInput,
    CreateActivityInput,
    UpdateActivityInput,
    CreateTicketInput,
    UpdateTicketInput,
    CreateCommentInput,
    LeadFilters,
    TicketFilters,
    CRMStats,
    TicketStats,
    CRMDashboard,
    PipelineStage,
    LeadResponse,
    ActivityResponse,
    TicketResponse,
    CommentResponse,
    CRMStatsResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * CRM Leads API
 */
export const crmLeadsAPI = {
    /**
     * Get all leads with filters
     */
    async getAll(filters?: LeadFilters, page = 1, limit = 10): Promise<{ leads: CRMLead[]; total: number }> {
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

        const response = await fetch(`${API_BASE_URL}/crm/leads?${params}`, {
            credentials: 'include',
        });
        const data: LeadResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch leads');
        }

        const leads = Array.isArray(data.data) ? data.data : [data.data];
        const total = data.pagination?.total || leads.length;

        return { leads, total };
    },

    /**
     * Get a specific lead by ID
     */
    async getById(id: string): Promise<CRMLead> {
        const response = await fetch(`${API_BASE_URL}/crm/leads/${id}`, {
            credentials: 'include',
        });
        const data: LeadResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch lead');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Get leads assigned to current user
     */
    async getMyLeads(): Promise<CRMLead[]> {
        const response = await fetch(`${API_BASE_URL}/crm/leads/my`, {
            credentials: 'include',
        });
        const data: LeadResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch your leads');
        }

        return Array.isArray(data.data) ? data.data : [data.data];
    },

    /**
     * Create a new lead
     */
    async create(leadData: CreateLeadInput): Promise<CRMLead> {
        const response = await fetch(`${API_BASE_URL}/crm/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData),
            credentials: 'include',
        });

        const data: LeadResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to create lead');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Update a lead
     */
    async update(id: string, updates: UpdateLeadInput): Promise<CRMLead> {
        const response = await fetch(`${API_BASE_URL}/crm/leads/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
            credentials: 'include',
        });

        const data: LeadResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to update lead');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Convert lead to customer
     */
    async convert(id: string): Promise<CRMLead> {
        const response = await fetch(`${API_BASE_URL}/crm/leads/${id}/convert`, {
            method: 'POST',
            credentials: 'include',
        });
        const data: LeadResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to convert lead');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Delete a lead
     */
    async delete(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/crm/leads/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        const data: LeadResponse = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to delete lead');
        }
    },
};

/**
 * CRM Activities API
 */
export const crmActivitiesAPI = {
    /**
     * Get activities for a lead
     */
    async getForLead(leadId: string): Promise<CRMActivity[]> {
        const response = await fetch(`${API_BASE_URL}/crm/leads/${leadId}/activities`, {
            credentials: 'include',
        });
        const data: ActivityResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch activities');
        }

        return Array.isArray(data.data) ? data.data : [data.data];
    },

    /**
     * Create an activity
     */
    async create(activityData: CreateActivityInput): Promise<CRMActivity> {
        const response = await fetch(`${API_BASE_URL}/crm/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activityData),
            credentials: 'include',
        });

        const data: ActivityResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to create activity');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Update an activity
     */
    async update(id: string, updates: UpdateActivityInput): Promise<CRMActivity> {
        const response = await fetch(`${API_BASE_URL}/crm/activities/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
            credentials: 'include',
        });

        const data: ActivityResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to update activity');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Complete an activity
     */
    async complete(id: string, outcome?: 'positive' | 'neutral' | 'negative'): Promise<CRMActivity> {
        const response = await fetch(`${API_BASE_URL}/crm/activities/${id}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ outcome }),
            credentials: 'include',
        });
        const data: ActivityResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to complete activity');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },
};

/**
 * CRM Tickets API
 */
export const crmTicketsAPI = {
    /**
     * Get all tickets with filters
     */
    async getAll(filters?: TicketFilters, page = 1, limit = 10): Promise<{ tickets: CRMTicket[]; total: number }> {
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

        const response = await fetch(`${API_BASE_URL}/crm/tickets?${params}`, {
            credentials: 'include',
        });
        const data: TicketResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch tickets');
        }

        const tickets = Array.isArray(data.data) ? data.data : [data.data];
        const total = data.pagination?.total || tickets.length;

        return { tickets, total };
    },

    /**
     * Get a specific ticket by ID
     */
    async getById(id: string): Promise<CRMTicket> {
        const response = await fetch(`${API_BASE_URL}/crm/tickets/${id}`, {
            credentials: 'include',
        });
        const data: TicketResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch ticket');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Get current user's tickets
     */
    async getMy(): Promise<CRMTicket[]> {
        const response = await fetch(`${API_BASE_URL}/crm/tickets/my`, {
            credentials: 'include',
        });
        const data: TicketResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch your tickets');
        }

        return Array.isArray(data.data) ? data.data : [data.data];
    },

    /**
     * Create a new ticket
     */
    async create(ticketData: CreateTicketInput): Promise<CRMTicket> {
        const response = await fetch(`${API_BASE_URL}/crm/tickets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticketData),
            credentials: 'include',
        });

        const data: TicketResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to create ticket');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Update a ticket
     */
    async update(id: string, updates: UpdateTicketInput): Promise<CRMTicket> {
        const response = await fetch(`${API_BASE_URL}/crm/tickets/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
            credentials: 'include',
        });

        const data: TicketResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to update ticket');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Assign ticket to user
     */
    async assign(id: string, userId: string): Promise<CRMTicket> {
        const response = await fetch(`${API_BASE_URL}/crm/tickets/${id}/assign`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
            credentials: 'include',
        });
        const data: TicketResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to assign ticket');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Resolve a ticket
     */
    async resolve(id: string, resolution: string): Promise<CRMTicket> {
        const response = await fetch(`${API_BASE_URL}/crm/tickets/${id}/resolve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resolution }),
            credentials: 'include',
        });
        const data: TicketResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to resolve ticket');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Close a ticket
     */
    async close(id: string): Promise<CRMTicket> {
        const response = await fetch(`${API_BASE_URL}/crm/tickets/${id}/close`, {
            method: 'POST',
            credentials: 'include',
        });
        const data: TicketResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to close ticket');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },

    /**
     * Get ticket comments
     */
    async getComments(ticketId: string): Promise<TicketComment[]> {
        const response = await fetch(`${API_BASE_URL}/crm/tickets/${ticketId}/comments`, {
            credentials: 'include',
        });
        const data: CommentResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch comments');
        }

        return Array.isArray(data.data) ? data.data : [data.data];
    },

    /**
     * Add comment to ticket
     */
    async addComment(commentData: CreateCommentInput): Promise<TicketComment> {
        const formData = new FormData();
        formData.append('ticketId', commentData.ticketId);
        formData.append('content', commentData.content);
        formData.append('internal', String(commentData.internal || false));

        if (commentData.attachments) {
            commentData.attachments.forEach((file) => {
                formData.append('attachments', file);
            });
        }

        const response = await fetch(`${API_BASE_URL}/crm/tickets/comments`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        const data: CommentResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to add comment');
        }

        return Array.isArray(data.data) ? data.data[0] : data.data;
    },
};

/**
 * CRM Analytics API
 */
export const crmAnalyticsAPI = {
    /**
     * Get CRM statistics
     */
    async getStats(): Promise<CRMStats> {
        const response = await fetch(`${API_BASE_URL}/crm/analytics/stats`, {
            credentials: 'include',
        });
        const data: CRMStatsResponse = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch CRM stats');
        }

        return data.data;
    },

    /**
     * Get pipeline data
     */
    async getPipeline(): Promise<PipelineStage[]> {
        const response = await fetch(`${API_BASE_URL}/crm/analytics/pipeline`, {
            credentials: 'include',
        });
        const data = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch pipeline');
        }

        return data.data;
    },

    /**
     * Get dashboard data
     */
    async getDashboard(): Promise<CRMDashboard> {
        const response = await fetch(`${API_BASE_URL}/crm/analytics/dashboard`, {
            credentials: 'include',
        });
        const data = await response.json();

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch dashboard data');
        }

        return data.data;
    },
};

/**
 * Combined CRM service
 */
export const crmService = {
    leads: crmLeadsAPI,
    activities: crmActivitiesAPI,
    tickets: crmTicketsAPI,
    analytics: crmAnalyticsAPI,
};

export default crmService;
