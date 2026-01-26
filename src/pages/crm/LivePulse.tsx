
import React, { useState } from 'react';

export default function LivePulseDashboard() {
    const [timeframe, setTimeframe] = useState('Live');

    return (
        <div className="font-sans min-h-screen bg-transparent text-slate-900 dark:text-slate-100 pb-24">

            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="text-primary flex size-12 shrink-0 items-center justify-center bg-primary/10 rounded-xl">
                        <span className="material-symbols-outlined text-3xl">monitoring</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold leading-tight tracking-tight flex items-center gap-2">
                            Live Pulse
                            <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse box-shadow-red shadow-lg shadow-red-500/50"></span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-gray-400 font-medium uppercase tracking-widest">
                            Cloud Nexus Platform
                        </p>
                    </div>
                </div>
            </div>

            {/* Smart Alerts Section */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider">Critical Alerts</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase">2 Active</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Alert Card 1 */}
                    <div className="flex items-stretch justify-between gap-4 rounded-xl bg-orange-500/10 border border-primary/20 p-4 shadow-[0_0_10px_rgba(249,112,21,0.2)]">
                        <div className="flex flex-[2_2_0px] flex-col gap-3">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary text-2xl">warning</span>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-slate-900 dark:text-white text-sm font-bold leading-tight">High Latency in EU-West-1</p>
                                    <p className="text-slate-600 dark:text-[#cca78e] text-xs font-normal leading-normal">System performance degraded by 15%</p>
                                </div>
                            </div>
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 flex-row-reverse bg-primary text-white gap-2 text-xs font-bold leading-normal w-fit transition-all hover:bg-orange-600 active:opacity-80 shadow-md shadow-orange-500/20">
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                <span className="truncate">Review Logs</span>
                            </button>
                        </div>
                        <div
                            className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg flex-none overflow-hidden opacity-80"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDD5Ay2u7-hQ6GNXvBI7C0W02Wu4uzCDGpN8_N2rVAt59urjOpOlFjwWr6qRHvXmz4tuijfhhX0VWcFGtIaS3E9-arIqwuLzDH59NNH_RzfVKe07EIaFJvnkJMqab8v7HwxeTPZqC_N9_VO3cMdfkTH9AQ1wqfQ7Le3DGgtRBsbGM7_ZCPFVdNdUZBYq6iG9_xNBNleskMFukqy3-5ns3f-ve_n4bdum7OlLAcDKjaqFlRN8POxx4zdvwgtBR-exX8JySsMyJZ52HtW")' }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Real-time Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-[#1e1611] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Active Users</p>
                        <span className="material-symbols-outlined text-primary text-lg group-hover:scale-110 transition-transform">group</span>
                    </div>
                    <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">12.4k</p>
                    <p className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">trending_up</span> +12%
                    </p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-[#1e1611] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Avg Latency</p>
                        <span className="material-symbols-outlined text-primary text-lg group-hover:scale-110 transition-transform">timer</span>
                    </div>
                    <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">42ms</p>
                    <p className="text-red-500 text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">trending_down</span> -5%
                    </p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-[#1e1611] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Request Rate</p>
                        <span className="material-symbols-outlined text-primary text-lg group-hover:scale-110 transition-transform">bolt</span>
                    </div>
                    <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">2.8k/s</p>
                    <p className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">trending_up</span> +8%
                    </p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-[#1e1611] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Error Rate</p>
                        <span className="material-symbols-outlined text-primary text-lg group-hover:scale-110 transition-transform">error</span>
                    </div>
                    <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">0.02%</p>
                    <p className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">check_circle</span> Stable
                    </p>
                </div>
            </div>

            {/* Timeframe Controls */}
            <div className="mb-6 flex justify-center">
                <div className="flex h-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#2a1e17] p-1 border border-gray-200 dark:border-white/5">
                    {['Live', '1H', '6H'].map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`flex cursor-pointer h-full items-center justify-center rounded-lg px-6 text-xs font-bold transition-all ${timeframe === tf
                                    ? 'bg-white dark:bg-primary shadow-sm text-primary dark:text-white'
                                    : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chart Section */}
            <div className="mb-6">
                <div className="rounded-xl bg-white dark:bg-[#1e1611] border border-gray-100 dark:border-white/5 p-6 shadow-sm overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div>
                            <h4 className="text-slate-900 dark:text-white text-base font-bold">Real-time Traffic</h4>
                            <p className="text-slate-500 dark:text-gray-400 text-xs">Requests per second</p>
                        </div>
                        <div className="text-right">
                            <p className="text-primary text-2xl font-bold tracking-tight">2.8k <span className="text-xs text-slate-500 dark:text-gray-400 font-normal">RPS</span></p>
                        </div>
                    </div>

                    {/* Simulated SVG Chart */}
                    <div className="relative h-48 w-full mt-2 flex items-end gap-1">
                        <svg className="absolute inset-0 w-full h-full text-primary" preserveAspectRatio="none" viewBox="0 0 100 40">
                            <defs>
                                <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                className="drop-shadow-[0_0_4px_rgba(249,112,21,0.5)]"
                                d="M0 35 Q 10 32, 20 38 T 40 25 T 60 30 T 80 15 T 100 20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                vectorEffect="non-scaling-stroke"
                            ></path>
                            <path
                                d="M0 35 Q 10 32, 20 38 T 40 25 T 60 30 T 80 15 T 100 20 L 100 40 L 0 40 Z"
                                fill="url(#gradientArea)"
                                stroke="none"
                            ></path>
                        </svg>

                        {/* Pulse Indicator */}
                        <div className="absolute right-0 bottom-1/2 transform translate-y-1/2 flex items-center">
                            <span className="h-3 w-3 bg-primary rounded-full shadow-[0_0_15px_#f97015] animate-ping absolute"></span>
                            <span className="h-2.5 w-2.5 bg-primary rounded-full relative border-2 border-white dark:border-[#1e1611]"></span>
                        </div>
                    </div>

                    <div className="flex justify-between mt-4 text-[10px] text-slate-400 uppercase font-bold tracking-widest relative z-10">
                        <span>12:00</span>
                        <span>12:05</span>
                        <span>12:10</span>
                        <span>12:15</span>
                        <span>Now</span>
                    </div>
                </div>
            </div>

            {/* Content 2-Column Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                {/* Visual Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white dark:bg-[#1e1611] border border-gray-100 dark:border-white/5 p-4 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                        <p className="text-slate-500 dark:text-gray-400 text-[10px] font-bold uppercase mb-3 absolute top-4 left-4">Conversion</p>
                        <div className="relative flex items-center justify-center size-24 mt-4">
                            <svg className="size-24 transform -rotate-90">
                                <circle className="text-slate-100 dark:text-white/5" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="6"></circle>
                                <circle className="text-primary drop-shadow-[0_0_4px_#f97015]" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" strokeWidth="6"></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-slate-900 dark:text-white text-lg font-bold">75%</span>
                            </div>
                        </div>
                        <p className="text-center text-[10px] text-emerald-500 font-bold mt-3 bg-emerald-500/10 px-2 py-0.5 rounded-full">+2.4% today</p>
                    </div>

                    <div className="rounded-xl bg-white dark:bg-[#1e1611] border border-gray-100 dark:border-white/5 p-4 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                        <p className="text-slate-500 dark:text-gray-400 text-[10px] font-bold uppercase mb-3 absolute top-4 left-4">System Load</p>
                        <div className="relative flex items-center justify-center size-24 mt-4">
                            <svg className="size-24 transform -rotate-90">
                                <circle className="text-slate-100 dark:text-white/5" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="6"></circle>
                                <circle className="text-primary drop-shadow-[0_0_4px_#f97015]" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="180.5" strokeLinecap="round" strokeWidth="6"></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-slate-900 dark:text-white text-lg font-bold">28%</span>
                            </div>
                        </div>
                        <p className="text-center text-[10px] text-slate-400 font-bold mt-3 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">Optimal range</p>
                    </div>
                </div>

                {/* Node Status List */}
                <div className="rounded-xl bg-white dark:bg-[#1e1611] border border-gray-100 dark:border-white/5 p-5 shadow-sm">
                    <h3 className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider mb-4">Node Status</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-[#2a1e17] p-3 rounded-lg border border-gray-200 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="size-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
                                <span className="text-xs font-bold dark:text-gray-200">US-EAST-2</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium font-mono">99.98% Uptime</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-[#2a1e17] p-3 rounded-lg border border-gray-200 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="size-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
                                <span className="text-xs font-bold dark:text-gray-200">AP-SOUTH-1</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium font-mono">99.99% Uptime</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-[#2a1e17] p-3 rounded-lg border border-gray-200 dark:border-white/5 opacity-80">
                            <div className="flex items-center gap-3">
                                <div className="size-2.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                <span className="text-xs font-bold dark:text-gray-200">EU-WEST-1</span>
                            </div>
                            <span className="text-[10px] text-primary font-bold animate-pulse">Recovering...</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
