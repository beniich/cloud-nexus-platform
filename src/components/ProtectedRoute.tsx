import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Permission, permissionService } from '@/lib/permissions/permissionSystem';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPermissions?: Permission[];
    fallbackPath?: string;
    // Garder la compatibilité avec allowedRoles si nécessaire, ou le supprimer
    allowedRoles?: any[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredPermissions = [],
    fallbackPath = '/dashboard',
    allowedRoles // Deprecated in favor of permissions, but kept for signature compatibility if needed
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                // Charger les permissions si pas encore fait
                await permissionService.loadUserPermissions();

                // Si pas de permissions requises, accès autorisé (ou logique par défaut)
                if (requiredPermissions.length === 0) {
                    setHasAccess(true);
                } else {
                    // Vérifier les permissions
                    const access = permissionService.hasAllPermissions(requiredPermissions);
                    setHasAccess(access);
                }
            } catch (error) {
                console.error('Erreur de vérification des permissions:', error);
                setHasAccess(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkPermissions();
    }, [requiredPermissions]);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Vérification des permissions...</p>
                </div>
            </div>
        );
    }

    // No access
    if (!hasAccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <Alert variant="destructive">
                        <ShieldAlert className="h-5 w-5" />
                        <AlertDescription className="mt-2">
                            <h3 className="font-semibold mb-2">Accès refusé</h3>
                            <p className="mb-4">
                                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                            </p>
                            <div className="space-y-2">
                                <p className="text-sm">Permissions requises :</p>
                                <ul className="text-sm list-disc list-inside">
                                    {requiredPermissions.map(perm => (
                                        <li key={perm}>{perm}</li>
                                    ))}
                                </ul>
                            </div>
                        </AlertDescription>
                    </Alert>

                    <div className="mt-4 flex gap-2">
                        <Button
                            onClick={() => window.history.back()}
                            variant="outline"
                            className="flex-1"
                        >
                            Retour
                        </Button>
                        <Button
                            onClick={() => window.location.href = fallbackPath}
                            className="flex-1"
                        >
                            Tableau de bord
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Has access
    return <>{children}</>;
};

export default ProtectedRoute;
