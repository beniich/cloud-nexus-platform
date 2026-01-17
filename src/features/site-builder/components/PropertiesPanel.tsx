import React from 'react';
import { SiteSection } from '../../../types/site.types';

interface PropertiesPanelProps {
    section: SiteSection;
    onUpdate: (updates: Partial<SiteSection>) => void
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ section, onUpdate }) => {
    const updateContent = (key: string, value: any) => {
        onUpdate({
            content: { ...section.content, [key]: value }
        });
    };



    return (
        <div className="max-w-2xl bg-white rounded-xl shadow-md p-8">
            <h4 className="text-lg font-semibold text-slate-900 mb-6">Section Properties</h4>

            {/* Common Heading Field - Almost all sections have this */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Heading</label>
                <input
                    type="text"
                    value={section.content.heading || ''}
                    onChange={(e) => updateContent('heading', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {section.type === 'hero' && (
                <>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Subheading</label>
                        <input
                            type="text"
                            value={section.content.subheading || ''}
                            onChange={(e) => updateContent('subheading', e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Button Text</label>
                        <input
                            type="text"
                            value={section.content.cta?.text || ''}
                            onChange={(e) => updateContent('cta', { ...section.content.cta, text: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </>
            )}

            {(section.type === 'about' || section.type === 'contact') && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Text / Description</label>
                    <textarea
                        value={section.content.text || ''}
                        onChange={(e) => updateContent('text', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}

            {section.type === 'services' && (
                <>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Subheading</label>
                        <input
                            type="text"
                            value={section.content.subheading || ''}
                            onChange={(e) => updateContent('subheading', e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Simplified item editor for MVP - could be expanded */}
                    <p className="text-sm text-slate-500 italic">Editing individual service items is limited in this view.</p>
                </>
            )}
        </div>
    );
};
