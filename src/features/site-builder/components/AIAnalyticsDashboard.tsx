import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, MessageSquare, Wand2, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';

export const AIAnalyticsDashboard = () => {
    const [timeRange, setTimeRange] = useState('7d');

    // Données simulées
    const usageData = [
        { date: 'Mon', generations: 45, improvements: 32, chatMessages: 78 },
        { date: 'Tue', generations: 52, improvements: 28, chatMessages: 91 },
        { date: 'Wed', generations: 38, improvements: 41, chatMessages: 65 },
        { date: 'Thu', generations: 61, improvements: 35, chatMessages: 103 },
        { date: 'Fri', generations: 48, improvements: 44, chatMessages: 87 },
        { date: 'Sat', generations: 33, improvements: 26, chatMessages: 54 },
        { date: 'Sun', generations: 41, improvements: 31, chatMessages: 72 }
    ];

    const providerData = [
        { name: 'Claude', value: 45, color: '#8B5CF6' },
        { name: 'ChatGPT', value: 30, color: '#10B981' },
        { name: 'Gemini', value: 20, color: '#3B82F6' },
        { name: 'Veo 2', value: 5, color: '#F59E0B' }
    ];

    const contentTypeData = [
        { type: 'Hero', count: 89 },
        { type: 'Features', count: 76 },
        { type: 'About', count: 54 },
        { type: 'Services', count: 67 },
        { type: 'Testimonials', count: 43 },
        { type: 'Contact', count: 38 }
    ];

    const stats = [
        {
            label: 'Total Generations',
            value: '2,847',
            change: '+12.5%',
            icon: Wand2,
            color: 'blue'
        },
        {
            label: 'Chat Interactions',
            value: '1,532',
            change: '+8.3%',
            icon: MessageSquare,
            color: 'purple'
        },
        {
            label: 'Avg Response Time',
            value: '1.2s',
            change: '-0.3s',
            icon: Clock,
            color: 'green'
        },
        {
            label: 'Success Rate',
            value: '94.7%',
            change: '+2.1%',
            icon: TrendingUp,
            color: 'orange'
        }
    ];

    const recentGenerations = [
        {
            id: 1,
            type: 'Site Generation',
            content: 'Business Professional - Tech Startup',
            provider: 'Claude',
            timestamp: '2 minutes ago',
            feedback: 'positive'
        },
        {
            id: 2,
            type: 'Content Improvement',
            content: 'Hero section - "Transform Your Business"',
            provider: 'ChatGPT',
            timestamp: '15 minutes ago',
            feedback: 'positive'
        },
        {
            id: 3,
            type: 'Chat Assistant',
            content: 'Added pricing section',
            provider: 'Claude',
            timestamp: '32 minutes ago',
            feedback: null
        },
        {
            id: 4,
            type: 'Site Generation',
            content: 'Portfolio - Creative Designer',
            provider: 'Gemini',
            timestamp: '1 hour ago',
            feedback: 'positive'
        },
        {
            id: 5,
            type: 'Content Generation',
            content: 'Features section - AI Platform',
            provider: 'ChatGPT',
            timestamp: '2 hours ago',
            feedback: 'negative'
        }
    ];

    const colorMap: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-700',
        purple: 'bg-purple-100 text-purple-700',
        green: 'bg-green-100 text-green-700',
        orange: 'bg-orange-100 text-orange-700'
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                AI Analytics Dashboard
                            </h1>
                            <p className="text-gray-600">
                                Track AI usage, performance, and user feedback
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {['7d', '30d', '90d'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${timeRange === range
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${colorMap[stat.color]}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Usage Trends */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            AI Usage Trends
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={usageData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="generations"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    name="Generations"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="improvements"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    name="Improvements"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="chatMessages"
                                    stroke="#8B5CF6"
                                    strokeWidth={2}
                                    name="Chat Messages"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Provider Distribution */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            AI Provider Usage
                        </h3>
                        <div className="flex items-center gap-8">
                            <ResponsiveContainer width="60%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={providerData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {providerData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex-1">
                                {providerData.map((provider, index) => (
                                    <div key={index} className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: provider.color }}
                                            />
                                            <span className="text-sm text-gray-700">{provider.name}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {provider.value}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Types & Recent Activity */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Content Type Distribution */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Generated Content Types
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={contentTypeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="type" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recent Generations */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Recent AI Activity
                        </h3>
                        <div className="space-y-3">
                            {recentGenerations.map((gen) => (
                                <div
                                    key={gen.id}
                                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {gen.content}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">{gen.type}</span>
                                                <span className="text-xs text-gray-400">•</span>
                                                <span className="text-xs text-purple-600">{gen.provider}</span>
                                            </div>
                                        </div>
                                        {gen.feedback && (
                                            <div className="flex gap-1">
                                                {gen.feedback === 'positive' ? (
                                                    <ThumbsUp className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <ThumbsDown className="w-4 h-4 text-red-600" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">{gen.timestamp}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feedback Section */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                User Feedback on AI Features
                            </h3>
                            <p className="text-gray-600">
                                94.7% positive feedback • Help us improve by rating AI responses
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <ThumbsUp className="w-5 h-5 text-green-600" />
                                    <span className="text-2xl font-bold text-gray-900">2,689</span>
                                </div>
                                <span className="text-sm text-gray-600">Positive</span>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <ThumbsDown className="w-5 h-5 text-red-600" />
                                    <span className="text-2xl font-bold text-gray-900">151</span>
                                </div>
                                <span className="text-sm text-gray-600">Negative</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
