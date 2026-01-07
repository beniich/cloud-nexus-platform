import React, { ReactNode } from 'react';
import { TrendingUp } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, icon, trend }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 transition-all">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-gray-400 text-sm mb-1">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
                {trend && (
                    <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {trend}
                    </p>
                )}
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400">
                {icon}
            </div>
        </div>
    </div>
);
