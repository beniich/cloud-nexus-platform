import React from 'react';
import { SectionRenderer } from './SectionRenderer';
import { Site } from '../../../types/site.types';

interface PreviewModalProps {
    site: Site;
    onClose: () => void
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ site, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{site.name}</h2>
                        {site.url && <p className="text-sm text-blue-600">{site.url}</p>}
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
                        <span className="text-2xl">×</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {site.sections.sort((a, b) => a.order - b.order).map(section => (
                        <SectionRenderer key={section.id} section={section} isPreview />
                    ))}
                </div>
            </div>
        </div>
    );
};
