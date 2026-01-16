import { useState, useEffect } from 'react';
import { Permission, permissionService } from '@/lib/permissions/permissionSystem';

export const usePermissions = (requiredPermissions: Permission | Permission[]) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const check = async () => {
            await permissionService.loadUserPermissions();

            const permissions = Array.isArray(requiredPermissions)
                ? requiredPermissions
                : [requiredPermissions];

            const hasAccess = permissionService.hasAllPermissions(permissions);
            setHasPermission(hasAccess);
            setIsLoading(false);
        };

        check();
    }, [requiredPermissions]);

    return { hasPermission, isLoading };
};
