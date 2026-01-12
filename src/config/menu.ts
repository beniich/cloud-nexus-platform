import { MenuConfig, MenuItem } from '@/types/menu';

export const DEFAULT_MENU_CONFIG: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'LayoutDashboard',
        path: '/dashboard',
        roles: ['owner', 'admin', 'manager', 'user', 'client'], // Expanded roles for visibility
        type: 'internal',
        badge: undefined
    },
    {
        id: 'cloud-spaces',
        label: 'Cloud Spaces',
        icon: 'Cloud',
        path: '/cloud-spaces',
        roles: ['owner', 'admin'],
        type: 'internal',
        badge: undefined,
        children: [
            { id: 'spaces-browser', label: 'Fichiers', path: '/cloud-spaces/browser', icon: 'Database', roles: ['owner', 'admin'], type: 'internal' },
            { id: 'spaces-upload', label: 'Upload', path: '/cloud-spaces/upload', icon: 'Upload', roles: ['owner', 'admin'], type: 'internal' }
        ]
    },
    {
        id: 'servers',
        label: 'Serveurs',
        icon: 'Server',
        path: '/servers',
        roles: ['owner', 'admin'],
        type: 'internal',
        badge: 3 // Handled as number in component
    },
    {
        id: 'products',
        label: 'Produits',
        icon: 'Package',
        path: '/products',
        roles: ['owner', 'admin', 'manager'],
        type: 'internal'
    },
    {
        id: 'users',
        label: 'Utilisateurs',
        icon: 'Users',
        path: '/users',
        roles: ['owner', 'admin'],
        type: 'internal'
    },
    {
        id: 'analytics',
        label: 'Analytics',
        icon: 'TrendingUp',
        path: '/analytics',
        roles: ['owner', 'admin', 'manager'],
        type: 'internal'
    },
    {
        id: 'hosting-request',
        label: 'Demande Hébergement',
        icon: 'Server',
        path: '/hosting-request',
        roles: ['owner', 'admin', 'manager', 'user', 'client'],
        type: 'internal'
    },
    {
        id: 'products-management',
        label: 'Gestion Produits',
        icon: 'Package',
        path: '/products-management',
        roles: ['owner', 'admin'],
        type: 'internal'
    },
    {
        id: 'crm',
        label: 'CRM Hustel',
        icon: 'Users',
        path: '/crm',
        roles: ['owner', 'admin', 'manager'],
        type: 'internal',
        children: [
            { id: 'live-pulse', label: 'Live Pulse', path: '/crm/live-pulse', icon: 'Activity', roles: ['owner', 'admin'], type: 'internal' },
            { id: 'tickets', label: 'Tickets Support', path: '/crm/tickets', icon: 'MessageSquare', roles: ['owner', 'admin'], type: 'internal' },
            { id: 'pipeline', label: 'Pipeline Ventes', path: '/crm/pipeline', icon: 'BarChart2', roles: ['owner', 'admin'], type: 'internal' },
            { id: 'crm-hustel', label: 'Vue Hustel', path: '/crm/hustel', icon: 'Layout', roles: ['owner', 'admin'], type: 'internal' },
            { id: 'crm-tickets', label: 'Support Tickets', path: '/crm/tickets', icon: 'LifeBuoy', roles: ['owner', 'admin'], type: 'internal' }
        ]
    },
    {
        id: 'settings',
        label: 'Paramètres',
        icon: 'Settings',
        path: '/settings',
        roles: ['owner', 'admin', 'manager', 'user'],
        type: 'internal'
    }
];

export const STORAGE_KEYS = {
    USER: 'app_user',
    SIDEBAR: 'sidebar_state',
    THEME: 'app_theme',
    MENU_CONFIG: 'menu_config'
};

// Aligning with existing UserRole type
export const ROLES = {
    SUPER_ADMIN: 'owner',
    ADMIN: 'admin',
    MANAGER: 'seller', // Mapping manager to seller for compatibility
    USER: 'client',
    CLIENT: 'client'
};
