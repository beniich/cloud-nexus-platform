import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { MenuItem } from '../../types/menu';

// Fallback menu in case backend is offline
const FALLBACK_MENU: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/', roles: ['client', 'admin', 'owner'], type: 'internal' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp', path: '/analytics', roles: ['admin', 'owner'], type: 'internal' },
    { id: 'servers', label: 'Servers', icon: 'Server', path: '/servers', roles: ['admin', 'owner'], type: 'internal' },
    { id: 'users', label: 'Users', icon: 'Users', path: '/users', roles: ['admin', 'owner'], type: 'internal' },
    { id: 'cloud_spaces', label: 'Cloud Spaces', icon: 'Cloud', path: '/cloud-spaces', roles: ['admin', 'owner'], type: 'internal' },
];

export const useMenuConfig = () => {
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Use a default user role for now until AuthContext is fully migrated
    const user = { role: 'admin' };

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/api/menu-config', {
                    params: { role: user.role }
                });

                if (response.data && response.data.menu) {
                    setMenu(response.data.menu);
                } else {
                    setMenu(FALLBACK_MENU);
                }
            } catch (err) {
                console.error('Failed to load menu, using fallback', err);
                setMenu(FALLBACK_MENU); // Fallback
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    return { menu, loading, error };
};
