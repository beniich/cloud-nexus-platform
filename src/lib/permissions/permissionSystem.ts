import { api as apiClient } from '../api/secureAxios';

export enum Permission {
    // Users
    USERS_VIEW = 'users:view',
    USERS_CREATE = 'users:create',
    USERS_EDIT = 'users:edit',
    USERS_DELETE = 'users:delete',

    // Servers
    SERVERS_VIEW = 'servers:view',
    SERVERS_CREATE = 'servers:create',
    SERVERS_MANAGE = 'servers:manage',
    SERVERS_DELETE = 'servers:delete',

    // Cloud Spaces
    FILES_VIEW = 'files:view',
    FILES_UPLOAD = 'files:upload',
    FILES_DELETE = 'files:delete',
    FILES_SHARE = 'files:share',

    // CRM
    CRM_VIEW = 'crm:view',
    CRM_EDIT = 'crm:edit',
    CRM_DELETE = 'crm:delete',

    // AI
    AI_USE_GENERAL = 'ai:use:general',
    AI_USE_SERVERS = 'ai:use:servers',
    AI_USE_CODE = 'ai:use:code',

    // Admin
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
