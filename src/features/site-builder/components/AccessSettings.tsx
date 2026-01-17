import React, { useState } from 'react';
import { Site } from '../../../types/site.types';
import { Lock, Globe, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';

interface AccessSettingsProps {
    site: Site;
    onUpdate: (settings: Partial<Site['settings']>) => void;
}

export const AccessSettings: React.FC<AccessSettingsProps> = ({ site, onUpdate }) => {
    const [showPassword, setShowPassword] = useState(false);

    // Safety check for access object
    const accessConfig = site.settings.access || { isPrivate: false, password: '' };

    const handleVisibilityChange = (isPrivate: boolean) => {
        onUpdate({
            ...site.settings,
            access: {
                ...accessConfig,
                isPrivate
            }
        });
    };

    const handlePasswordChange = (password: string) => {
        onUpdate({
            ...site.settings,
            access: {
                ...accessConfig,
                password
            }
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Site Access</h3>
                <p className="text-sm text-slate-500 mb-6">
                    Control who can view your published site. Premium feature.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                        onClick={() => handleVisibilityChange(false)}
                        className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${!accessConfig.isPrivate
                                ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <Globe size={24} className="mb-2" />
                        <span className="font-medium">Public</span>
                        <span className="text-xs mt-1 text-center opacity-75">Anyone with the link can view</span>
                    </button>

                    <button
                        onClick={() => handleVisibilityChange(true)}
                        className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${accessConfig.isPrivate
                                ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <Lock size={24} className="mb-2" />
                        <span className="font-medium">Private</span>
                        <span className="text-xs mt-1 text-center opacity-75">Password required to view</span>
                    </button>
                </div>

                {accessConfig.isPrivate && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Set Access Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={accessConfig.password || ''}
                                onChange={(e) => handlePasswordChange(e.target.value)}
                                className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter a secure password..."
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Visitors will see a lock screen and must enter this password to view your site content.
                        </p>
                    </div>
                )}
            </div>

            <Alert className="bg-blue-50 border-blue-100 text-blue-800">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-xs ml-2">
                    This feature uses client-side encryption. Your content is encrypted before being published and can only be decrypted with the password.
                </AlertDescription>
            </Alert>
        </div>
    );
};
