import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface RoleAccessControl {
    hasRole: (requiredRole: UserRole | UserRole[]) => boolean;
    hasAnyRole: (roles: UserRole[]) => boolean;
    hasAllRoles: (roles: UserRole[]) => boolean;
    isAdmin: () => boolean;
    isVendor: () => boolean;
    isClient: () => boolean;
    canManagePayments: () => boolean;
    canViewCommissions: () => boolean;
    canCreateProducts: () => boolean;
}

/**
 * Hook pour contrôler l'accès basé sur les rôles
 */
export const useRoleAccess = (): RoleAccessControl => {
    const { user } = useAuth();

    const hasRole = (requiredRole: UserRole | UserRole[]): boolean => {
        if (!user) return false;

        if (Array.isArray(requiredRole)) {
            return requiredRole.includes(user.role);
        }

        return user.role === requiredRole;
    };

    const hasAnyRole = (roles: UserRole[]): boolean => {
        if (!user) return false;
        return roles.includes(user.role);
    };

    const hasAllRoles = (roles: UserRole[]): boolean => {
        // Note: Un utilisateur ne peut avoir qu'un seul rôle à la fois
        // Cette fonction est utile pour une extension future avec multi-rôles
        if (!user) return false;
        return roles.every(role => role === user.role);
    };

    const isAdmin = (): boolean => {
        return hasAnyRole(['admin', 'owner']);
    };

    const isVendor = (): boolean => {
        return hasAnyRole(['vendor', 'seller', 'admin', 'owner']);
    };

    const isClient = (): boolean => {
        // Tous les utilisateurs peuvent être clients
        return !!user;
    };

    const canManagePayments = (): boolean => {
        return isAdmin();
    };

    const canViewCommissions = (): boolean => {
        return hasAnyRole(['vendor', 'seller', 'admin', 'owner']);
    };

    const canCreateProducts = (): boolean => {
        return hasAnyRole(['vendor', 'seller', 'admin', 'owner']);
    };

    return {
        hasRole,
        hasAnyRole,
        hasAllRoles,
        isAdmin,
        isVendor,
        isClient,
        canManagePayments,
        canViewCommissions,
        canCreateProducts,
    };
};
