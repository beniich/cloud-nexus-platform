import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMenuConfig } from '@/hooks/useMenuConfig';
import { SidebarItem } from './SidebarItem';
import { Button } from '@/components/ui/button';

interface SidebarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
    isCollapsed?: boolean;
    onToggleCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ activeSection, onSectionChange, isCollapsed: controlledCollapsed, onToggleCollapse }: SidebarProps) {
    const { menu, loading } = useMenuConfig();
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

    if (loading) {
        return (
            <aside className={cn(
                "bg-background border-r border-border min-h-[calc(100vh-73px)] p-4 transition-all duration-300 ease-in-out dark:bg-slate-900 dark:border-slate-800",
                collapsed ? "w-20" : "w-64"
            )}>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-10 bg-muted/50 rounded-lg animate-pulse" />
                    ))}
                </div>
            </aside>
        );
    }

    return (
        <aside
            className={cn(
                "bg-background border-r border-border min-h-[calc(100vh-73px)] p-4 transition-all duration-300 ease-in-out dark:bg-slate-900 dark:border-slate-800 relative",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <nav className="space-y-2">
                {menu.map((item) => (
                    <SidebarItem
                        key={item.id}
                        item={item}
                        collapsed={collapsed}
                        isActive={
                            item.type === 'internal'
                                ? activeSection === item.section
                                : location.pathname.startsWith(item.path)
                        }
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
