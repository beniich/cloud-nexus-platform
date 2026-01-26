import { Shield, Zap, X } from 'lucide-react';

export default function SecurityScanner() {
    return (
        <div className="p-6 bg-[#0a0e1a] min-h-[calc(100vh-200px)] rounded-2xl text-white">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Security Scanner</h2>
                    <p className="text-gray-400">Zero-trust vulnerability detection</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            <span className="text-xs text-gray-400">Passed</span>
                        </div>
                        <div className="text-3xl font-bold">142</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <span className="text-xs text-gray-400">Warnings</span>
                        </div>
                        <div className="text-3xl font-bold text-yellow-500">3</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-red-500/20 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <X className="w-5 h-5 text-red-500" />
                            <span className="text-xs text-gray-400">Critical</span>
                        </div>
                        <div className="text-3xl font-bold text-red-500">0</div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold mb-4">Threat Analysis</h3>
                    <div className="space-y-3">
                        {[
                            { name: 'HTTPS Enforced', status: 'SECURE', color: 'emerald' },
                            { name: 'CSP Headers Missing', status: 'MEDIUM', color: 'yellow' },
                            { name: 'Zero-Knowledge Encryption', status: 'ACTIVE', color: 'emerald' }
                        ].map((item, i) => (
                            <div key={i} className={`bg-[#0a0e1a] rounded-lg p-4 border-l-2 border-l-${item.color}-500`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold">{item.name}</span>
                                    <span className={`text-xs px-2 py-1 rounded bg-${item.color}-500/20 text-${item.color}-500`}>
                                        {item.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400">Automated security check completed</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
