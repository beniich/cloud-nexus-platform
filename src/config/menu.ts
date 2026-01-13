export const STORAGE_KEYS = {
    MENU_CONFIG: 'marketplace_menu_config',
    THEME: 'marketplace_theme',
    SIDEBAR: 'marketplace_sidebar',
};

export const DEFAULT_MENU_CONFIG = [];

export const menuByRole = {
    admin: [
        { label: "Dashboard Global", path: "/dashboard" },
        { label: "Utilisateurs", path: "/users" },
        { label: "Marketplace", path: "/marketplace" },
        { label: "Paramètres", path: "/settings" },
    ],
    vendor: [
        { label: "Mon Dashboard", path: "/vendor/dashboard" },
        { label: "Produits", path: "/vendor/products" },
        { label: "Commandes", path: "/vendor/orders" },
        { label: "Revenus", path: "/vendor/earnings" },
        { label: "Paramètres boutique", path: "/settings" },
    ],
};
