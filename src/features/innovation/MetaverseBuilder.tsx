import { Box } from 'lucide-react';

export default function MetaverseBuilder() {
    return (
        <div className="p-6 bg-[#0a0e1a] min-h-[calc(100vh-200px)] rounded-2xl text-white">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Metaverse Builder</h2>
                    <p className="text-gray-400">Create immersive 3D web experiences</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)',
                                backgroundSize: '40px 40px'
                            }}></div>
                        </div>

                        <div className="relative min-h-[400px] flex items-center justify-center">
                            <div className="relative" style={{ perspective: '1000px' }}>
                                <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 border border-cyan-500/30 flex items-center justify-center transform hover:scale-105 transition-transform">
                                    <Box className="w-24 h-24 text-cyan-400" />
                                </div>
                            </div>
                        </div>

                        <button className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-sm font-bold shadow-lg hover:shadow-cyan-500/50 transition-all">
                            Enter VR Mode
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                            <h3 className="text-sm font-bold mb-4">Scene Properties</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-400 mb-2 block">Environment</label>
                                    <select className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg px-3 py-2 text-sm">
                                        <option>Cyberpunk City</option>
                                        <option>Space Station</option>
                                        <option>Minimal Studio</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                            <h3 className="text-sm font-bold mb-4">3D Assets</h3>
                            <div className="space-y-2">
                                {[
                                    { name: 'Product Display', size: '2.4 MB' },
                                    { name: 'Furniture Set', size: '5.1 MB' }
                                ].map((asset, i) => (
                                    <div key={i} className="p-3 rounded-lg bg-[#0a0e1a] border border-purple-500/20 hover:border-purple-500/50 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/20 flex items-center justify-center">
                                                <Box className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold">{asset.name}</p>
                                                <p className="text-xs text-gray-500">.glb • {asset.size}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
