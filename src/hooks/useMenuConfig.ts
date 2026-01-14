import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_MENU_CONFIG, STORAGE_KEYS } from '@/config/menu';
import { MenuItem, UserRole } from '@/types/menu';

export const useMenuConfig = () => {
    const { user } = useAuth();
    const [menuConfig, setMenuConfig] = useLocalStorage<MenuItem[]>(STORAGE_KEYS.MENU_CONFIG, DEFAULT_MENU_CONFIG);
    const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>([]);

    useEffect(() => {
        console.log('[useMenuConfig] User:', user);
        console.log('[useMenuConfig] MenuConfig from localStorage:', menuConfig);

        if (!user || !user.role) {
            console.log('[useMenuConfig] No user or role, setting empty menu');
            setFilteredMenu([]);
            return;
        }

        // Ensure we have a valid menu config
        const configToUse = menuConfig && menuConfig.length > 0 ? menuConfig : DEFAULT_MENU_CONFIG;
        console.log('[useMenuConfig] Config to use:', configToUse);

        const filterItems = (items: MenuItem[]): MenuItem[] => {
            return items.filter(item => {
                const hasRole = !item.roles || item.roles.includes(user.role as UserRole);
                console.log(`[useMenuConfig] Checking ${item.label} for role ${user.role}:`, hasRole);
                if (!hasRole) return false;

                if (item.children) {
                    item.children = filterItems(item.children); // Recursively filter children
                }
                return true;
            });
        };

        const filtered = filterItems(JSON.parse(JSON.stringify(configToUse))); // Deep copy to avoid mutating state directly during recursion
        console.log('[useMenuConfig] Filtered menu:', filtered);
        setFilteredMenu(filtered);
    }, [menuConfig, user]);

    return { menu: filteredMenu, setMenuConfig };
};
