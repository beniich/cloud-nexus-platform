import React, { useState } from 'react';
import {
    Save, ArrowLeft, Settings, PlusCircle, Monitor,
    Smartphone, Tablet, Download
} from 'lucide-react';
import {
    DndContext, closestCenter, KeyboardSensor,
    PointerSensor, useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Site, SiteSection } from '../../../types/site.types';
import { useSites } from '../context/SiteContext';
import { PropertiesPanel } from './PropertiesPanel';
import { SortableSection } from './SortableSection';
import { SectionLibrary } from './SectionLibrary';
import { SectionBlueprint } from '../../../data/section-library';
import { SectionRenderer } from './SectionRenderer';
import { ThemeCustomizer } from './ThemeCustomizer';
import { CustomDomainSettings } from './CustomDomainSettings';
import { BuildEngine } from '../../../services/build-engine';

interface EditorProps {
    site: Site;
    onBack: () => void
}

export const Editor: React.FC<EditorProps> = ({ site, onBack }) => {
    const { updateSite, reorderSections, addSection } = useSites();
    const [localSite, setLocalSite] = useState(site);
    const [selectedSection, setSelectedSection] = useState<SiteSection | null>(null);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [activeTab, setActiveTab] = useState<'section' | 'theme' | 'settings'>('section');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleThemeUpdate = (updates: Partial<Site['templateConfig']>) => {
        setLocalSite(prev => ({
            ...prev,
            templateConfig: {
                ...prev.templateConfig!,
                ...updates
            }
        }));
    };

    const handleSave = () => {
        updateSite(site.id, { sections: localSite.sections });
        alert('Site saved successfully!');
    };

    const handleExport = async () => {
        try {
            const engine = new BuildEngine();
            const zipBlob = await engine.generateZip(localSite);

            // Trigger download
            const url = window.URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${localSite.name.toLowerCase().replace(/\s+/g, '-')}-export.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export site');
        }
    };

    const updateSection = (sectionId: string, updates: Partial<SiteSection>) => {
        const updatedSections = localSite.sections.map(s =>
            s.id === sectionId ? { ...s, ...updates } : s
        );

        setLocalSite(prev => ({
            ...prev,
            sections: updatedSections
        }));

        if (selectedSection && selectedSection.id === sectionId) {
            setSelectedSection(prev => prev ? { ...prev, ...updates } : null);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setLocalSite((prev) => {
                const oldIndex = prev.sections.findIndex((s) => s.id === active.id);
                const newIndex = prev.sections.findIndex((s) => s.id === over.id);

                const newSections = arrayMove(prev.sections, oldIndex, newIndex);
                reorderSections(site.id, newSections);

                return {
                    ...prev,
                    sections: newSections,
                };
            });
        }
    };

    const handleAddSection = (blueprint: SectionBlueprint) => {
        addSection(site.id, blueprint.type, blueprint.defaultContent);

        const newSection: SiteSection = {
            id: `section-${Date.now()}`,
            type: blueprint.type,
            title: blueprint.name,
            order: localSite.sections.length,
            props: {},
            content: blueprint.defaultContent
        };

        setLocalSite(prev => ({
            ...prev,
            sections: [...prev.sections, newSection]
        }));

        setIsLibraryOpen(false);
    };

    return (
        <div className="h-screen bg-slate-100 flex overflow-hidden">
            {/* Left Sidebar - Navigation & Structure */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
                <div className="p-4 border-b border-slate-200">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <h2 className="text-lg font-bold text-slate-900 truncate">{localSite.name}</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Structure</h3>
                        <button
                            onClick={() => setIsLibraryOpen(true)}
                            className="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded"
                            title="Add Section"
                        >
                            <PlusCircle size={18} />
                        </button>
                    </div>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={localSite.sections.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2">
                                {localSite.sections.map(section => (
                                    <div
                                        key={section.id}
                                        onClick={() => setSelectedSection(section)}
                                        className="cursor-pointer"
                                    >
                                        <SortableSection id={section.id} isActive={selectedSection?.id === section.id}>
                                            <div className={`w-full text-left p-2 rounded-md transition-colors text-sm ${selectedSection?.id === section.id
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                                }`}>
                                                <div className="flex items-center gap-2 ml-6">
                                                    <span className="capitalize">{section.type}</span>
                                                </div>
                                            </div>
                                        </SortableSection>
                                    </div>
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

                <div className="p-4 border-t border-slate-200 space-y-2">
                    <button
                        onClick={handleSave}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                        <Save size={16} />
                        Save
                    </button>
                    <button
                        onClick={handleExport}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                    >
                        <Download size={16} />
                        Export HTML
                    </button>
                </div>
            </div>

            {/* Center - Live Canvas */}
            <div className="flex-1 bg-slate-100 flex flex-col relative overflow-hidden">
                {/* Canvas Toolbar */}
                <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-center px-4 shrink-0">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setPreviewMode('desktop')}
                            className={`p-2 rounded-md transition-all ${previewMode === 'desktop' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Monitor size={16} />
                        </button>
                        <button
                            onClick={() => setPreviewMode('tablet')}
                            className={`p-2 rounded-md transition-all ${previewMode === 'tablet' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Tablet size={16} />
                        </button>
                        <button
                            onClick={() => setPreviewMode('mobile')}
                            className={`p-2 rounded-md transition-all ${previewMode === 'mobile' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Smartphone size={16} />
                        </button>
                    </div>
                </div>

                {/* Canvas Content */}
                <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                    <div
                        className={`bg-white shadow-2xl transition-all duration-300 origin-top
                            ${previewMode === 'mobile' ? 'w-[375px]' : previewMode === 'tablet' ? 'w-[768px]' : 'w-full max-w-[1200px]'}
                        `}
                        style={{ minHeight: '100%' }}
                    >
                        {localSite.sections.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400 border-2 border-dashed border-slate-200 m-8 rounded-xl">
                                <PlusCircle size={48} className="mb-4 opacity-50" />
                                <p className="text-lg">Your site is empty</p>
                                <button
                                    onClick={() => setIsLibraryOpen(true)}
                                    className="mt-4 text-blue-600 hover:underline"
                                >
                                    Add your first section
                                </button>
                            </div>
                        ) : (
                            localSite.sections.map((section) => (
                                <div
                                    key={section.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSection(section);
                                    }}
                                    className={`relative group ring-2 transition-all ${selectedSection?.id === section.id
                                            ? 'ring-blue-500 z-10'
                                            : 'ring-transparent hover:ring-blue-300 ring-1'
                                        }`}
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-sm">
                                            {section.type}
                                        </span>
                                    </div>
                                    <SectionRenderer section={section} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Properties */}
            <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-20">
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('section')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'section'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Properties
                    </button>
                    <button
                        onClick={() => setActiveTab('theme')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'theme'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Theme
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'settings'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Settings
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === 'section' && (
                        selectedSection ? (
                            <PropertiesPanel
                                section={selectedSection}
                                onUpdate={(updates) => updateSection(selectedSection.id, updates)}
                            />
                        ) : (
                            <div className="text-center py-12">
                                <Settings size={48} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500 text-sm">Select a section in the canvas or sidebar to edit its properties.</p>
                            </div>
                        )
                    )}

                    {activeTab === 'theme' && (
                        <ThemeCustomizer
                            site={localSite}
                            onUpdate={handleThemeUpdate}
                        />
                    )}

                    {activeTab === 'settings' && (
                        <CustomDomainSettings
                            site={localSite}
                            onUpdate={(domain) => setLocalSite(prev => ({ ...prev, domain }))}
                        />
                    )}
                </div>
            </div>

            <SectionLibrary
                isOpen={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
                onAddSection={handleAddSection}
            />
        </div>
    );
};
