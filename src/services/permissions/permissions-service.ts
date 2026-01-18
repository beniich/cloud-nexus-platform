// src/services/permissions/permissions-service.ts

/**
 * Service de gestion des utilisateurs et permissions
 */

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';

export type Permission =
    // A/B Testing
    | 'ab_tests.create'
    | 'ab_tests.view'
    | 'ab_tests.start'
    | 'ab_tests.pause'
    | 'ab_tests.delete'
    | 'ab_tests.clone'

    // Fine-tuning
    | 'finetuning.create_dataset'
    | 'finetuning.view_dataset'
    | 'finetuning.delete_dataset'
    | 'finetuning.start_job'
    | 'finetuning.view_job'
    | 'finetuning.cancel_job'
    | 'finetuning.deploy_model'

    // Webhooks
    | 'webhooks.create'
    | 'webhooks.view'
    | 'webhooks.edit'
    | 'webhooks.delete'
    | 'webhooks.test'

    // Users
    | 'users.invite'
    | 'users.view'
    | 'users.edit'
    | 'users.delete'
    | 'users.manage_roles'

    // Settings
    | 'settings.view'
    | 'settings.edit'
    | 'settings.manage_billing'
    | 'settings.export_data'

    // General
    | 'all';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    permissions: Permission[];
    organizationId: string;
    status: 'active' | 'invited' | 'suspended';
    metadata: {
        createdAt: string;
        updatedAt: string;
        lastLogin?: string;
        invitedBy?: string;
    };
}

export interface Organization {
    id: string;
    name: string;
    plan: 'free' | 'basic' | 'pro' | 'enterprise';
    ownerId: string;
    settings: {
        maxUsers: number;
        features: string[];
    };
    metadata: {
        createdAt: string;
        updatedAt: string;
    };
}

export interface Invitation {
    id: string;
    email: string;
    role: UserRole;
    organizationId: string;
    invitedBy: string;
    status: 'pending' | 'accepted' | 'expired';
    expiresAt: string;
    createdAt: string;
}

export interface AuditLog {
    id: string;
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    metadata?: any;
    timestamp: string;
    ip?: string;
}

/**
 * Matrice de permissions par rôle
 */
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    owner: ['all'],
    admin: [
        'ab_tests.create', 'ab_tests.view', 'ab_tests.start', 'ab_tests.pause', 'ab_tests.delete', 'ab_tests.clone',
        'finetuning.create_dataset', 'finetuning.view_dataset', 'finetuning.delete_dataset',
        'finetuning.start_job', 'finetuning.view_job', 'finetuning.cancel_job', 'finetuning.deploy_model',
        'webhooks.create', 'webhooks.view', 'webhooks.edit', 'webhooks.delete', 'webhooks.test',
        'users.invite', 'users.view', 'users.edit',
        'settings.view', 'settings.edit', 'settings.export_data'
    ],
    editor: [
        'ab_tests.create', 'ab_tests.view', 'ab_tests.start', 'ab_tests.pause', 'ab_tests.clone',
        'finetuning.create_dataset', 'finetuning.view_dataset', 'finetuning.start_job', 'finetuning.view_job',
        'webhooks.view', 'webhooks.test',
        'users.view',
        'settings.view'
    ],
    viewer: [
        'ab_tests.view',
        'finetuning.view_dataset', 'finetuning.view_job',
        'webhooks.view',
        'users.view',
        'settings.view'
    ]
};

export class PermissionsService {
    private users: Map<string, User>;
    private organizations: Map<string, Organization>;
    private invitations: Map<string, Invitation>;
    private auditLogs: AuditLog[];
    private currentUserId: string | null = null;

    constructor() {
        this.users = new Map();
        this.organizations = new Map();
        this.invitations = new Map();
        this.auditLogs = [];
        this.loadData();
    }

    // ============================================================================
    // USER MANAGEMENT
    // ============================================================================

    /**
     * Crée un nouvel utilisateur
     */
    createUser(data: {
        email: string;
        name: string;
        role: UserRole;
        organizationId: string;
    }): User {
        const user: User = {
            id: this.generateId(),
            email: data.email,
            name: data.name,
            role: data.role,
            permissions: ROLE_PERMISSIONS[data.role],
            organizationId: data.organizationId,
            status: 'active',
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };

        this.users.set(user.id, user);
        this.saveData();
        this.logAction('user.created', 'user', user.id, { role: data.role });

        return user;
    }

    /**
     * Invite un utilisateur
     */
    inviteUser(email: string, role: UserRole, organizationId: string): Invitation {
        // Vérifier les permissions
        this.requirePermission('users.invite');

        // Vérifier si l'email existe déjà
        const existingUser = Array.from(this.users.values()).find(
            u => u.email === email && u.organizationId === organizationId
        );

        if (existingUser) {
            throw new Error('User already exists in this organization');
        }

        const invitation: Invitation = {
            id: this.generateId(),
            email,
            role,
            organizationId,
            invitedBy: this.currentUserId!,
            status: 'pending',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours
            createdAt: new Date().toISOString()
        };

        this.invitations.set(invitation.id, invitation);
        this.saveData();
        this.logAction('user.invited', 'invitation', invitation.id, { email, role });

        // Envoyer l'email d'invitation (simulation)
        this.sendInvitationEmail(invitation);

        return invitation;
    }

    /**
     * Accepte une invitation
     */
    acceptInvitation(invitationId: string, userData: { name: string }): User {
        const invitation = this.invitations.get(invitationId);
        if (!invitation) throw new Error('Invitation not found');

        if (invitation.status !== 'pending') {
            throw new Error('Invitation has already been used');
        }

        if (new Date(invitation.expiresAt) < new Date()) {
            invitation.status = 'expired';
            throw new Error('Invitation has expired');
        }

        const user = this.createUser({
            email: invitation.email,
            name: userData.name,
            role: invitation.role,
            organizationId: invitation.organizationId
        });

        invitation.status = 'accepted';
        this.saveData();

        return user;
    }

    /**
     * Met à jour le rôle d'un utilisateur
     */
    updateUserRole(userId: string, newRole: UserRole): void {
        this.requirePermission('users.manage_roles');

        const user = this.users.get(userId);
        if (!user) throw new Error('User not found');

        const oldRole = user.role;
        user.role = newRole;
        user.permissions = ROLE_PERMISSIONS[newRole];
        user.metadata.updatedAt = new Date().toISOString();

        this.saveData();
        this.logAction('user.role_changed', 'user', userId, { oldRole, newRole });
    }

    /**
     * Supprime un utilisateur
     */
    deleteUser(userId: string): void {
        this.requirePermission('users.delete');

        const user = this.users.get(userId);
        if (!user) throw new Error('User not found');

        if (user.role === 'owner') {
            throw new Error('Cannot delete organization owner');
        }

        this.users.delete(userId);
        this.saveData();
        this.logAction('user.deleted', 'user', userId);
    }

    /**
     * Suspend un utilisateur
     */
    suspendUser(userId: string): void {
        this.requirePermission('users.edit');

        const user = this.users.get(userId);
        if (!user) throw new Error('User not found');

        user.status = 'suspended';
        user.metadata.updatedAt = new Date().toISOString();

        this.saveData();
        this.logAction('user.suspended', 'user', userId);
    }

    // ============================================================================
    // ORGANIZATION MANAGEMENT
    // ============================================================================

    /**
     * Crée une organisation
     */
    createOrganization(data: {
        name: string;
        ownerId: string;
        plan?: Organization['plan'];
    }): Organization {
        const organization: Organization = {
            id: this.generateId(),
            name: data.name,
            plan: data.plan || 'free',
            ownerId: data.ownerId,
            settings: {
                maxUsers: this.getMaxUsers(data.plan || 'free'),
                features: this.getPlanFeatures(data.plan || 'free')
            },
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };

        this.organizations.set(organization.id, organization);
        this.saveData();

        return organization;
    }

    /**
     * Obtient le nombre maximum d'utilisateurs selon le plan
     */
    private getMaxUsers(plan: Organization['plan']): number {
        const limits = {
            free: 1,
            basic: 5,
            pro: 20,
            enterprise: -1 // Illimité
        };
        return limits[plan];
    }

    /**
     * Obtient les features selon le plan
     */
    private getPlanFeatures(plan: Organization['plan']): string[] {
        const features: Record<Organization['plan'], string[]> = {
            free: ['ab_tests', 'basic_analytics'],
            basic: ['ab_tests', 'basic_analytics', 'webhooks', 'finetuning'],
            pro: ['ab_tests', 'advanced_analytics', 'webhooks', 'finetuning', 'custom_models'],
            enterprise: ['all']
        };
        return features[plan];
    }

    // ============================================================================
    // PERMISSIONS
    // ============================================================================

    /**
     * Définit l'utilisateur courant
     */
    setCurrentUser(userId: string): void {
        if (!this.users.has(userId)) {
            throw new Error('User not found');
        }
        this.currentUserId = userId;
    }

    /**
     * Vérifie si l'utilisateur courant a une permission
     */
    hasPermission(permission: Permission): boolean {
        if (!this.currentUserId) return false;

        const user = this.users.get(this.currentUserId);
        if (!user) return false;

        if (user.status !== 'active') return false;

        // Owner a toutes les permissions
        if (user.permissions.includes('all')) return true;

        return user.permissions.includes(permission);
    }

    /**
     * Requiert une permission (throw si non autorisé)
     */
    requirePermission(permission: Permission): void {
        if (!this.hasPermission(permission)) {
            throw new Error(`Permission denied: ${permission}`);
        }
    }

    /**
     * Récupère les permissions de l'utilisateur courant
     */
    getCurrentUserPermissions(): Permission[] {
        if (!this.currentUserId) return [];

        const user = this.users.get(this.currentUserId);
        return user ? user.permissions : [];
    }

    /**
     * Vérifie si une feature est disponible pour l'organisation
     */
    hasFeature(organizationId: string, feature: string): boolean {
        const org = this.organizations.get(organizationId);
        if (!org) return false;

        return org.settings.features.includes('all') ||
            org.settings.features.includes(feature);
    }

    // ============================================================================
    // AUDIT LOGS
    // ============================================================================

    /**
     * Log une action
     */
    private logAction(
        action: string,
        resource: string,
        resourceId?: string,
        metadata?: any
    ): void {
        const log: AuditLog = {
            id: this.generateId(),
            userId: this.currentUserId!,
            action,
            resource,
            resourceId,
            metadata,
            timestamp: new Date().toISOString()
        };

        this.auditLogs.push(log);

        // Garder seulement les 1000 derniers logs
        if (this.auditLogs.length > 1000) {
            this.auditLogs = this.auditLogs.slice(-1000);
        }

        this.saveData();
    }

    /**
     * Récupère l'historique d'audit
     */
    getAuditLogs(filter?: {
        userId?: string;
        action?: string;
        resource?: string;
        startDate?: string;
        endDate?: string;
        limit?: number;
    }): AuditLog[] {
        this.requirePermission('settings.view');

        let logs = [...this.auditLogs];

        if (filter) {
            if (filter.userId) {
                logs = logs.filter(l => l.userId === filter.userId);
            }
            if (filter.action) {
                logs = logs.filter(l => l.action === filter.action);
            }
            if (filter.resource) {
                logs = logs.filter(l => l.resource === filter.resource);
            }
            if (filter.startDate) {
                logs = logs.filter(l => l.timestamp >= filter.startDate!);
            }
            if (filter.endDate) {
                logs = logs.filter(l => l.timestamp <= filter.endDate!);
            }
        }

        logs.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        if (filter?.limit) {
            logs = logs.slice(0, filter.limit);
        }

        return logs;
    }

    // ============================================================================
    // QUERIES
    // ============================================================================

    /**
     * Récupère tous les utilisateurs d'une organisation
     */
    getOrganizationUsers(organizationId: string): User[] {
        this.requirePermission('users.view');

        return Array.from(this.users.values())
            .filter(u => u.organizationId === organizationId)
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * Récupère les invitations en attente
     */
    getPendingInvitations(organizationId: string): Invitation[] {
        this.requirePermission('users.view');

        return Array.from(this.invitations.values())
            .filter(i => i.organizationId === organizationId && i.status === 'pending');
    }

    /**
     * Récupère un utilisateur par email
     */
    getUserByEmail(email: string): User | undefined {
        return Array.from(this.users.values()).find(u => u.email === email);
    }

    /**
     * Récupère l'utilisateur courant
     */
    getCurrentUser(): User | null {
        if (!this.currentUserId) return null;
        return this.users.get(this.currentUserId) || null;
    }

    // ============================================================================
    // UTILITIES
    // ============================================================================

    /**
     * Envoie un email d'invitation (simulation)
     */
    private sendInvitationEmail(invitation: Invitation): void {
        console.log(`[EMAIL] Invitation sent to ${invitation.email}`);
        console.log(`Accept invitation: /accept-invite/${invitation.id}`);
    }

    /**
     * Vérifie si l'organisation peut ajouter plus d'utilisateurs
     */
    canAddUser(organizationId: string): boolean {
        const org = this.organizations.get(organizationId);
        if (!org) return false;

        const currentUsers = this.getOrganizationUsers(organizationId).length;

        // -1 = illimité
        if (org.settings.maxUsers === -1) return true;

        return currentUsers < org.settings.maxUsers;
    }

    // ============================================================================
    // PERSISTENCE
    // ============================================================================

    private loadData(): void {
        try {
            const users = localStorage.getItem('users');
            if (users) {
                this.users = new Map(Object.entries(JSON.parse(users)));
            }

            const orgs = localStorage.getItem('organizations');
            if (orgs) {
                this.organizations = new Map(Object.entries(JSON.parse(orgs)));
            }

            const invitations = localStorage.getItem('invitations');
            if (invitations) {
                this.invitations = new Map(Object.entries(JSON.parse(invitations)));
            }

            const logs = localStorage.getItem('audit_logs');
            if (logs) {
                this.auditLogs = JSON.parse(logs);
            }
        } catch (error) {
            console.error('Failed to load permissions data:', error);
        }
    }

    private saveData(): void {
        try {
            localStorage.setItem('users', JSON.stringify(Object.fromEntries(this.users)));
            localStorage.setItem('organizations', JSON.stringify(Object.fromEntries(this.organizations)));
            localStorage.setItem('invitations', JSON.stringify(Object.fromEntries(this.invitations)));
            localStorage.setItem('audit_logs', JSON.stringify(this.auditLogs));
        } catch (error) {
            console.error('Failed to save permissions data:', error);
        }
    }

    private generateId(): string {
        return `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

export default PermissionsService;
