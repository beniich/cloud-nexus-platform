import React from 'react';

export default function AIChatInterface() {
    return (
        <div className="relative flex h-full w-full max-w-[430px] mx-auto flex-col overflow-hidden bg-background-light dark:bg-background-dark border-x border-white/10 shadow-lg">
            {/* TopAppBar */}
            <header className="sticky top-0 z-30 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-white/5">
                <div className="text-primary flex size-12 shrink-0 items-center justify-start cursor-pointer">
                    <span className="material-symbols-outlined text-3xl">menu</span>
                </div>
                <div className="flex flex-col items-center">
                    <h2 className="text-slate-900 dark:text-white text-base font-bold leading-tight tracking-tight">Assistant Cloud Nexus</h2>
                    <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-green-500"></span>
                        <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Connecté</span>
                    </div>
                </div>
                <div className="flex w-12 items-center justify-end">
                    <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-transparent text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined">history</span>
                    </button>
                </div>
            </header>

            {/* Chat Feed */}
            <main className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-hide">
                {/* SectionHeader */}
                <div className="flex flex-col items-center py-4">
                    <span className="text-slate-500 dark:text-white/40 text-[11px] font-bold uppercase tracking-[0.1em] bg-slate-200 dark:bg-white/5 px-3 py-1 rounded-full">Aujourd'hui</span>
                </div>

                {/* AI Message */}
                <Message
                    sender="AI"
                    name="NEXUS AI"
                    content="Bonjour ! J'ai analysé vos tickets de support récents. Souhaitez-vous optimiser votre SEO ou changer la palette de couleurs de votre site ?"
                />

                {/* User Message */}
                <Message
                    sender="USER"
                    name="VOUS"
                    content="Montre-moi des suggestions pour la palette de couleurs."
                    avatar="https://via.placeholder.com/100"
                />

                {/* AI Message with Card */}
                <div className="flex items-start gap-3">
                    <div className="bg-primary/20 flex items-center justify-center rounded-full w-9 h-9 shrink-0 border border-primary/30 text-primary">
                        <span className="material-symbols-outlined text-xl">smart_toy</span>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 items-start">
                        <p className="text-primary/70 text-[12px] font-semibold tracking-wide ml-1">NEXUS AI</p>
                        <div className="text-[15px] font-normal leading-relaxed max-w-[90%] rounded-2xl rounded-tl-none px-4 py-3 bg-white dark:bg-[#3d2a1e] text-slate-800 dark:text-white shadow-sm dark:shadow-none">
                            D'après votre contenu, voici une palette moderne qui améliorerait votre taux de conversion :
                        </div>

                        {/* Card Component */}
                        <div className="w-full max-w-[320px] overflow-hidden rounded-2xl bg-white dark:bg-[#352318] border border-gray-200 dark:border-white/5 shadow-md dark:shadow-xl">
                            <div className="relative w-full aspect-video">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#f97015] via-[#fb923c] to-[#4a3121]"></div>
                                <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md text-[10px] text-white px-2 py-1 rounded">Aperçu direct</div>
                            </div>
                            <div className="p-4 flex flex-col gap-3">
                                <div>
                                    <h4 className="text-slate-900 dark:text-white text-base font-bold leading-tight">Palette 'Sunset Orange'</h4>
                                    <p className="text-primary/80 dark:text-primary/60 text-xs font-medium mt-1 uppercase tracking-wide">Optimisé pour l'accessibilité</p>
                                </div>
                                <button className="flex items-center justify-center gap-2 w-full rounded-xl h-10 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform hover:bg-orange-600">
                                    <span className="material-symbols-outlined text-lg">palette</span>
                                    <span>Appliquer au Site</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Empty space */}
                <div className="h-12"></div>
            </main>

            {/* Bottom UI Section */}
            <footer className="sticky bottom-0 bg-background-light dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-white/5 p-4 space-y-4 pb-8">
                {/* Quick Prompts */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
                    <QuickPrompt icon="auto_graph" label="Optimiser mon SEO" />
                    <QuickPrompt icon="confirmation_number" label="Résumé des tickets" />
                    <QuickPrompt icon="monitoring" label="Stats de vente" />
                </div>

                {/* Message Input Bar */}
                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center size-12 rounded-full bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-white active:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined">mic</span>
                    </button>
                    <div className="relative flex-1">
                        <input
                            className="w-full bg-slate-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-full px-5 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 placeholder-slate-400 dark:placeholder-white/20"
                            placeholder="Posez une question à Nexus..."
                            type="text"
                        />
                        <button className="absolute right-1.5 top-1.5 size-9 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 active:scale-90 transition-transform hover:bg-orange-600">
                            <span className="material-symbols-outlined text-xl">send</span>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function Message({ sender, name, content, avatar }: any) {
    const isAi = sender === 'AI';
    return (
        <div className={`flex items-${isAi ? 'start' : 'end'} gap-3 ${!isAi ? 'justify-end' : ''}`}>
            {isAi && (
                <div className="bg-primary/20 flex items-center justify-center rounded-full w-9 h-9 shrink-0 border border-primary/30 text-primary">
                    <span className="material-symbols-outlined text-xl">smart_toy</span>
                </div>
            )}

            <div className={`flex flex-1 flex-col gap-1.5 items-${isAi ? 'start' : 'end'}`}>
                <p className={`${isAi ? 'text-primary/70 ml-1' : 'text-slate-400 dark:text-white/40 mr-1'} text-[12px] font-semibold tracking-wide`}>{name}</p>
                <div className={`text-[15px] font-normal leading-relaxed max-w-[85%] px-4 py-3 shadow-md ${isAi
                        ? 'bg-white dark:bg-[#3d2a1e] text-slate-800 dark:text-white rounded-2xl rounded-tl-none'
                        : 'bg-primary text-white rounded-2xl rounded-tr-none shadow-primary/20'
                    }`}>
                    {content}
                </div>
            </div>

            {!isAi && (
                <div className="bg-slate-200 dark:bg-white/10 rounded-full w-9 h-9 shrink-0 overflow-hidden border border-gray-300 dark:border-white/20">
                    {/* User Avatar Placeholder */}
                    <span className="flex items-center justify-center h-full w-full text-xs font-bold text-slate-500">ME</span>
                </div>
            )}
        </div>
    );
}

function QuickPrompt({ icon, label }: any) {
    return (
        <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full text-xs font-semibold text-slate-700 dark:text-white transition-colors">
            <span className="material-symbols-outlined text-sm text-primary">{icon}</span>
            {label}
        </button>
    );
}
