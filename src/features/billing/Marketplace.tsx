import React, { useState } from 'react';

export default function Marketplace() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl rounded-xl border border-white/5">

            {/* Header */}
            <header className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md border-b border-white/5 pt-6 pb-2 px-6">
                <div className="flex items-center justify-between mb-4">
                    <button className="size-10 flex items-center justify-start text-slate-700 dark:text-white/70">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <span className="material-symbols-outlined">storefront</span>
                        <span>Marketplace</span>
                    </div>
                    <div className="relative size-10 flex items-center justify-end text-slate-700 dark:text-white/70">
                        <span className="material-symbols-outlined">shopping_cart</span>
                        <span className="absolute top-1 right-0 bg-primary text-white text-[10px] size-4 flex items-center justify-center rounded-full font-bold">2</span>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-2">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40">search</span>
                    <input
                        className="w-full bg-slate-100 dark:bg-card-dark border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Search plugins, themes, hosting..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-6 py-4 pb-24">

                {/* Featured Banner */}
                <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-8 border border-white/10 group cursor-pointer shadow-lg">
                    <div className="absolute inset-0 bg-[#23170f] flex items-center justify-center">
                        {/* Placeholder for banner image */}
                        <div className="w-full h-full bg-gradient-to-r from-orange-900/40 to-black/60"></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center px-6">
                        <span className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Limited Time</span>
                        <h2 className="text-2xl font-bold text-white mb-2">50% OFF<br />Pro Hosting</h2>
                        <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-lg w-fit backdrop-blur-md transition-colors border border-white/10">
                            Shop Now
                        </button>
                    </div>
                </div>

                {/* Categories */}
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Categories</h3>
                        <button className="text-primary text-xs font-bold">View All</button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                        <CategoryCard icon="dns" label="Hosting" active />
                        <CategoryCard icon="language" label="Domains" />
                        <CategoryCard icon="extension" label="Plugins" />
                        <CategoryCard icon="security" label="Security" />
                        <CategoryCard icon="support_agent" label="Support" />
                    </div>
                </section>

                {/* Popular Products Grid */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Popular Items</h3>
                        <button className="text-slate-400 dark:text-white/40 text-xs font-bold flex items-center gap-1">
                            Filter <span className="material-symbols-outlined text-sm">filter_list</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProductCard
                            title="Premium SSL"
                            rating="4.9"
                            description="Wildcard protection"
                            price="$49.99"
                            period="/yr"
                            icon="lock"
                            color="primary"
                        />
                        <ProductCard
                            title="Global CDN"
                            rating="4.7"
                            description="Speed boost & protection"
                            price="$9.99"
                            period="/mo"
                            oldPrice="$15.00"
                            isSale
                            icon="public"
                            color="blue-500"
                        />
                        <ProductCard
                            title="Daily Backups"
                            rating="5.0"
                            description="1TB Cloud Storage"
                            price="$5.00"
                            period="/mo"
                            icon="backup"
                            color="emerald-500"
                        />

                        {/* View All Card */}
                        <div className="bg-slate-100 dark:bg-card-dark border border-gray-200 dark:border-white/10 rounded-2xl p-3 flex items-center justify-center group hover:border-primary/50 transition-all cursor-pointer min-h-[160px]">
                            <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-white/40 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                                <span className="text-xs font-bold uppercase tracking-wider">View All</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Cart Floating Bar (visible if items in cart) */}
            <div className="absolute bottom-6 left-6 right-6 bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-between z-50 cursor-pointer hover:bg-orange-600 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 px-2 py-1 rounded text-xs font-bold">2 items</div>
                    <span className="text-xs font-medium opacity-90">$59.98</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                    View Cart <span class="material-symbols-outlined text-base">arrow_forward</span>
                </div>
            </div>
        </div>
    );
}

function CategoryCard({ icon, label, active = false }: { icon: string, label: string, active?: boolean }) {
    return (
        <div className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group">
            <div className={`size-14 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-card-dark border border-gray-200 dark:border-white/10 text-slate-600 dark:text-white/70 group-hover:border-primary/50'}`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-700 dark:text-white/80">{label}</span>
        </div>
    );
}

function ProductCard({ title, rating, description, price, period, oldPrice, isSale, icon, color }: any) {
    return (
        <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-white/10 rounded-2xl p-3 flex flex-col gap-3 group hover:border-primary/50 transition-all shadow-sm">
            <div className={`relative aspect-square bbg-slate-50 dark:bg-[#0f0a07] rounded-xl flex items-center justify-center overflow-hidden`}>
                <span className={`material-symbols-outlined text-4xl text-${color}`}>{icon}</span>

                <button className="absolute top-2 right-2 size-7 bg-black/5 dark:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 dark:text-white/70 hover:text-primary hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-sm">favorite</span>
                </button>

                {isSale && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Sale</div>
                )}
            </div>
            <div>
                <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{title}</h4>
                    <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold">
                        <span className="material-symbols-outlined text-[10px] fill-1">star</span> {rating}
                    </div>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-white/40 mb-2">{description}</p>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        {oldPrice && <span className="text-[10px] line-through text-slate-400 dark:text-white/30">{oldPrice}</span>}
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{price}<span className="text-[10px] font-normal text-slate-400 dark:text-white/40">{period}</span></span>
                    </div>
                    <button className="size-7 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 active:scale-95 transition-transform hover:bg-orange-600">
                        <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
