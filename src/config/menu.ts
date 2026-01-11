import { MenuConfig } from '@/types/menu';

export const menuConfigFallback: MenuConfig = {
    version: "1.0.0",
    lastUpdated: "2026-01-11T16:00:00Z",
    menus: {
        client: [
            {
                id: "overview",
                label: "Vue d'ensemble",
                icon: "LayoutDashboard",
                path: "/dashboard",
                section: "overview",
                roles: ["client"],
                type: "internal"
            },
            {
                id: "orders",
                label: "Mes commandes",
                icon: "ShoppingBag",
                path: "/dashboard/orders",
                section: "orders",
                roles: ["client"],
                type: "internal"
            },
            {
                id: "invoices",
                label: "Mes factures",
                icon: "FileText",
                path: "/dashboard/invoices",
                section: "invoices",
                roles: ["client"],
                type: "internal"
            },
            {
                id: "services",
                label: "Services achetés",
                icon: "Package",
                path: "/dashboard/services",
                section: "services",
                roles: ["client"],
                type: "internal"
            },
            {
                id: "support",
                label: "Support",
                icon: "MessageSquare",
                path: "/dashboard/support",
                section: "support",
                roles: ["client"],
                type: "internal",
                badge: 1
            },
            {
                id: "settings",
                label: "Paramètres",
                icon: "Settings",
                path: "/dashboard/settings",
                section: "settings",
                roles: ["client"],
                type: "internal"
            }
        ],
        seller: [
            {
                id: "overview",
                label: "Vue d'ensemble",
                icon: "LayoutDashboard",
                path: "/dashboard",
                section: "overview",
                roles: ["seller"],
                type: "internal"
            },
            {
                id: "executive",
                label: "Vision Exécutive",
                icon: "Lightbulb",
                path: "/dashboard/executive",
                section: "executive",
                roles: ["seller"],
                type: "internal"
            },
            {
                id: "invoices",
                label: "Factures",
                icon: "FileText",
                path: "/dashboard/invoices",
                section: "invoices",
                roles: ["seller"],
                type: "internal"
            },
            {
                id: "products",
                label: "Mes produits",
                icon: "Package",
                path: "/dashboard/products",
                section: "products",
                roles: ["seller"],
                type: "internal"
            },
            {
                id: "sales",
                label: "Ventes",
                icon: "ShoppingBag",
                path: "/dashboard/sales",
                section: "sales",
                roles: ["seller"],
                type: "internal"
            },
            {
                id: "stats",
                label: "Statistiques",
                icon: "TrendingUp",
                path: "/dashboard/stats",
                section: "stats",
                roles: ["seller"],
                type: "internal"
            },
            {
                id: "messages",
                label: "Messages",
                icon: "MessageSquare",
                path: "/dashboard/messages",
                section: "messages",
                roles: ["seller"],
                type: "internal"
            },
            {
                id: "settings",
                label: "Paramètres",
                icon: "Settings",
                path: "/dashboard/settings",
                section: "settings",
                roles: ["seller"],
                type: "internal"
            }
        ],
        admin: [
            {
                id: "overview",
                label: "Vue d'ensemble",
                icon: "LayoutDashboard",
                path: "/dashboard",
                section: "overview",
                roles: ["admin"],
                type: "internal"
            },
            {
                id: "executive",
                label: "Vision Stratégique",
                icon: "Lightbulb",
                path: "/dashboard/executive",
                section: "executive",
                roles: ["admin"],
                type: "internal"
            },
            {
                id: "invoices",
                label: "Gestion Factures",
                icon: "FileText",
                path: "/dashboard/invoices",
                section: "invoices",
                roles: ["admin"],
                type: "internal"
            },
            {
                id: "users",
                label: "Utilisateurs",
                icon: "Users",
                path: "/dashboard/users",
                section: "users",
                roles: ["admin"],
                type: "internal"
            },
            {
                id: "products",
                label: "Produits",
                icon: "Package",
                path: "/dashboard/products",
                section: "products",
                roles: ["admin"],
                type: "internal"
            },
            {
                id: "analytics",
                label: "Analytics",
                icon: "TrendingUp",
                path: "/dashboard/analytics",
                section: "analytics",
                roles: ["admin"],
                type: "internal"
            },
            {
                id: "cloud_console",
                label: "Cloud Console",
                icon: "Cloud",
                path: "/cloud",
                roles: ["admin"],
                type: "external",
                color: "text-blue-500"
            },
            {
                id: "crm_hosting",
                label: "CRM Hébergement",
                icon: "Server",
                path: "/hosting",
                roles: ["admin"],
                type: "external",
                color: "text-emerald-600"
            },
            {
                id: "crm_hustel",
                label: "CRM Hustel",
                icon: "Briefcase",
                path: "/crm-hustel",
                roles: ["admin"],
                type: "external",
                color: "text-emerald-600",
                featureFlag: "crm_hustel_enabled"
            },
            {
                id: "settings",
                label: "Configuration",
                icon: "Settings",
                path: "/dashboard/settings",
                section: "config",
                roles: ["admin"],
                type: "internal"
            }
        ],
        owner: [ // Owner is same as admin
            {
                id: "overview",
                label: "Vue d'ensemble",
                icon: "LayoutDashboard",
                path: "/dashboard",
                section: "overview",
                roles: ["owner"],
                type: "internal"
            },
            {
                id: "executive",
                label: "Vision Stratégique",
                icon: "Lightbulb",
                path: "/dashboard/executive",
                section: "executive",
                roles: ["owner"],
                type: "internal"
            },
            {
                id: "invoices",
                label: "Gestion Factures",
                icon: "FileText",
                path: "/dashboard/invoices",
                section: "invoices",
                roles: ["owner"],
                type: "internal"
            },
            {
                id: "users",
                label: "Utilisateurs",
                icon: "Users",
                path: "/dashboard/users",
                section: "users",
                roles: ["owner"],
                type: "internal"
            },
            {
                id: "products",
                label: "Produits",
                icon: "Package",
                path: "/dashboard/products",
                section: "products",
                roles: ["owner"],
                type: "internal"
            },
            {
                id: "analytics",
                label: "Analytics",
                icon: "TrendingUp",
                path: "/dashboard/analytics",
                section: "analytics",
                roles: ["owner"],
                type: "internal"
            },
            {
                id: "cloud_console",
                label: "Cloud Console",
                icon: "Cloud",
                path: "/cloud",
                roles: ["owner"],
                type: "external",
                color: "text-blue-500"
            },
            {
                id: "crm_hosting",
                label: "CRM Hébergement",
                icon: "Server",
                path: "/hosting",
                roles: ["owner"],
                type: "external",
                color: "text-emerald-600"
            },
            {
                id: "crm_hustel",
                label: "CRM Hustel",
                icon: "Briefcase",
                path: "/crm-hustel",
                roles: ["owner"],
                type: "external",
                color: "text-emerald-600"
            },
            {
                id: "settings",
                label: "Configuration",
                icon: "Settings",
                path: "/dashboard/settings",
                section: "config",
                roles: ["owner"],
                type: "internal"
            }
        ]
    }
};
