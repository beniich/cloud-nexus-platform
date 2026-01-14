import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Server, Eye, ArrowUpRight, ArrowDownRight, Calendar, Download, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ============================================
// DONNÉES D'EXEMPLE
// ============================================

const REVENUE_DATA = [
    { month: 'Jan', revenue: 4500, costs: 3200, profit: 1300 },
    { month: 'Fév', revenue: 5200, costs: 3400, profit: 1800 },
    { month: 'Mar', revenue: 4800, costs: 3300, profit: 1500 },
    { month: 'Avr', revenue: 6100, costs: 3800, profit: 2300 },
    { month: 'Mai', revenue: 7200, costs: 4200, profit: 3000 },
    { month: 'Jun', revenue: 6800, costs: 4000, profit: 2800 },
    { month: 'Jul', revenue: 8500, costs: 4800, profit: 3700 },
    { month: 'Aoû', revenue: 9200, costs: 5200, profit: 4000 },
    { month: 'Sep', revenue: 8800, costs: 5000, profit: 3800 },
    { month: 'Oct', revenue: 10500, costs: 5800, profit: 4700 },
    { month: 'Nov', revenue: 11200, costs: 6200, profit: 5000 },
    { month: 'Déc', revenue: 12800, costs: 6800, profit: 6000 }
];

const USERS_DATA = [
    { month: 'Jan', users: 1200, activeUsers: 980, newUsers: 150 },
    { month: 'Fév', users: 1380, activeUsers: 1100, newUsers: 180 },
    { month: 'Mar', users: 1520, activeUsers: 1250, newUsers: 140 },
    { month: 'Avr', users: 1780, activeUsers: 1420, newUsers: 260 },
    { month: 'Mai', users: 2100, activeUsers: 1680, newUsers: 320 },
    { month: 'Jun', users: 2380, activeUsers: 1920, newUsers: 280 },
    { month: 'Jul', users: 2650, activeUsers: 2150, newUsers: 270 },
    { month: 'Aoû', users: 3020, activeUsers: 2480, newUsers: 370 },
    { month: 'Sep', users: 3350, activeUsers: 2750, newUsers: 330 },
    { month: 'Oct', users: 3780, activeUsers: 3100, newUsers: 430 },
    { month: 'Nov', users: 4200, activeUsers: 3480, newUsers: 420 },
    { month: 'Déc', users: 4680, activeUsers: 3920, newUsers: 480 }
];

const TRAFFIC_DATA = [
    { name: 'Direct', value: 35, color: '#3B82F6' },
    { name: 'Recherche', value: 28, color: '#8B5CF6' },
    { name: 'Réseaux sociaux', value: 20, color: '#10B981' },
    { name: 'Référents', value: 12, color: '#F59E0B' },
    { name: 'Email', value: 5, color: '#EF4444' }
];

const SERVERS_PERFORMANCE = [
    { name: 'Srv-001', cpu: 75, ram: 82, storage: 65 },
    { name: 'Srv-002', cpu: 45, ram: 58, storage: 72 },
    { name: 'Srv-003', cpu: 88, ram: 91, storage: 45 },
    { name: 'Srv-004', cpu: 62, ram: 70, storage: 80 },
    { name: 'Srv-005', cpu: 35, ram: 42, storage: 55 }
];

const TOP_PRODUCTS = [
    { name: 'Hébergement Premium', sales: 245, revenue: 11760 },
    { name: 'VPS Standard', sales: 189, revenue: 7560 },
    { name: 'Cloud Storage', sales: 156, revenue: 4680 },
    { name: 'Serveur Dédié', sales: 78, revenue: 15600 },
    { name: 'SSL Premium', sales: 312, revenue: 3120 }
];

// ============================================
// COMPOSANTS
// ============================================

function StatCard({ title, value, change, icon: Icon, trend }) {
    const isPositive = change >= 0;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${isPositive ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(change)}%
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs text-gray-500 mt-1">{trend}</p>
            </div>
        </div>
    );
}

function ChartCard({ title, children, actions }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
            {children}
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload) return null;

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
            {payload.map((entry, index) => (
                <p key={index} className="text-sm" style={{ color: entry.color }}>
                    {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                </p>
            ))}
        </div>
    );
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function AnalyticsDashboard() {
    const [timeRange, setTimeRange] = useState('12m');
    const [selectedMetric, setSelectedMetric] = useState('revenue');

    // Calculs des KPIs
    const kpis = useMemo(() => {
        const currentMonth = REVENUE_DATA[REVENUE_DATA.length - 1];
        const previousMonth = REVENUE_DATA[REVENUE_DATA.length - 2];
        const currentUsers = USERS_DATA[USERS_DATA.length - 1];
        const previousUsers = USERS_DATA[USERS_DATA.length - 2];

        return {
            revenue: {
                value: `${currentMonth.revenue.toLocaleString()}€`,
                change: ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1),
                trend: 'vs mois dernier'
            },
            users: {
                value: currentUsers.users.toLocaleString(),
                change: ((currentUsers.users - previousUsers.users) / previousUsers.users * 100).toFixed(1),
                trend: `+${currentUsers.newUsers} nouveaux`
            },
            profit: {
                value: `${currentMonth.profit.toLocaleString()}€`,
                change: ((currentMonth.profit - previousMonth.profit) / previousMonth.profit * 100).toFixed(1),
                trend: 'marge bénéficiaire'
            },
            activeUsers: {
                value: currentUsers.activeUsers.toLocaleString(),
                change: ((currentUsers.activeUsers - previousUsers.activeUsers) / previousUsers.activeUsers * 100).toFixed(1),
                trend: `${((currentUsers.activeUsers / currentUsers.users) * 100).toFixed(1)}% du total`
            }
        };
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Vue d'ensemble de vos performances
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="7d">7 jours</option>
                        <option value="30d">30 jours</option>
                        <option value="3m">3 mois</option>
                        <option value="6m">6 mois</option>
                        <option value="12m">12 mois</option>
                    </select>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Exporter
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Revenus"
                    value={kpis.revenue.value}
                    change={parseFloat(kpis.revenue.change)}
                    icon={DollarSign}
                    trend={kpis.revenue.trend}
                />
                <StatCard
                    title="Utilisateurs"
                    value={kpis.users.value}
                    change={parseFloat(kpis.users.change)}
                    icon={Users}
                    trend={kpis.users.trend}
                />
                <StatCard
                    title="Profit"
                    value={kpis.profit.value}
                    change={parseFloat(kpis.profit.change)}
                    icon={TrendingUp}
                    trend={kpis.profit.trend}
                />
                <StatCard
                    title="Utilisateurs Actifs"
                    value={kpis.activeUsers.value}
                    change={parseFloat(kpis.activeUsers.change)}
                    icon={Eye}
                    trend={kpis.activeUsers.trend}
                />
            </div>

            {/* Revenus & Profits */}
            <ChartCard
                title="Revenus et Profits"
                actions={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSelectedMetric('revenue')}
                            className={`px-3 py-1 text-sm rounded-lg ${selectedMetric === 'revenue' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}
                        >
                            Revenus
                        </button>
                        <button
                            onClick={() => setSelectedMetric('profit')}
                            className={`px-3 py-1 text-sm rounded-lg ${selectedMetric === 'profit' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}
                        >
                            Profits
                        </button>
                    </div>
                }
            >
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={REVENUE_DATA}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            name="Revenus (€)"
                        />
                        <Area
                            type="monotone"
                            dataKey="profit"
                            stroke="#10B981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorProfit)"
                            name="Profits (€)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Croissance Utilisateurs & Sources de Trafic */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Croissance des Utilisateurs">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={USERS_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="month" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#8B5CF6"
                                strokeWidth={2}
                                dot={{ fill: '#8B5CF6', r: 4 }}
                                name="Total Utilisateurs"
                            />
                            <Line
                                type="monotone"
                                dataKey="activeUsers"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                dot={{ fill: '#3B82F6', r: 4 }}
                                name="Utilisateurs Actifs"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Sources de Trafic">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={TRAFFIC_DATA}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {TRAFFIC_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Performances Serveurs */}
            <ChartCard title="Performance des Serveurs">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={SERVERS_PERFORMANCE} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.1} />
                        <XAxis type="number" stroke="#9CA3AF" />
                        <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={80} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="cpu" fill="#EF4444" name="CPU Usage (%)" radius={[0, 4, 4, 0]} barSize={20} />
                        <Bar dataKey="ram" fill="#3B82F6" name="RAM Usage (%)" radius={[0, 4, 4, 0]} barSize={20} />
                        <Bar dataKey="storage" fill="#10B981" name="Storage (%)" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Top Produits */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Produits</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventes</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tendance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {TOP_PRODUCTS.map((product, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                <ShoppingCart className="w-4 h-4 text-blue-600" />
                                            </div>
                                            {product.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {product.sales}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                        {product.revenue.toLocaleString()}€
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center gap-1 text-green-500">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>+12%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
