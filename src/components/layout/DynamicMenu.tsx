import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    CreditCard,
    DollarSign,
    Package,
    ShoppingCart,
    Users,
    Settings,
    FileText,
    TrendingUp,
    Server,
    BarChart3,
    Globe
} from 'lucide-react';

interface MenuItem {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: string[];
    badge?: string;
}

const MENU_ITEMS: MenuItem[] = [
    // ===== ADMIN SECTION =====
    {
        label: 'Dashboard Admin',
        path: '/admin',
        icon: LayoutDashboard,
        roles: ['admin', 'owner']
    },
    {
        label: 'Config. Paiement',
        path: '/admin/payment-settings',
        icon: CreditCard,
        roles: ['admin', 'owner'],
        badge: 'NEW'
    },
    {
        label: 'Gestion Vendeurs',
        path: '/admin/vendors',
        icon: Users,
        roles: ['admin', 'owner']
    },
    {
        label: 'Toutes les commandes',
        path: '/admin/orders',
        icon: ShoppingCart,
        roles: ['admin', 'owner']
    },
    {
        label: 'Analytics',
        path: '/analytics',
        icon: BarChart3,
        roles: ['admin', 'owner']
    },

    // ===== VENDEUR SECTION =====
    {
        label: 'Mon Dashboard',
        path: '/vendor/dashboard',
        icon: TrendingUp,
        roles: ['vendor', 'seller']
    },
    {
        label: 'Mes Produits',
        path: '/vendor/products',
        icon: Package,
        roles: ['vendor', 'seller']
    },
    {
        label: 'Mes Ventes',
        path: '/vendor/sales',
        icon: DollarSign,
        roles: ['vendor', 'seller']
    },
    {
        label: 'Mes Clients',
        path: '/vendor/customers',
        icon: Users,
        roles: ['vendor', 'seller']
    },

    // ===== CLIENT SECTION =====
    {
        label: 'Mes Commandes',
        path: '/orders',
        icon: ShoppingCart,
        roles: ['client', 'vendor', 'seller', 'admin', 'owner', 'user']
    },
    {
        label: 'Mes Factures',
        path: '/invoices',
        icon: FileText,
        roles: ['client', 'vendor', 'seller', 'admin', 'owner', 'user']
    },
    {
        label: 'Hébergement',
        path: '/hosting',
        icon: Server,
        roles: ['client', 'vendor', 'seller', 'admin', 'owner', 'user']
    },
    {
        label: 'Sites Web',
        path: '/sites',
        icon: Globe,
        roles: ['client', 'vendor', 'seller', 'admin', 'owner', 'user']
    },

    // ===== TOUS =====
    {
        label: 'Paramètres',
        path: '/settings',
        icon: Settings,
        roles: ['client', 'vendor', 'seller', 'admin', 'owner', 'user', 'manager']
    },
];

export const DynamicMenu: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();
    const { hasAnyRole } = useRoleAccess();

    if (!user) return null;

    // Filtrer les items selon le rôle
    const visibleItems = MENU_ITEMS.filter(item =>
        hasAnyRole(item.roles as any[])
    );

    // Grouper les items par section
    const sections = {
        admin: visibleItems.filter(item =>
            item.roles.includes('admin') && !item.roles.includes('client')
        ),
        vendor: visibleItems.filter(item =>
            (item.roles.includes('vendor') || item.roles.includes('seller')) &&
            !item.roles.includes('admin') && !item.roles.includes('client')
        ),
        general: visibleItems.filter(item =>
            item.roles.includes('client') || item.roles.includes('user')
        ),
    };

    const renderSection = (title: string, items: MenuItem[]) => {
        if (items.length === 0) return null;

        return (
            <div className="mb-6">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {title}
                </h3>
                <div className="space-y-1">
                    {items.map(item => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                  flex items-center justify-between gap-3 px-4 py-3 rounded-lg 
                  transition-all duration-200 group relative
                  ${isActive
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                                        : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
                                    }
                `}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
                                    <span className={`font-medium ${isActive ? 'text-white' : ''}`}>
                                        {item.label}
                                    </span>
                                </div>

                                {item.badge && !isActive && (
                                    <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                                        {item.badge}
                                    </span>
                                )}

                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <nav className="py-4">
            {/* Afficher les sections selon le rôle */}
            {user.role === 'admin' || user.role === 'owner' ? (
                <>
                    {renderSection('Administration', sections.admin)}
                    {renderSection('Général', sections.general)}
                </>
            ) : (user.role === 'vendor' || user.role === 'seller') ? (
                <>
                    {renderSection('Vendeur', sections.vendor)}
                    {renderSection('Mon compte', sections.general)}
                </>
            ) : (
                <>
                    {renderSection('Mon compte', sections.general)}
                </>
            )}
        </nav>
    );
};
