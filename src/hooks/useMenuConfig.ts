import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_MENU_CONFIG, STORAGE_KEYS } from '@/config/menu';
import { MenuItem } from '@/types/menu';

export const useMenuConfig = () => {
    const { user } = useAuth();
    const [menuConfig, setMenuConfig] = useLocalStorage<MenuItem[]>(STORAGE_KEYS.MENU_CONFIG, DEFAULT_MENU_CONFIG);
    const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>([]);

    useEffect(() => {
        if (!user || !user.role) {
            setFilteredMenu([]);
            return;
        }

        const filterItems = (items: MenuItem[]): MenuItem[] => {
            return items.filter(item => {
                const hasRole = !item.roles || item.roles.includes(user.role as any);
                if (!hasRole) return false;

                if (item.children) {
                    item.children = filterItems(item.children); // Recursively filter children
                }
                return true;
            });
        };

        const filtered = filterItems(JSON.parse(JSON.stringify(menuConfig))); // Deep copy to avoid mutating state directly during recursion
        setFilteredMenu(filtered);
    }, [menuConfig, user]);

    return { menu: filteredMenu, setMenuConfig };
};
