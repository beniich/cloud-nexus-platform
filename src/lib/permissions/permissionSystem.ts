import { api as apiClient } from '../api/secureAxios';

export enum Permission {
    // Dashboard
    DASHBOARD_VIEW = 'dashboard:view',

    // Products
    PRODUCTS_VIEW = 'products:view',
    PRODUCTS_CREATE = 'products:create',
    PRODUCTS_EDIT = 'products:edit',
    PRODUCTS_DELETE = 'products:delete',

    // Orders
    ORDERS_VIEW = 'orders:view',
    ORDERS_MANAGE = 'orders:manage',

    // Users
    USERS_VIEW = 'users:view',
    USERS_MANAGE = 'users:manage',

    // Analytics
    ANALYTICS_VIEW = 'analytics:view',
    ANALYTICS_EDIT = 'analytics:edit',

    // AI
    AI_USE_GENERAL = 'ai:use:general',
    AI_USE_SERVERS = 'ai:use:servers',
    AI_USE_CODE = 'ai:use:code',

    // Servers
    SERVERS_VIEW = 'servers:view',
    SERVERS_MANAGE = 'servers:manage',

    // Files (Cloud Spaces)
    FILES_VIEW = 'files:view',
    FILES_MANAGE = 'files:manage',

    // CRM
    CRM_VIEW = 'crm:view',

    // Admin
    ADMIN = 'admin:all',
    ADMIN_FULL = 'admin:*',
}

export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}

class PermissionService {
    private userPermissions: Set<Permission> = new Set();

    /**
     * Charger les permissions de l'utilisateur
     */
    async loadUserPermissions(): Promise<void> {
        try {
            // Note: Utilisation de apiClient existant temporairement, sera remplacé par secureApi
            const response = await apiClient.get<{ permissions: Permission[] }>('/auth/permissions');
            this.userPermissions = new Set(response.data.permissions);
        } catch (error) {
            console.error('Erreur lors du chargement des permissions:', error);
            // En cas d'erreur ou de mock, on peut définir des permissions par défaut selon le rôle si disponible ailleurs
            this.userPermissions = new Set();
        }
    }

    /**
     * Vérifier une permission
     */
    hasPermission(permission: Permission): boolean {
        // Admin a toutes les permissions
        if (this.userPermissions.has(Permission.ADMIN_FULL)) {
            return true;
        }

        return this.userPermissions.has(permission);
    }

    /**
     * Vérifier plusieurs permissions (ET logique)
     */
    hasAllPermissions(permissions: Permission[]): boolean {
        return permissions.every(p => this.hasPermission(p));
    }

    /**
     * Vérifier au moins une permission (OU logique)
     */
    hasAnyPermission(permissions: Permission[]): boolean {
        return permissions.some(p => this.hasPermission(p));
    }

    /**
     * Obtenir toutes les permissions
     */
    getPermissions(): Permission[] {
        return Array.from(this.userPermissions);
    }

    // Helper pour setter manuellement (pour les mocks/dev)
    setPermissions(permissions: Permission[]) {
        this.userPermissions = new Set(permissions);
    }
}

export const permissionService = new PermissionService();
