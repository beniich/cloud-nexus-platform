import React from 'react';

export default function APIKeysManager() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 font-display">
            <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
                <div className="flex items-center p-4 justify-between">
                    <button className="flex size-10 items-center justify-start cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h1 className="text-lg font-semibold tracking-tight">API Keys</h1>
                    <div className="flex size-10 items-center justify-end">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">help_outline</span>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto px-4 pt-6 pb-24">
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-1">API Keys</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage your access tokens to integrate Cloud Nexus services.</p>
                    <button className="w-full mt-6 bg-primary hover:bg-orange-600 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                        <span className="material-symbols-outlined text-xl">add_circle</span>
                        Generate New Key
                    </button>
                </section>

                <section className="mb-8">
                    <div className="bg-white dark:bg-card-dark rounded-2xl p-5 border border-slate-100 dark:border-white/5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Usage Limits</h3>
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Pro Plan</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-medium">Monthly Requests</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400"><span className="text-slate-900 dark:text-white font-bold">14,500</span> / 50,000</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: '29%' }}></div>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-relaxed">
                                Your quota resets in 12 days. Need more? <a className="text-primary font-semibold hover:underline" href="#">Upgrade your plan</a>.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Active Keys</h3>
                    <APIKeyCard
                        title="Production CMS"
                        token="nx_live_••••••••1234"
                        created="Oct 12, 2023"
                        lastUsed="2 mins ago"
                        lastUsedColor="text-emerald-500"
                    />
                    <APIKeyCard
                        title="Staging Mobile App"
                        token="nx_test_••••••••9876"
                        created="Dec 01, 2023"
                        lastUsed="Yesterday"
                        lastUsedColor="text-slate-400"
                        opacity="opacity-80"
                    />
                </section>

                <div className="text-center mt-12 mb-8">
                    <p className="text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-widest font-bold">Cloud Nexus Platform v2.4.1</p>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 w-full flex justify-center items-end pb-2 pointer-events-none z-50 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent h-16">
                <div className="w-32 h-1 bg-slate-400/20 dark:bg-white/10 rounded-full"></div>
            </div>
        </div>
    );
}

function APIKeyCard({ title, token, created, lastUsed, lastUsedColor, opacity }: any) {
    return (
        <div className={`bg-white dark:bg-card-dark rounded-2xl p-5 border border-slate-100 dark:border-white/5 shadow-sm space-y-4 ${opacity || ''}`}>
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <h4 className="font-bold text-base">{title}</h4>
                    <code className="text-xs font-mono bg-slate-100 dark:bg-white/5 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{token}</code>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 text-slate-400 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-xl">content_copy</span>
                    </button>
                    <button className="p-2 text-slate-400 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-xl">visibility</span>
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-white/5">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-tighter">Created</span>
                    <span className="text-xs font-medium">{created}</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-tighter">Last Used</span>
                    <span className={`text-xs font-medium ${lastUsedColor}`}>{lastUsed}</span>
                </div>
            </div>
            <button className="w-full py-2.5 text-red-500 dark:text-red-400 text-xs font-bold border border-red-500/20 dark:border-red-500/10 rounded-xl hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">block</span>
                Revoke Key
            </button>
        </div>
    );
}
