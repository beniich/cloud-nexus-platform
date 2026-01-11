// ============================================
// CRM HUSTEL MODULE - TYPE DEFINITIONS
// ============================================

/**
 * Lead source - where the lead came from
 */
export type LeadSource =
    | 'website-form'
    | 'hosting-request'
    | 'service-request'
    | 'referral'
    | 'cold-call'
    | 'social-media'
    | 'event'
    | 'partner'
    | 'other';

/**
 * Lead status in the sales pipeline
 */
export type LeadStatus =
    | 'new'           // Just created
    | 'contacted'     // Initial contact made
    | 'qualified'     // Lead is qualified
    | 'proposal'      // Proposal sent
    | 'negotiation'   // In negotiation
    | 'won'           // Converted to customer
    | 'lost'          // Lost to competitor or no interest
    | 'nurturing';    // Not ready yet, keep warm

/**
 * Lead priority levels
 */
export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * CRM activity types
 */
export type ActivityType =
    | 'email'
    | 'call'
    | 'meeting'
    | 'note'
    | 'task'
    | 'demo'
    | 'proposal-sent'
    | 'follow-up';

/**
 * Ticket priority levels
 */
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Ticket status
 */
export type TicketStatus =
    | 'open'
    | 'in-progress'
    | 'waiting-customer'
    | 'waiting-internal'
    | 'resolved'
    | 'closed';

/**
 * Ticket categories
 */
export type TicketCategory =
    | 'technical'
    | 'billing'
    | 'general'
    | 'feature-request'
    | 'bug-report'
    | 'account'
    | 'other';

/**
 * CRM Lead - Represents a potential customer
 */
export interface CRMLead {
    id: string;

    // Customer information
    customerId?: string;
    customer?: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        company?: string;
    };

    // Lead details
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    company?: string;
    position?: string;

    // Lead classification
    source: LeadSource;
    status: LeadStatus;
    priority: LeadPriority;

    // Scoring
    score?: number; // 0-100
    temperature?: 'cold' | 'warm' | 'hot'; // Derived from score

    // Assignment
    assignedTo?: string;
    assignedUser?: {
        id: string;
        name: string;
        email: string;
    };

    // Sales information
    estimatedValue?: number;
    probability?: number; // 0-100
    expectedCloseDate?: Date;

    // Related data
    hostingRequestId?: string;
    tags?: string[];

    // Notes
    notes?: string;
    internalNotes?: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    lastContactedAt?: Date;
    convertedAt?: Date;
}

/**
 * CRM Activity - Interaction with a lead
 */
export interface CRMActivity {
    id: string;
    leadId: string;
    type: ActivityType;

    // Activity details
    subject: string;
    description?: string;

    // Outcome
    outcome?: 'positive' | 'neutral' | 'negative';
    nextAction?: string;

    // Scheduling
    scheduledAt?: Date;
    completedAt?: Date;
    dueDate?: Date;

    // Assignment
    createdBy: string;
    createdByUser?: {
        id: string;
        name: string;
    };
    assignedTo?: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

/**
 * CRM Ticket - Support or service ticket
 */
export interface CRMTicket {
    id: string;

    // Ticket identification
    ticketNumber: string; // Human-readable ID (e.g., TKT-0001)

    // Customer
    customerId: string;
    customer?: {
        id: string;
        name: string;
        email: string;
    };

    // Lead association (optional)
    leadId?: string;

    // Ticket details
    subject: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    status: TicketStatus;

    // Assignment
    assignedTo?: string;
    assignedUser?: {
        id: string;
        name: string;
    };

    // Resolution
    resolution?: string;
    resolvedAt?: Date;
    resolvedBy?: string;

    // SLA tracking
    slaDeadline?: Date;
    slaBreached?: boolean;
    responseTime?: number; // in minutes
    resolutionTime?: number; // in minutes

    // Tags
    tags?: string[];

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
}

/**
 * Ticket Comment
 */
export interface TicketComment {
    id: string;
    ticketId: string;
    userId: string;
    user?: {
        id: string;
        name: string;
        role: string;
    };

    content: string;
    internal: boolean; // Internal notes not visible to customer

    // Attachments
    attachments?: {
        id: string;
        filename: string;
        url: string;
        size: number;
    }[];

    createdAt: Date;
    updatedAt?: Date;
}

/**
 * Pipeline stage configuration
 */
export interface PipelineStage {
    id: string;
    name: string;
    status: LeadStatus;
    order: number;
    color?: string;
    leads?: CRMLead[];
    leadsCount?: number;
}

/**
 * Form inputs
 */
export interface CreateLeadInput {
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    company?: string;
    position?: string;
    source: LeadSource;
    priority?: LeadPriority;
    estimatedValue?: number;
    notes?: string;
    tags?: string[];
    assignedTo?: string;
}

export interface UpdateLeadInput {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    company?: string;
    position?: string;
    status?: LeadStatus;
    priority?: LeadPriority;
    score?: number;
    estimatedValue?: number;
    probability?: number;
    expectedCloseDate?: Date;
    notes?: string;
    internalNotes?: string;
    tags?: string[];
    assignedTo?: string;
}

export interface CreateActivityInput {
    leadId: string;
    type: ActivityType;
    subject: string;
    description?: string;
    scheduledAt?: Date;
    dueDate?: Date;
    assignedTo?: string;
}

export interface UpdateActivityInput {
    subject?: string;
    description?: string;
    outcome?: 'positive' | 'neutral' | 'negative';
    nextAction?: string;
    completedAt?: Date;
}

export interface CreateTicketInput {
    customerId: string;
    leadId?: string;
    subject: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    tags?: string[];
}

export interface UpdateTicketInput {
    subject?: string;
    description?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: TicketCategory;
    assignedTo?: string;
    resolution?: string;
    tags?: string[];
}

export interface CreateCommentInput {
    ticketId: string;
    content: string;
    internal?: boolean;
    attachments?: File[];
}

/**
 * Filters
 */
export interface LeadFilters {
    status?: LeadStatus | LeadStatus[];
    priority?: LeadPriority | LeadPriority[];
    source?: LeadSource | LeadSource[];
    assignedTo?: string;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
    tags?: string[];
    minValue?: number;
    maxValue?: number;
}

export interface TicketFilters {
    status?: TicketStatus | TicketStatus[];
    priority?: TicketPriority | TicketPriority[];
    category?: TicketCategory | TicketCategory[];
    assignedTo?: string;
    customerId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
    slaBreached?: boolean;
}

/**
 * Analytics and Statistics
 */
export interface CRMStats {
    // Leads
    totalLeads: number;
    newLeads: number;
    qualifiedLeads: number;
    wonLeads: number;
    lostLeads: number;

    // Conversion
    conversionRate: number; // percentage
    averageScore: number;
    averageDealValue: number;

    // Sales pipeline
    pipelineValue: number; // Total estimated value
    averageSalesCycle: number; // in days

    // By source
    leadsBySource: {
        source: LeadSource;
        count: number;
        conversionRate: number;
    }[];

    // Team performance
    topPerformers?: {
        userId: string;
        userName: string;
        leadsConverted: number;
        totalValue: number;
    }[];
}

export interface TicketStats {
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    averageResponseTime: number; // in minutes
    averageResolutionTime: number; // in minutes
    slaCompliance: number; // percentage

    ticketsByCategory: {
        category: TicketCategory;
        count: number;
    }[];

    ticketsByPriority: {
        priority: TicketPriority;
        count: number;
    }[];
}

/**
 * Dashboard data
 */
export interface CRMDashboard {
    stats: CRMStats;
    recentLeads: CRMLead[];
    upcomingActivities: CRMActivity[];
    pipeline: PipelineStage[];
    recentTickets: CRMTicket[];
}

/**
 * API Response types
 */
export interface LeadResponse {
    success: boolean;
    data?: CRMLead | CRMLead[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    error?: string;
}

export interface ActivityResponse {
    success: boolean;
    data?: CRMActivity | CRMActivity[];
    error?: string;
}

export interface TicketResponse {
    success: boolean;
    data?: CRMTicket | CRMTicket[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    error?: string;
}

export interface CommentResponse {
    success: boolean;
    data?: TicketComment | TicketComment[];
    error?: string;
}

export interface CRMStatsResponse {
    success: boolean;
    data?: CRMStats;
    error?: string;
}
