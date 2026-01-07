import React from 'react';
import { Server, Globe, CreditCard, BarChart3 } from 'lucide-react';
import { useCloud } from '@/contexts/CloudContext';
import { KPICard } from '../components/KPICard';

const CloudDashboard: React.FC = () => {
    const { droplets, domains } = useCloud();

    const totalCost = droplets.reduce((sum, d) => sum + d.cost, 0);
    const runningDroplets = droplets.filter(d => d.status === 'running').length;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Cloud Overview</h2>
                <p className="text-gray-400">Manage your infrastructure resources</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Active Droplets"
                    value={runningDroplets}
                    icon={<Server className="w-6 h-6" />}
                    trend="+2 this month"
                />
                <KPICard
                    title="Domains"
                    value={domains.length}
                    icon={<Globe className="w-6 h-6" />}
                />
                <KPICard
                    title="Monthly Cost"
                    value={`$${totalCost}`}
                    icon={<CreditCard className="w-6 h-6" />}
                    trend="-5% vs last month"
                />
                <KPICard
                    title="Total Resources"
                    value={droplets.length + domains.length}
                    icon={<BarChart3 className="w-6 h-6" />}
                />
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-white text-xl font-semibold mb-4">Resource Usage</h3>
                <div className="h-64 flex items-end justify-around gap-4">
                    {droplets.filter(d => d.status === 'running').map(droplet => (
                        <div key={droplet.id} className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                                style={{ height: `${droplet.cpu * 2}px` }}
                            />
                            <p className="text-gray-400 text-xs mt-2">{droplet.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CloudDashboard;
