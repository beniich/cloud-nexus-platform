import React, { useState } from 'react';

export default function AIDesignOverlay({ onClose }: { onClose?: () => void }) {
    const [viewMode, setViewMode] = useState<'Original' | 'Suggested'>('Suggested');

    return (
        <div className="fixed inset-0 z-50 flex flex-col pointer-events-none font-sans">
            {/* Top Navigation Panel */}
            <div className="w-full bg-[#23170f]/85 backdrop-blur-xl border-b border-white/10 pointer-events-auto shadow-lg">
                <div className="flex items-center p-4 pb-2 justify-between max-w-md mx-auto">
                    <button onClick={onClose} className="text-white flex size-12 shrink-0 items-center hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <h2 className="text-white text-lg font-bold leading-tight">AI Assistant</h2>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Cloud Nexus Pro</span>
                    </div>
                    <div className="flex w-12 items-center justify-end">
                        <p className="text-primary text-base font-bold shrink-0">Preview</p>
                    </div>
                </div>

                {/* Preview Toggle Segment */}
                <div className="flex px-4 py-3 max-w-md mx-auto">
                    <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-white/10 p-1">
                        <button
                            onClick={() => setViewMode('Original')}
                            className={`flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-medium transition-all ${viewMode === 'Original' ? 'bg-[#23170f] shadow-lg text-white' : 'text-white/60 hover:text-white'}`}
                        >
                            Original
                        </button>
                        <button
                            onClick={() => setViewMode('Suggested')}
                            className={`flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-medium transition-all ${viewMode === 'Suggested' ? 'bg-[#23170f] shadow-lg text-white' : 'text-white/60 hover:text-white'}`}
                        >
                            Suggested
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area (Spacers) */}
            <div className="flex-1 pointer-events-none">
                {/* This area would overlap the actual website canvas */}
            </div>

            {/* AI Interaction Layer (Bottom Sheet) */}
            <div className="w-full bg-[#23170f]/90 backdrop-blur-xl border-t border-white/10 p-4 rounded-t-3xl pointer-events-auto shadow-2xl pb-8">
                <div className="max-w-md mx-auto">
                    {/* AI Message Container */}
                    <div className="flex items-start gap-3 mb-4">
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-full border-2 border-primary/50 flex items-center justify-center bg-black/20 text-white">
                                <span className="material-symbols-outlined text-2xl">smart_toy</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 flex items-center justify-center border-2 border-[#23170f]">
                                <span className="material-symbols-outlined text-[14px] font-bold">auto_awesome</span>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col gap-1 items-start">
                            <p className="text-white/60 text-[13px] font-medium leading-normal">Cloud Nexus AI</p>
                            <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-white shadow-sm">
                                <p className="text-base font-normal leading-relaxed">
                                    I noticed your hero section could use more contrast. Would you like me to apply a dark overlay to the background image?
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Smart Actions */}
                    <div className="flex justify-stretch mb-6">
                        <div className="flex flex-1 gap-3 flex-wrap justify-start">
                            <button className="flex-1 min-w-[120px] rounded-xl h-12 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-orange-600 transition-colors">
                                Apply Changes
                            </button>
                            <button className="flex-1 min-w-[120px] rounded-xl h-12 px-4 bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors">
                                Dismiss
                            </button>
                        </div>
                    </div>

                    {/* Bottom Input Bar */}
                    <div className="relative flex items-center gap-2 mb-2">
                        <div className="flex-1 relative">
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-12 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                                placeholder="Ask AI to change something..."
                                type="text"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-white cursor-pointer transition-colors">
                                <span className="material-symbols-outlined">mic</span>
                            </div>
                        </div>
                        <button className="bg-primary size-12 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-orange-600 transition-colors">
                            <span className="material-symbols-outlined text-white">arrow_upward</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
