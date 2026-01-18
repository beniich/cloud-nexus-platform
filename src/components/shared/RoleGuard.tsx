import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { AlertCircle, Lock } from 'lucide-react';

interface RoleGuardProps {
    children: ReactNode;
    requiredRole?: UserRole | UserRole[];
    fallback?: ReactNode;
    redirectTo?: string;
}

/**
 * Composant pour protéger l'accès aux routes/composants selon le rôle
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
    children,
    requiredRole,
    fallback,
    redirectTo = '/unauthorized',
}) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const { hasRole } = useRoleAccess();

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Check role if required
    if (requiredRole && !hasRole(requiredRole)) {
        if (fallback) {
            return <>{fallback}</>;
        }

        if (redirectTo) {
            return <Navigate to={redirectTo} replace />;
        }

        // Default unauthorized UI
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                        <Lock className="w-8 h-8 text-red-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Accès refusé
                    </h1>

                    <p className="text-gray-600 mb-6">
                        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                    </p>

                    <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="text-left">
                            <p className="text-sm font-medium text-yellow-900">
                                Votre rôle actuel: <span className="font-bold">{user.role}</span>
                            </p>
                            <p className="text-sm text-yellow-700 mt-1">
                                Rôle requis: {Array.isArray(requiredRole) ? requiredRole.join(' ou ') : requiredRole}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    // Authorized
    return <>{children}</>;
};

// Variantes spécifiques pour plus de commodité
export const AdminGuard: React.FC<{ children: ReactNode }> = ({ children }) => (
    <RoleGuard requiredRole={['admin', 'owner']}>{children}</RoleGuard>
);

export const VendorGuard: React.FC<{ children: ReactNode }> = ({ children }) => (
    <RoleGuard requiredRole={['vendor', 'seller', 'admin', 'owner']}>{children}</RoleGuard>
);

export const ClientGuard: React.FC<{ children: ReactNode }> = ({ children }) => (
    <RoleGuard requiredRole={['client', 'vendor', 'seller', 'admin', 'owner']}>{children}</RoleGuard>
);
