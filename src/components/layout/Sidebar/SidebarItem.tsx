import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { MenuItem } from '@/types/menu';

interface SidebarItemProps {
    item: MenuItem;
    collapsed: boolean;
    isActive: boolean;
    onInternalClick?: (section: string) => void;
}

export function SidebarItem({ item, collapsed, isActive, onInternalClick }: SidebarItemProps) {
    const navigate = useNavigate();

    // Récupérer l'icône dynamiquement
    // @ts-ignore
    const Icon = LucideIcons[item.icon] || LucideIcons.Circle;

    const handleClick = (e: React.MouseEvent) => {
        if (item.type === 'external') {
            // C'est un vrai lien externe ou une autre route de l'app (pas dashboard)
            // Si c'est une route interne de l'app (ex: /cloud), on utilise navigate
            // Si c'est une section interne dashboard, on utilise onInternalClick
        } else if (item.section && onInternalClick) {
            e.preventDefault();
            onInternalClick(item.section);
        }
    };

    const itemContent = (
        <>
            <Icon className={cn('w-5 h-5 flex-shrink-0', collapsed && 'mx-auto', item.color)} />
            {!collapsed && (
                <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
            )}
            {!collapsed && item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                    {item.badge}
                </span>
            )}
            {!collapsed && item.type === 'external' && (
                <LucideIcons.ExternalLink className="ml-auto w-4 h-4 opacity-50" />
            )}
        </>
    );

    const className = cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative',
        isActive
            ? 'bg-primary text-primary-foreground shadow-md'
            : item.type === 'external'
                ? 'text-foreground hover:bg-accent hover:text-accent-foreground font-semibold'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    );

    // Custom colors override based on item.color if provided in config
    // Note: classes passed in item.color (e.g. text-blue-500) will apply to Icon. 
    // If we want text color on the whole item, we might need to adjust.

    if (item.type === 'external') {
        // Check if it's an absolute URL or relative path
        const isAbsolute = item.path.startsWith('http');

        if (isAbsolute) {
            return (
                <a href={item.path} target="_blank" rel="noopener noreferrer" className={className} title={collapsed ? item.label : undefined}>
                    {itemContent}
                </a>
            );
        }

        return (
            <Link
                to={item.path}
                className={className}
                title={collapsed ? item.label : undefined}
            >
                {itemContent}
            </Link>
        );
    }

    // Internal Dashboard Section
    return (
        <button
            onClick={handleClick}
            className={className}
            title={collapsed ? item.label : undefined}
        >
            {itemContent}
        </button>
    );
}
