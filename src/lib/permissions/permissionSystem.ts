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

    // Sites (Paid Feature)
    SITES_VIEW = 'sites:view',
    SITES_CREATE = 'sites:create',
    SITES_MANAGE = 'sites:manage',

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
            // Simulation d'appel API pour les permissions
            // Dans un cas réel, ceci viendrait du backend basé sur le rôle et l'abonnement

            // On simule des permissions de base pour tous (Plan Gratuit)
            const basePermissions = [
                Permission.DASHBOARD_VIEW,
                Permission.PRODUCTS_VIEW,
                Permission.CRM_VIEW,
                Permission.FILES_VIEW, // Cloud spaces accessible
                Permission.USERS_VIEW // Team view
            ];

            // On regarde si on a un flag "PREMIUM" dans le localStorage (pour simulation)
            const isPremium = localStorage.getItem('cnp_simulation_plan') === 'premium';

            const permissions = [...basePermissions];

            if (isPremium) {
                // Plan Payant : Accès Création Site Web
                permissions.push(
                    Permission.SITES_VIEW,
                    Permission.SITES_CREATE,
                    Permission.SITES_MANAGE,
                    Permission.AI_USE_GENERAL,
                    Permission.AI_USE_CODE
                );
            }

            this.userPermissions = new Set(permissions);

            // Fallback API call if exists (commented out for reliable simulation)
            // const response = await apiClient.get<{ permissions: Permission[] }>('/auth/permissions');
            // this.userPermissions = new Set(response.data.permissions);
        } catch (error) {
            console.error('Erreur lors du chargement des permissions:', error);
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
