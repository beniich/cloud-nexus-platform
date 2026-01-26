import React from 'react';

export default function SiteEditor() {
    return (
        <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-background-dark shadow-2xl text-slate-100 font-sans">
            {/* Top Toolbar */}
            <header className="flex items-center justify-between px-4 py-3 bg-card-dark border-b border-white/5 z-50">
                <div className="flex items-center gap-1">
                    <button className="p-2 text-white/70 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-xl">undo</span>
                    </button>
                    <button className="p-2 text-white/30 cursor-not-allowed">
                        <span className="material-symbols-outlined text-xl">redo</span>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 flex items-center gap-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-lg">visibility</span>
                        <span class="text-xs font-semibold">Preview</span>
                    </button>
                    <button className="px-4 py-1.5 flex items-center gap-1.5 bg-primary hover:bg-orange-600 rounded-full transition-colors text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-lg">rocket_launch</span>
                        <span class="text-xs font-bold uppercase tracking-wider">Publish</span>
                    </button>
                </div>
            </header>

            {/* Canvas Area */}
            <main className="flex-1 overflow-y-auto bg-slate-200 relative p-4 scrollbar-hide">
                <div className="w-full min-h-full bg-white rounded-lg shadow-sm overflow-hidden flex flex-col max-w-md mx-auto">
                    {/* Hero Section Component */}
                    <section className="relative group cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                        {/* Active Selection Indicator (Mockup for now) */}
                        <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-br-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            HERO SECTION
                        </div>

                        <div className="p-8 text-center space-y-4">
                            <div className="relative inline-block px-2 py-1 border border-dashed border-transparent hover:border-blue-500/40 rounded transition-colors">
                                <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">Elevate Your Digital Presence</h1>
                            </div>
                            <p className="text-slate-600 text-sm">Create stunning experiences with the Cloud Nexus Platform.</p>
                            <div className="pt-4">
                                <div className="w-full h-48 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                    <span className="material-symbols-outlined text-4xl">image</span>
                                </div>
                            </div>
                            <div className="flex justify-center gap-3 pt-4">
                                <div className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold text-sm">Get Started</div>
                                <div className="px-6 py-3 border border-slate-200 text-slate-900 rounded-full font-bold text-sm">Learn More</div>
                            </div>
                        </div>
                    </section>

                    {/* Placeholder Next Section */}
                    <section className="p-8 border-t border-slate-100 bg-white/50 grayscale opacity-40">
                        <div className="h-4 w-1/3 bg-slate-200 rounded mb-4"></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-20 bg-slate-100 rounded-lg"></div>
                            <div className="h-20 bg-slate-100 rounded-lg"></div>
                        </div>
                    </section>
                </div>

                {/* Floating Layers Button */}
                <button className="absolute top-6 right-6 size-12 bg-card-dark border border-white/10 rounded-full flex items-center justify-center text-primary shadow-2xl z-20 hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined">layers</span>
                </button>
            </main>

            {/* Bottom Sheet / Tools */}
            <div className="relative bottom-0 left-0 w-full bg-card-dark border-t border-white/10 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50">
                <div className="flex justify-center py-3">
                    <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
                </div>

                {/* Elements Draggable Area */}
                <div className="px-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">add_circle</span>
                            Add Elements
                        </h3>
                        <button className="text-white/40 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-4 pb-4">
                        <ElementButton icon="text_fields" label="Text" />
                        <ElementButton icon="image" label="Image" />
                        <ElementButton icon="smart_button" label="Button" />
                        <ElementButton icon="play_circle" label="Video" />
                    </div>
                </div>

                {/* Editor Navigation */}
                <nav className="bg-black/40 border-t border-white/5 px-8 py-3 flex items-center justify-between">
                    <NavButton icon="dashboard" label="Templates" />
                    <NavButton icon="auto_fix_high" label="Editor" active />
                    <NavButton icon="style" label="Theme" />
                    <NavButton icon="settings" label="Settings" />
                </nav>
            </div>
        </div>
    );
}

function ElementButton({ icon, label }: { icon: string, label: string }) {
    return (
        <div className="flex flex-col items-center gap-2 group cursor-grab active:cursor-grabbing">
            <div className="size-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/80 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            <span className="text-[10px] font-medium text-white/60 group-hover:text-white transition-colors">{label}</span>
        </div>
    );
}

function NavButton({ icon, label, active }: { icon: string, label: string, active?: boolean }) {
    return (
        <button className={`flex flex-col items-center gap-1 ${active ? 'text-primary' : 'text-white/40 hover:text-white transition-colors'}`}>
            <span className="material-symbols-outlined">{icon}</span>
            <span className="text-[9px] font-bold uppercase">{label}</span>
        </button>
    );
}
