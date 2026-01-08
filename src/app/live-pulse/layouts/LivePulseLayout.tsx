import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Radio, Lightbulb, CheckSquare, Users, Heart, Settings, Plus, ChevronDown, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SidebarItem = ({ icon: Icon, label, to }: { icon: React.ElementType, label: string, to: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-r-full transition-colors ${isActive
            ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
            }`}
    >
        <Icon className="w-5 h-5" />
        {label}
    </NavLink>
);

const LivePulseLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 fixed h-full z-10">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <Activity className="w-8 h-8 text-orange-500" />
                        <span className="font-bold text-xl text-gray-900">Live Pulse</span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/live-pulse" />
                        <SidebarItem icon={Radio} label="Signaux" to="/live-pulse/signals" />
                        <SidebarItem icon={Lightbulb} label="Insights" to="/live-pulse/insights" />
                        <SidebarItem icon={CheckSquare} label="Actions" to="/live-pulse/actions" />
                        <SidebarItem icon={Users} label="Intelligence collective" to="/live-pulse/collective" />
                        <SidebarItem icon={Heart} label="Culture & Confiance" to="/live-pulse/culture" />
                    </div>
                </div>

                <div className="absolute bottom-6 left-0 w-full px-6">
                    <SidebarItem icon={Settings} label="Paramètres" to="/live-pulse/settings" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                {/* Header */}
                <header className="h-20 bg-gray-50/80 backdrop-blur-sm sticky top-0 z-20 px-8 flex items-center justify-between">
                    <div className="flex-1" /> {/* Spacer */}

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                            <span>Équipe</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>

                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                            <span>30 jours</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>

                        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 shadow-sm shadow-orange-200">
                            <Plus className="w-4 h-4 mr-2" />
                            Nouveau signal
                        </Button>

                        <Avatar className="cursor-pointer border-2 border-white shadow-sm">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback className="bg-orange-100 text-orange-700">JD</AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-4 h-4 text-gray-400 cursor-pointer" />
                    </div>
                </header>

                <div className="px-8 pb-12">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default LivePulseLayout;
