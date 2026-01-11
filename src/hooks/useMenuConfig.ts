
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api/client';
import { menuConfigFallback } from '@/config/menu';
import { MenuItem, UserRole } from '@/types/menu';

// Simple mock for Feature Flags until implemented
const useFeatureFlags = () => {
    return {
        isEnabled: (flag: string) => true
    };
};

interface UseMenuConfigReturn {
    menu: MenuItem[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export const useMenuConfig = (): UseMenuConfigReturn => {
    const { user } = useAuth();
    const { isEnabled } = useFeatureFlags();
    const [rawMenu, setRawMenu] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Fonction de chargement
    const fetchMenu = async () => {
        // If not logged in, wait or return empty
        // if (!user) { setLoading(false); return; } 

        setLoading(true);
        setError(null);

        try {
            // API call to backend
            const response = await apiClient.get<{ menu: MenuItem[] }>('/menu-config', {
                params: { role: user?.role || 'client' }
            });
            console.log('✅ Menu loaded from API:', response.data.menu);
            setRawMenu(response.data.menu);

        } catch (err) {
            console.warn('⚠️ Failed to load menu from API, using fallback', err);
            // Fallback
            const userRole = user?.role as UserRole || 'client';
            const fallbackMenu = menuConfigFallback.menus[userRole] || menuConfigFallback.menus.client;
            setRawMenu(fallbackMenu);
        } finally {
            setLoading(false);
        }
    };

    // Charger au montage et quand le rôle change
    useEffect(() => {
        fetchMenu();
    }, [user?.role]);

    // Filtrer le menu selon les feature flags
    const filteredMenu = useMemo(() => {
        return rawMenu.filter(item => {
            // Si l'item a un feature flag, vérifier s'il est activé
            if (item.featureFlag) {
                return isEnabled(item.featureFlag);
            }
            return true;
        });
    }, [rawMenu, isEnabled]);

    return {
        menu: filteredMenu,
        loading,
        error,
        refetch: fetchMenu
    };
};
