import React from 'react';
import { Plus, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { sectionLibrary, SectionBlueprint } from '../../../data/section-library';

interface SectionLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSection: (blueprint: SectionBlueprint) => void;
}

export const SectionLibrary: React.FC<SectionLibraryProps> = ({ isOpen, onClose, onAddSection }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Component Library</h2>
                        <p className="text-slate-500 mt-1">Select a section to add to your site</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sectionLibrary.map((section) => {
                            // Dynamically get icon component
                            const IconComponent = (Icons as any)[section.icon] || Icons.Layout;

                            return (
                                <button
                                    key={section.name}
                                    onClick={() => onAddSection(section)}
                                    className="flex flex-col text-left bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-500 hover:shadow-lg rounded-xl p-6 transition-all group"
                                >
                                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <IconComponent size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{section.name}</h3>
                                    <p className="text-sm text-slate-500">{section.description}</p>

                                    <div className="mt-4 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus size={16} className="mr-1" />
                                        Add Section
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
