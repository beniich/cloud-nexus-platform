import { Zap } from 'lucide-react';

export default function PredictiveCDN() {
    return (
        <div className="p-6 bg-[#0a0e1a] min-h-[calc(100vh-200px)] rounded-2xl text-white">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Predictive CDN Engine</h2>
                    <p className="text-gray-400">ML-powered performance optimization</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <h3 className="text-sm font-bold mb-4">User Intent Heatmap</h3>
                        <div className="bg-[#0a0e1a] rounded-xl p-4 border border-white/10">
                            <div className="h-32 rounded-lg bg-gradient-to-br from-amber-500/40 to-orange-600/30 flex items-center justify-center relative">
                                <div className="absolute top-2 right-2 bg-red-500 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                                    92%
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-bold mb-1">Primary CTA</div>
                                    <div className="text-xs text-gray-400">High click probability</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                {[40, 50, 30].map((opacity, i) => (
                                    <div key={i} className="h-16 rounded bg-blue-500" style={{ opacity: opacity / 100 }}></div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                            <p className="text-xs font-bold text-amber-500 mb-1">Preload Recommendation</p>
                            <p className="text-xs text-gray-400">
                                Product page has 92% click probability. Preloading assets now.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                            <h3 className="text-sm font-bold mb-4">ML Model Performance</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Prediction Accuracy</span>
                                        <span className="font-bold text-emerald-500">91.2%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '91.2%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                            <h3 className="text-sm font-bold mb-4">Preloaded Assets</h3>
                            <div className="space-y-2">
                                {[
                                    { name: 'hero-product-5k.webp', size: '2.3MB', confidence: 89 },
                                    { name: 'checkout-bundle.min.js', size: '145KB', confidence: 92 }
                                ].map((asset, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0e1a]">
                                        <div>
                                            <p className="text-xs font-medium">{asset.name}</p>
                                            <p className="text-xs text-gray-500">Confidence: {asset.confidence}%</p>
                                        </div>
                                        <span className="text-xs font-mono text-emerald-500">{asset.size}</span>
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
