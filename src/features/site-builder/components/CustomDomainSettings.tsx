import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, RefreshCw, Copy, Globe } from 'lucide-react';
import { DeploymentService } from '../../../services/deployment/deployment-service';
import { DomainVerification, DNSRecord } from '../../../types/deployment.types';
import { Site } from '../../../types/site.types';

interface CustomDomainSettingsProps {
    site: Site;
    onUpdate: (domain: string) => void;
}

export const CustomDomainSettings: React.FC<CustomDomainSettingsProps> = ({ site, onUpdate }) => {
    const [domain, setDomain] = useState(site.domain || '');
    const [verification, setVerification] = useState<DomainVerification | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [provider] = useState('vercel'); // Default to Vercel for now, or make selectable

    const deploymentService = new DeploymentService();

    useEffect(() => {
        if (site.domain) {
            checkVerification(site.domain);
        }
    }, [site.domain]);

    const checkVerification = async (domainToCheck: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await deploymentService.verifyDomain(provider, domainToCheck);
            setVerification(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Calibration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnect = async () => {
        if (!domain) return;
        onUpdate(domain);
        await checkVerification(domain);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast here
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <Globe size={16} />
                    Custom Domain
                </h3>
                <p className="text-xs text-slate-500">
                    Connect your own domain (e.g. www.mysite.com) to your site.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="example.com"
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleConnect}
                        disabled={isLoading || !domain}
                        className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Checking...' : 'Connect'}
                    </button>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {verification && (
                    <div className={`border rounded-lg p-4 ${verification.verified ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                {verification.verified ? (
                                    <span className="flex items-center gap-1 text-green-700 text-sm font-medium">
                                        <Check size={16} />
                                        Verified
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-amber-600 text-sm font-medium">
                                        <AlertCircle size={16} />
                                        Configuration Required
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => checkVerification(domain)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-700 transition-colors"
                                title="Refresh Status"
                            >
                                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                            </button>
                        </div>

                        {!verification.verified && verification.records.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-xs text-slate-600">
                                    Add the following records to your DNS provider to verify your domain:
                                </p>
                                <div className="space-y-2">
                                    {verification.records.map((record, index) => (
                                        <div key={index} className="bg-slate-50 p-2 rounded border border-slate-100 text-xs">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-slate-700">{record.type} Record</span>
                                                <button
                                                    onClick={() => copyToClipboard(record.value)}
                                                    className="text-slate-400 hover:text-blue-600"
                                                    title="Copy Value"
                                                >
                                                    <Copy size={12} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-[40px_1fr] gap-2">
                                                <span className="text-slate-500">Name:</span>
                                                <code className="text-slate-800">{record.name}</code>
                                                <span className="text-slate-500">Value:</span>
                                                <code className="text-slate-800 break-all">{record.value}</code>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {verification.verified && (
                            <p className="text-xs text-green-700 mt-2">
                                Great! Your domain is correctly configured and active.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
