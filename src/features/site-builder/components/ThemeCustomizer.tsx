import React from 'react';
import { Site } from '../../../types/site.types';

interface ThemeCustomizerProps {
    site: Site;
    onUpdate: (updates: Partial<Site['templateConfig']>) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ site, onUpdate }) => {
    const config = site.templateConfig || {
        colors: {
            primary: '#2563eb',
            secondary: '#1e40af',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#1f2937',
            textLight: '#6b7280',
            border: '#e5e7eb',
        },
        fonts: {
            heading: 'Inter',
            body: 'Inter',
            sizes: {
                h1: '3.75rem',
                h2: '3rem',
                h3: '2.25rem',
                body: '1rem',
                small: '0.875rem'
            }
        }
    };

    const handleColorChange = (key: string, value: string) => {
        onUpdate({
            ...config,
            colors: {
                ...config.colors,
                [key]: value
            }
        });
    };

    const handleFontChange = (key: string, value: string) => {
        onUpdate({
            ...config,
            fonts: {
                ...config.fonts,
                [key]: value
            }
        });
    };

    const fontOptions = [
        'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Playfair Display'
    ];

    return (
        <div className="space-y-6">
            <div>
                <h4 className="font-semibold text-slate-900 mb-3">Colors</h4>
                <div className="space-y-3">
                    {Object.entries(config.colors).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                            <label className="text-sm text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-mono">{value}</span>
                                <input
                                    type="color"
                                    value={value as string}
                                    onChange={(e) => handleColorChange(key, e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
                <h4 className="font-semibold text-slate-900 mb-3">Typography</h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Heading Font</label>
                        <select
                            value={config.fonts.heading}
                            onChange={(e) => handleFontChange('heading', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {fontOptions.map(font => (
                                <option key={font} value={font}>{font}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Body Font</label>
                        <select
                            value={config.fonts.body}
                            onChange={(e) => handleFontChange('body', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {fontOptions.map(font => (
                                <option key={font} value={font}>{font}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};
