import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Configuration des menus par rôle
const MENU_CONFIG = {
    client: [
        { id: 'overview', label: "Vue d'ensemble", icon: 'LayoutDashboard', path: '/dashboard', roles: ['client'], type: 'internal' },
        { id: 'orders', label: 'Mes commandes', icon: 'ShoppingBag', path: '/dashboard/orders', roles: ['client'], type: 'internal' },
        { id: 'invoices', label: 'Mes factures', icon: 'FileText', path: '/dashboard/invoices', roles: ['client'], type: 'internal' },
        { id: 'services', label: 'Services achetés', icon: 'Package', path: '/dashboard/services', roles: ['client'], type: 'internal' },
        { id: 'support', label: 'Support', icon: 'MessageSquare', path: '/dashboard/support', roles: ['client'], type: 'internal', badge: 1 },
        { id: 'settings', label: 'Paramètres', icon: 'Settings', path: '/dashboard/settings', roles: ['client'], type: 'internal' }
    ],
    seller: [
        { id: 'overview', label: "Vue d'ensemble", icon: 'LayoutDashboard', path: '/dashboard', roles: ['seller'], type: 'internal' },
        { id: 'executive', label: 'Vision Exécutive', icon: 'Lightbulb', path: '/dashboard/executive', roles: ['seller'], type: 'internal' },
        { id: 'products', label: 'Mes produits', icon: 'Package', path: '/dashboard/products', roles: ['seller'], type: 'internal' },
        { id: 'sales', label: 'Ventes', icon: 'ShoppingBag', path: '/dashboard/sales', roles: ['seller'], type: 'internal' },
        { id: 'stats', label: 'Statistiques', icon: 'TrendingUp', path: '/dashboard/stats', roles: ['seller'], type: 'internal' },
        { id: 'messages', label: 'Messages', icon: 'MessageSquare', path: '/dashboard/messages', roles: ['seller'], type: 'internal' },
        { id: 'settings', label: 'Paramètres', icon: 'Settings', path: '/dashboard/settings', roles: ['seller'], type: 'internal' }
    ],
    admin: [
        { id: 'overview', label: "Vue d'ensemble", icon: 'LayoutDashboard', path: '/dashboard', roles: ['admin'], type: 'internal' },
        { id: 'servers', label: 'Serveurs', icon: 'Server', path: '/servers', roles: ['admin'], type: 'internal' },
        { id: 'users', label: 'Utilisateurs', icon: 'Users', path: '/users', roles: ['admin'], type: 'internal' },
        { id: 'analytics', label: 'Analytics', icon: 'TrendingUp', path: '/analytics', roles: ['admin'], type: 'internal' },
        { id: 'cloud_spaces', label: 'Cloud Spaces', icon: 'Cloud', path: '/cloud-spaces', roles: ['admin'], type: 'internal' },
        { id: 'settings', label: 'Configuration', icon: 'Settings', path: '/settings', roles: ['admin'], type: 'internal' }
    ],
    owner: [
        { id: 'overview', label: "Vue d'ensemble", icon: 'LayoutDashboard', path: '/dashboard', roles: ['owner'], type: 'internal' },
        { id: 'servers', label: 'Serveurs', icon: 'Server', path: '/servers', roles: ['owner'], type: 'internal' },
        { id: 'users', label: 'Utilisateurs', icon: 'Users', path: '/users', roles: ['owner'], type: 'internal' },
        { id: 'analytics', label: 'Analytics', icon: 'TrendingUp', path: '/analytics', roles: ['owner'], type: 'internal' },
        { id: 'cloud_spaces', label: 'Cloud Spaces', icon: 'Cloud', path: '/cloud-spaces', roles: ['owner'], type: 'internal' },
        { id: 'settings', label: 'Configuration', icon: 'Settings', path: '/settings', roles: ['owner'], type: 'internal' }
    ]
};

router.get('/', authMiddleware, apiLimiter, (req, res) => {
    try {
        const userRole = req.query.role || req.user?.role || 'client';
        const menu = MENU_CONFIG[userRole] || MENU_CONFIG.client;

        res.json({
            success: true,
            menu: menu,
            version: '1.0.0',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to load menu configuration'
        });
    }
});

export default router;
