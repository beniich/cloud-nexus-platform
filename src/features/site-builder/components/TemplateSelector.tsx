import React, { useState } from 'react';
import { ArrowLeft, Layout } from 'lucide-react';
import { templates } from '../../../data/templates';

interface TemplateSelectorProps {
    onSelect: (template: string, siteName: string) => void;
    onBack: () => void
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect, onBack }) => {
    const [siteName, setSiteName] = useState('');



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-8">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <h1 className="text-4xl font-bold text-slate-900 mb-2">Choose a Template</h1>
                <p className="text-slate-600 mb-8">Select a template to start building your site</p>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
                    <input
                        type="text"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        placeholder="My Awesome Site"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(template => (
                        <button
                            key={template.id}
                            onClick={() => siteName && onSelect(template.id, siteName)}
                            disabled={!siteName}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                {template.thumbnail.startsWith('/') ? (
                                    <Layout size={48} className="text-gray-400" />
                                ) : (
                                    <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{template.name}</h3>
                            <p className="text-sm text-slate-600">{template.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
