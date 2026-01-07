import React from 'react';

interface StatusBadgeProps {
    status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const colors: Record<string, string> = {
        running: 'bg-green-500/20 text-green-400 border-green-500/30',
        stopped: 'bg-red-500/20 text-red-400 border-red-500/30',
        starting: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        active: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        pending: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };

    const colorClass = colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
            {status}
        </span>
    );
};
