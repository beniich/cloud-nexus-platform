import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMenuConfig } from '@/hooks/useMenuConfig';
import { SidebarItem } from './SidebarItem';
import { Button } from '@/shared/ui/button';

interface SidebarProps {
    activeSection?: string;
    onSectionChange?: (section: string) => void;
    isCollapsed?: boolean;
    onToggleCollapse?: (collapsed: boolean) => void;
    logoUrl?: string;
}

export function Sidebar({ activeSection, onSectionChange, isCollapsed: controlledCollapsed, onToggleCollapse, logoUrl }: SidebarProps) {
    const { menu } = useMenuConfig();
    const location = useLocation();

    // Local state for collapse if not controlled
    const [internalCollapsed, setInternalCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebar-collapsed');
        return saved ? JSON.parse(saved) : false;
    });

    const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

    const toggleCollapse = () => {
        const newState = !collapsed;
        if (onToggleCollapse) {
            onToggleCollapse(newState);
        } else {
            setInternalCollapsed(newState);
            localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
        }
    };



    return (
        <aside
            className={cn(
                "bg-background border-r border-border min-h-[calc(100vh-73px)] p-4 transition-all duration-300 ease-in-out dark:bg-slate-900 dark:border-slate-800 relative",
                collapsed ? "w-20" : "w-64"
            )}
        >

            <div className={cn("flex items-center gap-3 mb-8 px-2", collapsed && "justify-center mb-6")}>
                <div className="relative">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt="Logo"
                            className={cn("object-contain transition-all duration-300", collapsed ? "w-8 h-8" : "w-8 h-8")}
                        />
                    ) : (
                        <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                            <span className="text-white dark:text-black font-bold text-xs">CN</span>
                        </div>
                    )}
                </div>
                {!collapsed && (
                    <span className="font-bold text-lg whitespace-nowrap overflow-hidden transition-all duration-300">
                        CloudNexus
                    </span>
                )}
            </div>

            <nav className="space-y-2">
                {menu.map((item) => (
                    <SidebarItem
                        key={item.id}
                        item={item}
                        collapsed={collapsed}
                        isActive={location.pathname.startsWith(item.path)}
                        onInternalClick={onSectionChange}
                    />
                ))}
            </nav>

            {/* Support Box - Only visible when expanded */}
            {!collapsed && (
                <div className="mt-8 p-4 bg-muted/50 rounded-lg dark:bg-slate-800/50">
                    <p className="text-sm font-medium mb-2">Besoin d'aide ?</p>
                    <p className="text-xs text-muted-foreground mb-3">Consultez notre documentation.</p>
                    <Link to="/contact">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                            Support
                        </Button>
                    </Link>
                </div>
            )}

            {/* Collapse Toggle */}
            <div className={cn("absolute bottom-4 left-0 right-0 flex justify-center", collapsed ? "" : "justify-end px-4")}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleCollapse}
                    className="text-muted-foreground hover:text-foreground"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
            </div>
        </aside>
    );
}
