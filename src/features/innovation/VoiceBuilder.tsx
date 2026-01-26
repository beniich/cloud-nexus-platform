import { useState } from 'react';
import { Mic, Sparkles } from 'lucide-react';

export default function VoiceBuilder() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');

    const startRecording = () => {
        setIsRecording(true);
        setTimeout(() => {
            setTranscript('Create a modern restaurant website with dark theme, reservation system, and menu gallery');
        }, 1500);
        setTimeout(() => setIsRecording(false), 5000);
    };

    return (
        <div className="p-6 bg-[#0a0e1a] min-h-[calc(100vh-200px)] rounded-2xl text-white">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Voice AI Builder</h2>
                    <p className="text-gray-400">Generate complete websites using natural language</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Voice Input */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative">
                                {isRecording && (
                                    <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-50"></div>
                                )}
                                <button
                                    onClick={startRecording}
                                    disabled={isRecording}
                                    className={`relative w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg transition-transform ${isRecording ? 'scale-110' : 'hover:scale-105'
                                        }`}
                                >
                                    <Mic className="w-12 h-12 text-white" />
                                </button>
                            </div>

                            <p className="text-sm text-gray-400">
                                {isRecording ? 'Listening...' : 'Click to speak your vision'}
                            </p>

                            {isRecording && (
                                <div className="flex gap-1 h-16 items-center">
                                    {[...Array(7)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-1 bg-indigo-500 rounded-full"
                                            style={{
                                                animation: `wave 1.2s ease-in-out infinite`,
                                                animationDelay: `${i * 0.1}s`,
                                                height: '12px'
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            {transcript && (
                                <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-sm text-gray-300 italic">"{transcript}"</p>
                                </div>
                            )}
                        </div>

                        {/* AI Pipeline Status */}
                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-300">Speech Recognition</p>
                                    <div className="h-1 bg-white/10 rounded-full mt-1">
                                        <div className="h-full w-full bg-emerald-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                                    <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-300">Claude Analysis</p>
                                    <div className="h-1 bg-white/10 rounded-full mt-1">
                                        <div className="h-full w-3/4 bg-indigo-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live Preview */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            Building in real-time...
                        </h3>

                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6">
                                <div className="text-xs text-white/60 mb-2">HERO SECTION</div>
                                <h3 className="text-2xl font-bold mb-2 text-white">Welcome to Your Site</h3>
                                <p className="text-white/80 text-sm mb-4">Auto-generated from voice</p>
                                <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium">
                                    Call to Action
                                </button>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="text-xs text-gray-500 mb-3">FEATURES GRID</div>
                                <div className="grid grid-cols-3 gap-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-white/5 rounded-lg p-3 text-center">
                                            <div className="w-8 h-8 bg-white/10 rounded-lg mx-auto mb-2"></div>
                                            <p className="text-xs text-gray-400">Feature {i}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
        @keyframes wave {
          0%, 100% { height: 12px; }
          50% { height: 40px; }
        }
      `}</style>
        </div>
    );
}
