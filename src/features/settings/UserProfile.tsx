import React from 'react';

export default function UserProfile() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 font-display">
            <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
                <div className="flex items-center p-4 justify-between">
                    <div className="flex size-10 items-center justify-start cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </div>
                    <h1 className="text-lg font-semibold tracking-tight">Settings</h1>
                    <div className="flex size-10 items-center justify-end">
                        <span className="material-symbols-outlined opacity-0">more_horiz</span>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto pb-12">
                {/* Profile Header */}
                <section className="flex flex-col items-center pt-8 pb-6 px-4">
                    <div className="relative group cursor-pointer">
                        <div className="size-24 rounded-full border-2 border-primary/20 p-1">
                            <img alt="User Avatar" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnQOzov2PnuWA7F4SGzcwYroOstLUYsnyGqnDQ51kfyemadiML-1XMbh5dEf96C8y5S6y2PA8lyOA6b0Q6pDW3urb3utpuqvaKEo1UKZA8o_BZPWq3FZdZJwxzO9eAmGSj8c63eun_VbLRqEn2eLX5RszTwm_bzBw4hK2i3y8gLlwP8P7dgah1t4diN5AzSouHlyUrCMXvRPfGlFj3tIg-fQ_JXCI89Qp-E0cKnIibduPhSburesWfKQkdgyXE7HS3SlWBVVLv0_cw" />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-background-dark group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-sm leading-none block">photo_camera</span>
                        </button>
                    </div>
                    <div className="mt-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <h2 className="text-xl font-bold">Alex Chen</h2>
                            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">alex.chen@cloudnexus.io</p>
                    </div>
                    <button className="mt-4 px-4 py-1.5 rounded-full border border-slate-300 dark:border-white/10 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        Éditer le profil
                    </button>
                </section>

                {/* Settings Groups */}
                <div className="space-y-6 px-4">

                    {/* Group 1: Security */}
                    <div className="space-y-2">
                        <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Sécurité</h3>
                        <div className="bg-white dark:bg-card-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/5">
                            <SettingItem
                                icon="shield"
                                iconColor="text-blue-500"
                                iconBg="bg-blue-500/10"
                                title="Auth 2FA"
                                subtitle="Activé via Authenticator"
                            />
                            <SettingItem
                                icon="devices"
                                iconColor="text-indigo-500"
                                iconBg="bg-indigo-500/10"
                                title="Sessions Actives"
                                subtitle="3 appareils connectés"
                                noBorder
                            />
                        </div>
                    </div>

                    {/* Group 2: Preferences */}
                    <div className="space-y-2">
                        <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Préférences</h3>
                        <div className="bg-white dark:bg-card-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/5">
                            <SettingItem
                                icon="notifications"
                                iconColor="text-orange-500"
                                iconBg="bg-orange-500/10"
                                title="Notifications"
                            />

                            {/* Dark Mode Toggle */}
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-500/10 p-2 rounded-lg">
                                        <span className="material-symbols-outlined text-purple-500 text-xl">dark_mode</span>
                                    </div>
                                    <p className="text-sm font-medium">Mode Sombre</p>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input defaultChecked className="sr-only peer" type="checkbox" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary rounded-full"></div>
                                </div>
                            </div>

                            <SettingItem
                                icon="language"
                                iconColor="text-emerald-500"
                                iconBg="bg-emerald-500/10"
                                title="Langue"
                                value="Français"
                                isDropdown
                                noBorder
                            />
                        </div>
                    </div>

                    {/* Group 3: Developer */}
                    <div className="space-y-2">
                        <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Développeur</h3>
                        <div className="bg-white dark:bg-card-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/5">
                            <SettingItem
                                icon="key"
                                iconColor="text-amber-500"
                                iconBg="bg-amber-500/10"
                                title="API Keys"
                                subtitle="Gérer les tokens d'accès"
                                noBorder
                            />
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-4">
                        <button className="w-full flex items-center justify-center gap-2 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-colors font-semibold text-sm active:scale-[0.98]">
                            <span className="material-symbols-outlined">logout</span>
                            Déconnexion
                        </button>
                    </div>

                    {/* Version Info */}
                    <div className="text-center pt-4 pb-8">
                        <p className="text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-widest font-bold">Cloud Nexus Platform v2.4.1</p>
                    </div>
                </div>
            </main>

            {/* iOS Home Indicator */}
            <div className="fixed bottom-0 left-0 w-full h-6 flex justify-center items-end pb-2 pointer-events-none z-50">
                <div className="w-32 h-1 bg-slate-400/20 dark:bg-white/10 rounded-full"></div>
            </div>
        </div>
    );
}

function SettingItem({ icon, iconColor, iconBg, title, subtitle, value, isDropdown, noBorder }: any) {
    return (
        <div className={`flex items-center justify-between p-4 active:bg-slate-50 dark:active:bg-white/[0.02] cursor-pointer ${!noBorder ? 'border-b border-slate-100 dark:border-white/5' : ''}`}>
            <div className="flex items-center gap-3">
                <div className={`${iconBg} p-2 rounded-lg`}>
                    <span className={`material-symbols-outlined ${iconColor} text-xl`}>{icon}</span>
                </div>
                <div>
                    <p className="text-sm font-medium">{title}</p>
                    {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</p>}
                </div>
            </div>
            <div className="flex items-center gap-1">
                {value && <span className="text-sm text-slate-400">{value}</span>}
                <span className="material-symbols-outlined text-slate-400 text-lg">{isDropdown ? 'expand_more' : 'chevron_right'}</span>
            </div>
        </div>
    );
}
