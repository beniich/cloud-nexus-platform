import React, { useState } from 'react';

export default function TemplateGallery() {
    const [activeTab, setActiveTab] = useState('All');

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl text-slate-900 dark:text-white rounded-xl">
            {/* Header with Search */}
            <header className="px-6 pt-8 pb-4 space-y-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 dark:border-white/5">
                <div className="flex items-center justify-between">
                    <button className="size-10 flex items-center justify-start text-slate-600 dark:text-white/70">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </button>
                    <h1 className="text-lg font-bold tracking-tight text-center flex-1">Select Template</h1>
                    <button className="size-10 flex items-center justify-end text-slate-600 dark:text-white/70">
                        <span className="material-symbols-outlined">info</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 text-xl">search</span>
                    <input
                        className="w-full bg-slate-100 dark:bg-card-dark border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm placeholder:text-slate-400 dark:placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Search templates..."
                        type="text"
                    />
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-2 px-2">
                    <FilterChip label="All" active={activeTab === 'All'} onClick={() => setActiveTab('All')} />
                    <FilterChip label="Portfolio" active={activeTab === 'Portfolio'} onClick={() => setActiveTab('Portfolio')} />
                    <FilterChip label="E-commerce" active={activeTab === 'E-commerce'} onClick={() => setActiveTab('E-commerce')} />
                    <FilterChip label="SaaS" active={activeTab === 'SaaS'} onClick={() => setActiveTab('SaaS')} />
                    <FilterChip label="Blog" active={activeTab === 'Blog'} onClick={() => setActiveTab('Blog')} />
                </div>
            </header>

            {/* Templates Grid */}
            <main className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                    <TemplateCard
                        title="Minimal Portfolio"
                        category="Creative Agency"
                        image="https://via.placeholder.com/800x600/23170f/f97015?text=Portfolio"
                    />
                    <TemplateCard
                        title="Nexus Commerce"
                        category="E-commerce"
                        image="https://via.placeholder.com/800x600/23170f/22c55e?text=Shop"
                    />
                    <TemplateCard
                        title="SaaS Landing"
                        category="Software"
                        image="https://via.placeholder.com/800x600/23170f/3b82f6?text=SaaS"
                    />
                    <TemplateCard
                        title="Tech Blog"
                        category="Content"
                        image="https://via.placeholder.com/800x600/23170f/f59e0b?text=Blog"
                    />
                </div>
            </main>

            {/* Blank Canvas CTA */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent pt-12">
                <button className="w-full py-4 rounded-xl bg-slate-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-slate-700 dark:text-white/80 font-semibold text-sm flex items-center justify-center gap-2 backdrop-blur-lg hover:bg-slate-300 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-xl">draw</span>
                    Start from a blank canvas
                </button>
            </div>
        </div>
    );
}

function FilterChip({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all
            ${active
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-slate-200 dark:bg-card-dark border border-gray-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-300 dark:hover:bg-white/10'
                }`}
        >
            {label}
        </button>
    );
}

function TemplateCard({ title, category, image }: { title: string, category: string, image: string }) {
    return (
        <div className="group bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl transition-all shadow-black/5 dark:shadow-black/20">
            <div className="aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">{title}</h3>
                        <p className="text-xs text-slate-500 dark:text-white/40 uppercase tracking-widest mt-0.5">{category}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button className="py-2.5 rounded-lg border border-gray-300 dark:border-white/10 text-slate-700 dark:text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Preview
                    </button>
                    <button className="py-2.5 rounded-lg bg-primary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all hover:bg-orange-600">
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        Select
                    </button>
                </div>
            </div>
        </div>
    );
}
