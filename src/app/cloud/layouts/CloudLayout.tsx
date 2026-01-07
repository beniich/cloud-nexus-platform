import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Server, Globe, Database, CreditCard, Users, Settings, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CloudProvider } from '@/contexts/CloudContext';

const Sidebar = () => {
    const menuItems = [
        { to: '/cloud', icon: <BarChart3 className="w-5 h-5" />, label: 'Dashboard', end: true },
        { to: '/cloud/droplets', icon: <Server className="w-5 h-5" />, label: 'Droplets' },
        { to: '/cloud/domains', icon: <Globe className="w-5 h-5" />, label: 'Domains' },
        { to: '/cloud/databases', icon: <Database className="w-5 h-5" />, label: 'Databases' },
        { to: '/cloud/billing', icon: <CreditCard className="w-5 h-5" />, label: 'Billing' },
        { to: '/cloud/team', icon: <Users className="w-5 h-5" />, label: 'Team' },
        { to: '/cloud/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' }
    ];

    return (
        <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen flex flex-col sticky top-0">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-white text-xl font-bold flex items-center gap-2">
                    <Activity className="w-8 h-8 text-blue-500" />
                    CloudPlatform
                </h1>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                            isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        )}
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

const CloudLayout = () => {
    return (
        <CloudProvider>
            <div className="flex min-h-screen bg-gray-950">
                <Sidebar />
                <main className="flex-1 overflow-x-hidden">
                    <div className="p-8 max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </CloudProvider>
    );
};

export default CloudLayout;
