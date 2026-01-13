import React, { useState } from 'react';
import { LayoutDashboard, Plus, Edit, X, Maximize2, Minimize2, Move, TrendingUp, Users, Server, DollarSign, Activity, Clock, ShoppingCart, Database, LucideIcon } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface WidgetData {
    label: string;
    value: string;
    change: string;
    icon: LucideIcon;
}

interface Widget {
    id: number;
    type: string;
    title: string;
    position: { x: number; y: number };
    size: 'small' | 'medium' | 'large' | 'xlarge';
    data?: WidgetData;
    chartType?: string;
}

const CustomizableDashboard = () => {
    const [widgets, setWidgets] = useState<Widget[]>([
        { id: 1, type: 'stats', title: 'Statistiques', position: { x: 0, y: 0 }, size: 'medium', data: { label: 'Revenus', value: '€48.5K', change: '+23%', icon: DollarSign } },
        { id: 2, type: 'stats', title: 'Utilisateurs', position: { x: 1, y: 0 }, size: 'medium', data: { label: 'Utilisateurs', value: '2,847', change: '+12%', icon: Users } },
        { id: 3, type: 'chart', title: 'Revenus mensuels', position: { x: 0, y: 1 }, size: 'large', chartType: 'area' },
        { id: 4, type: 'chart', title: 'Serveurs actifs', position: { x: 2, y: 0 }, size: 'medium', chartType: 'bar' },
        { id: 5, type: 'list', title: 'Activités récentes', position: { x: 2, y: 1 }, size: 'medium' }
    ]);

    const [editMode, setEditMode] = useState(false);
    const [showAddWidget, setShowAddWidget] = useState(false);

    const revenueData = [
        { month: 'Jan', revenue: 35000, profit: 25000 },
        { month: 'Fév', revenue: 38000, profit: 28000 },
        { month: 'Mar', revenue: 42000, profit: 31000 },
        { month: 'Avr', revenue: 45000, profit: 34000 },
        { month: 'Mai', revenue: 48000, profit: 37000 },
        { month: 'Juin', revenue: 52000, profit: 40000 }
    ];

    const serverData = [
        { name: 'VPS', value: 45 },
        { name: 'Cloud', value: 30 },
        { name: 'Dédié', value: 25 }
    ];

    const activities = [
        { id: 1, action: 'Nouveau client inscrit', time: 'Il y a 5 min', icon: Users, color: 'text-blue-500' },
        { id: 2, action: 'Serveur déployé', time: 'Il y a 12 min', icon: Server, color: 'text-green-500' },
        { id: 3, action: 'Paiement reçu', time: 'Il y a 1h', icon: DollarSign, color: 'text-purple-500' },
        { id: 4, action: 'Ticket résolu', time: 'Il y a 2h', icon: Activity, color: 'text-orange-500' }
    ];

    const widgetTypes = [
        { id: 'stats', name: 'Statistique', icon: TrendingUp },
        { id: 'chart', name: 'Graphique', icon: Activity },
        { id: 'list', name: 'Liste', icon: LayoutDashboard },
        { id: 'table', name: 'Tableau', icon: Database }
    ];

    const removeWidget = (id: number) => {
        setWidgets(widgets.filter(w => w.id !== id));
    };

    const addWidget = (type: string) => {
        const newWidget: Widget = {
            id: Date.now(),
            type,
            title: `Nouveau ${type}`,
            position: { x: 0, y: 0 },
            size: 'medium',
            data: type === 'stats' ? { label: 'Métrique', value: '0', change: '+0%', icon: TrendingUp } : undefined
        };
        setWidgets([...widgets, newWidget]);
        setShowAddWidget(false);
    };

    const renderWidget = (widget: Widget) => {
        const sizeClasses: Record<string, string> = {
            small: 'col-span-1 row-span-1',
            medium: 'col-span-1 row-span-1',
            large: 'col-span-2 row-span-1',
            xlarge: 'col-span-2 row-span-2'
        };

        return (
            <div key={widget.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${sizeClasses[widget.size]}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">{widget.title}</h3>
                    {editMode && (
                        <div className="flex gap-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded">
                                <Move className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded">
                                <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => removeWidget(widget.id)} className="p-1 text-red-400 hover:text-red-600 rounded">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                {widget.type === 'stats' && widget.data && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center`}>
                                <widget.data.icon className="w-6 h-6" />
                            </div>
                            <span className="text-green-500 text-sm font-semibold">{widget.data.change}</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{widget.data.value}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">{widget.data.label}</div>
                    </div>
                )}

                {widget.type === 'chart' && widget.chartType === 'area' && (
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}

                {widget.type === 'chart' && widget.chartType === 'bar' && (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={serverData}>
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}

                {widget.type === 'list' && (
                    <div className="space-y-3">
                        {activities.map(activity => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className={`p-2 ${activity.color} bg-opacity-10 rounded-lg`}>
                                    <activity.icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de Bord</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Personnalisez votre espace de travail</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setEditMode(!editMode)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${editMode ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                                }`}>
                            {editMode ? <><X className="w-5 h-5" /> Terminer</> : <><Edit className="w-5 h-5" /> Modifier</>}
                        </button>
                        <button onClick={() => setShowAddWidget(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold">
                            <Plus className="w-5 h-5" />
                            Ajouter Widget
                        </button>
                    </div>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-3 gap-6 auto-rows-fr">
                    {widgets.map(renderWidget)}
                </div>
            </div>

            {/* Add Widget Modal */}
            {showAddWidget && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ajouter un Widget</h3>
                            <button onClick={() => setShowAddWidget(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                {widgetTypes.map(type => {
                                    const Icon = type.icon;
                                    return (
                                        <button key={type.id} onClick={() => addWidget(type.id)}
                                            className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                    <Icon className="w-8 h-8 text-white" />
                                                </div>
                                                <span className="font-semibold text-gray-900 dark:text-white">{type.name}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomizableDashboard;
