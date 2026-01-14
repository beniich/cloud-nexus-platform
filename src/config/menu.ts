export const STORAGE_KEYS = {
    MENU_CONFIG: 'marketplace_menu_config',
    THEME: 'marketplace_theme',
    SIDEBAR: 'marketplace_sidebar',
};

export const DEFAULT_MENU_CONFIG = [
    {
        id: 'dashboard',
        label: "Vue d'ensemble",
        icon: 'LayoutDashboard',
        path: '/dashboard',
        type: 'internal',
        roles: ['admin', 'owner', 'client', 'seller']
    },
    {
        id: 'cloud',
        label: "Cloud Spaces",
        icon: 'Cloud',
        path: '/cloud-spaces',
        type: 'internal',
        roles: ['admin', 'owner', 'client']
    },
    {
        id: 'servers',
        label: "Serveurs",
        icon: 'Server',
        path: '/servers',
        type: 'internal',
        roles: ['admin', 'owner', 'client']
    },
    {
        id: 'hosting',
        label: "Hébergement",
        icon: 'HardDrive',
        path: '/hosting',
        type: 'internal',
        roles: ['admin', 'owner', 'client']
    },
    {
        id: 'crm',
        label: "CRM LivePulse",
        icon: 'TrendingUp',
        path: '/crm/live-pulse',
        type: 'internal',
        roles: ['admin', 'owner', 'seller']
    },
    {
        id: 'crm-hustel',
        label: "CRM Hustel",
        icon: 'Users',
        path: '/crm/hustel',
        type: 'internal',
        roles: ['admin', 'owner', 'seller']
    },
    {
        id: 'marketplace',
        label: "Marketplace",
        icon: 'ShoppingBag',
        path: '/shop',
        type: 'internal',
        roles: ['client', 'admin', 'owner']
    },
    {
        id: 'users',
        label: "Utilisateurs",
        icon: 'Users',
        path: '/users',
        type: 'internal',
        roles: ['admin', 'owner']
    },
    {
        id: 'cms',
        label: "Contenu (CMS)",
        icon: 'FileText',
        path: '/cms',
        type: 'internal',
        roles: ['admin', 'owner', 'seller']
    },
    {
        id: 'billing',
        label: "Facturation",
        icon: 'MessageSquare',
        path: '/billing',
        type: 'internal',
        roles: ['admin', 'owner', 'client']
    },
    {
        id: 'settings',
        label: "Paramètres",
        icon: 'Settings',
        path: '/settings',
        type: 'internal',
        roles: ['admin', 'owner', 'client', 'seller']
    }
];
