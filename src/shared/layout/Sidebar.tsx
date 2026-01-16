
import React, { useState } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { AIChat } from '@/features/ai-assistant/components/AIChat';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/lib/permissions/permissionSystem';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard, ShoppingBag, Users, Settings, Package,
    TrendingUp, FileText, MessageSquare, Cloud, Server,
    Database, HardDrive, ChevronRight, Menu, Upload
} from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext'; // TODO: Migrate AuthContext
import { useMenuConfig } from '../../core/hooks/useMenuConfig';
import { MenuItem } from '../../types/menu';

// ============================================
// COMPONENTS HELPERS
// ============================================

const IconMap: Record<string, React.ElementType> = {
    LayoutDashboard, ShoppingBag, Users, Settings, Package,
    TrendingUp, FileText, MessageSquare, Cloud, Server,
    Database, Upload, HardDrive
};

function DynamicIcon({ name, className = "w-5 h-5" }: { name: string, className?: string }) {
    const Icon = IconMap[name] || LayoutDashboard;
    return <Icon className={className} />;
}

function Badge({ count, variant = 'primary' }: { count: number | string, variant?: string }) {
    const variants: Record<string, string> = {
        primary: 'bg-blue-500',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        danger: 'bg-red-500'
    };

    return (
        <span className={`${variants[variant] || variants.primary} text-white text-xs px-2 py-0.5 rounded-full`}>
            {count}
        </span>
    );
}

function SidebarItem({ item, isActive, onClick, isCollapsed }: { item: MenuItem, isActive: boolean, onClick: (path: string) => void, isCollapsed: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        if (item.children) {
            setIsExpanded(!isExpanded);
        } else {
            onClick(item.path);
        }
    };

    return (
        <div>
            <button
                onClick={handleClick}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all ${isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    } rounded-lg mb-1`}
            >
                <div className="flex items-center gap-3">
                    <DynamicIcon name={item.icon} />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </div>

                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        {item.badge && <Badge count={item.badge} variant={typeof item.badge === 'number' ? 'success' : 'primary'} />}
                        {item.children && (
                            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        )}
                    </div>
                )}
            </button>

            {!isCollapsed && isExpanded && item.children && (
                <div className="ml-4 mt-1 space-y-1">
                    {item.children.map(child => (
                        <button
                            key={child.id}
                            onClick={() => onClick(child.path)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            <DynamicIcon name={child.icon} className="w-4 h-4" />
                            <span>{child.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    // const { user } = useAuth(); // Temp disable
    const user = { name: 'Admin', role: 'admin' };
    const { menu } = useMenuConfig();
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    return (
        <div className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col sticky top-0 left-0`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                {!isCollapsed && (
                    <img src="/logo.png" alt="Cloud Industrie" className="h-8 max-w-[150px] object-contain" />
                )}
                <button onClick={onToggle} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 overflow-y-auto">
                {menu.map(item => (
                    <SidebarItem
                        key={item.id}
                        item={item}
                        isActive={currentPath.startsWith(item.path)}
                        onClick={(path) => navigate(path)}
                        isCollapsed={isCollapsed}
                    />
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
