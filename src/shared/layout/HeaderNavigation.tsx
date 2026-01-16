import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard, ShoppingBag, Users, Settings, Package,
    TrendingUp, FileText, MessageSquare, Cloud, Server,
    Database, HardDrive, Upload
} from 'lucide-react';
import { useMenuConfig } from '../../core/hooks/useMenuConfig';

// Icon mapping matching Sidebar
const IconMap: Record<string, React.ElementType> = {
    LayoutDashboard, ShoppingBag, Users, Settings, Package,
    TrendingUp, FileText, MessageSquare, Cloud, Server,
    Database, Upload, HardDrive
};

function DynamicIcon({ name, className = "w-4 h-4" }: { name: string, className?: string }) {
    const Icon = IconMap[name] || LayoutDashboard;
    return <Icon className={className} />;
}

export function HeaderNavigation() {
    const { menu } = useMenuConfig();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="flex items-center gap-1 mx-4 overflow-x-auto">
            {menu.map((item) => {
                const isActive = location.pathname.startsWith(item.path);

                return (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                            isActive
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        )}
                    >
                        <DynamicIcon name={item.icon} />
                        <span>{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
