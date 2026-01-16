import React, { useState } from 'react';
import { Trash2, Settings, Plus, Globe, ArrowLeft, Palette, Undo2, Redo2, Grid3x3, Sparkles } from 'lucide-react';
import { USER_DATA, TEMPLATES, COMPONENT_LIBRARY, DEFAULT_BREAKPOINTS } from './data/site-data';
import AIAssistant from './components/AIAssistant';

export default function SitesDashboard() {
    const [view, setView] = useState('dashboard');
    const [sites, setSites] = useState([
        {
            id: 1,
            name: 'Restaurant Le Gourmet',
            subdomain: 'le-gourmet',
            status: 'published',
            template: 'restaurant',
            sections: TEMPLATES[0].sections,
            theme: { primaryColor: '#3b82f6', fontFamily: 'Inter', spacing: 'normal' }
        }
    ]);
    const [currentSite, setCurrentSite] = useState<any>(null);

    const handleCreateSite = () => {
        if (USER_DATA.sitesCreated >= USER_DATA.limits.pro) { // Simplified limit access for now
            alert('⚠️ Quota atteint! Passez à un plan supérieur.');
            return;
        }
        setView('create');
    };

    const handleSelectTemplate = (template: any) => {
        const newSite = {
            id: Date.now(),
            name: `Nouveau ${template.name}`,
            subdomain: `site-${Date.now()}`,
            status: 'draft',
            template: template.id,
            sections: template.sections,
            theme: { primaryColor: '#3b82f6', fontFamily: 'Inter', spacing: 'normal' }
        };
        setCurrentSite(newSite);
        setSites([...sites, newSite]);
        setView('editor');
    };

    const handleEditSite = (site: any) => {
        setCurrentSite(site);
        setView('editor');
    };

    if (view === 'dashboard') {
        return <Dashboard
            sites={sites}
            onCreateSite={handleCreateSite}
            onEditSite={handleEditSite}
            userPlan={USER_DATA.plan}
        />;
    }

    if (view === 'create') {
        return <TemplateSelector
            templates={TEMPLATES}
            onSelect={handleSelectTemplate}
            onBack={() => setView('dashboard')}
        />;
    }

    if (view === 'editor' && currentSite) {
        return <SiteEditor
            site={currentSite}
            onBack={() => setView('dashboard')}
            onSave={(updatedSite: any) => {
                setSites(sites.map(s => s.id === updatedSite.id ? updatedSite : s));
                setCurrentSite(updatedSite);
            }}
        />;
    }

    return null;
}

function Dashboard({ sites, onCreateSite, onEditSite, userPlan }: any) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Sites Vitrines</h1>
                            <p className="text-gray-600">Plan <span className="font-semibold text-blue-600 capitalize">{userPlan}</span></p>
                        </div>
                        <button
                            onClick={onCreateSite}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg"
                        >
                            <Plus size={20} />
                            Créer un Site
                        </button>
                    </div>
                </div>

                <div className="grid gap-6">
                    {sites.map(site => (
                        <div key={site.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">{TEMPLATES.find(t => t.id === site.template)?.thumbnail || '📄'}</span>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">{site.name}</h3>
                                            <a href="#" className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                                                <Globe size={14} />
                                                {site.subdomain}.cloudnexus.io
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${site.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {site.status === 'published' ? '🟢 Publié' : '⚪ Brouillon'}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => onEditSite(site)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                    <Settings size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function TemplateSelector({ templates, onSelect, onBack }: any) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-6xl mx-auto">
                <button onClick={onBack} className="mb-6 flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium">
                    <ArrowLeft size={20} />
                    Retour
                </button>

                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Choisissez un Template</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {templates.map((template: any) => (
                        <div
                            key={template.id}
                            onClick={() => onSelect(template)}
                            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all cursor-pointer group border-2 border-transparent hover:border-blue-500"
                        >
                            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{template.thumbnail}</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{template.name}</h3>
                            <p className="text-gray-600 mb-4">{template.description}</p>
                            <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold">
                                Utiliser ce template
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SiteEditor({ site, onBack, onSave }: any) {
    const [previewMode, setPreviewMode] = useState('desktop');
    const [sections, setSections] = useState(site.sections || []);
    const [theme, setTheme] = useState(site.theme || { primaryColor: '#3b82f6', fontFamily: 'Inter', spacing: 'normal' });
    const [showComponentLibrary, setShowComponentLibrary] = useState(false);
    const [showAIChat, setShowAIChat] = useState(false);
    const [history, setHistory] = useState([sections]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const saveHistory = (newSections: any) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newSections);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setSections(history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setSections(history[historyIndex + 1]);
        }
    };

    const addComponentFromLibrary = (component: any) => {
        const newSection = {
            ...component.component,
            id: `${component.id}-${Date.now()}`
        };
        const newSections = [...sections, newSection];
        setSections(newSections);
        saveHistory(newSections);
        setShowComponentLibrary(false);
    };

    const currentBreakpoint = DEFAULT_BREAKPOINTS.find(bp => bp.id === previewMode) || DEFAULT_BREAKPOINTS[3];

    return (
        <div className="h-screen flex flex-col bg-gray-900 relative">
            {/* Top Bar */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-gray-300 hover:text-white flex items-center gap-2">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-6 w-px bg-gray-600"></div>
                    <h2 className="text-white font-semibold">{site.name}</h2>
                </div>

                <div className="flex items-center gap-3">
                    {/* Undo/Redo */}
                    <div className="flex bg-gray-700 rounded-lg">
                        <button
                            onClick={undo}
                            disabled={historyIndex === 0}
                            className={`p-2 ${historyIndex === 0 ? 'text-gray-500' : 'text-gray-300 hover:text-white'}`}
                        >
                            <Undo2 size={18} />
                        </button>
                        <button
                            onClick={redo}
                            disabled={historyIndex === history.length - 1}
                            className={`p-2 ${historyIndex === history.length - 1 ? 'text-gray-500' : 'text-gray-300 hover:text-white'}`}
                        >
                            <Redo2 size={18} />
                        </button>
                    </div>

                    {/* Preview modes */}
                    <div className="flex bg-gray-700 rounded-lg p-1">
                        {DEFAULT_BREAKPOINTS.slice(0, 4).map((bp: any) => {
                            const Icon = bp.icon;
                            return (
                                <button
                                    key={bp.id}
                                    onClick={() => setPreviewMode(bp.id)}
                                    className={`p-2 rounded ${previewMode === bp.id ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
                                    title={`${bp.name} (${bp.width}px)`}
                                >
                                    <Icon size={18} />
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setShowAIChat(true)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center gap-2"
                    >
                        <Sparkles size={18} />
                        AI Assistant
                    </button>

                    <button
                        onClick={() => {
                            onSave({ ...site, sections, theme, status: 'published' });
                            alert('🎉 Site publié!');
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 flex items-center gap-2"
                    >
                        <Globe size={18} />
                        Publier
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
                    <div className="p-6">
                        {/* Bibliothèque de composants */}
                        <button
                            onClick={() => setShowComponentLibrary(!showComponentLibrary)}
                            className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2"
                        >
                            <Grid3x3 size={20} />
                            Bibliothèque de Composants
                        </button>

                        {showComponentLibrary && (
                            <div className="mb-6 space-y-2">
                                {COMPONENT_LIBRARY.map((comp: any) => (
                                    <button
                                        key={comp.id}
                                        onClick={() => addComponentFromLibrary(comp)}
                                        className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{comp.thumbnail}</span>
                                            <div className="flex-1">
                                                <div className="text-white font-medium text-sm">{comp.name}</div>
                                                <div className="text-gray-400 text-xs">{comp.category}</div>
                                            </div>
                                            <Plus size={16} className="text-gray-400 group-hover:text-white" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Thème */}
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Palette size={20} />
                            Thème
                        </h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Couleur Principale</label>
                                <input
                                    type="color"
                                    value={theme.primaryColor}
                                    onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                                    className="w-full h-10 rounded-lg cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Police</label>
                                <select
                                    value={theme.fontFamily}
                                    onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
                                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="Inter">Inter</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Poppins">Poppins</option>
                                    <option value="Montserrat">Montserrat</option>
                                </select>
                            </div>
                        </div>

                        {/* Sections actuelles */}
                        <h3 className="text-white font-semibold mb-4">Sections ({sections.length})</h3>
                        <div className="space-y-2">
                            {sections.map((section: any) => (
                                <div key={section.id} className="p-3 bg-gray-700 rounded-lg flex items-center justify-between">
                                    <span className="text-white text-sm">{section.type}</span>
                                    <button
                                        onClick={() => {
                                            const newSections = sections.filter((s: any) => s.id !== section.id);
                                            setSections(newSections);
                                            saveHistory(newSections);
                                        }}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-gray-900 overflow-auto p-8">
                    <div
                        className="mx-auto bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
                        style={{ width: `${currentBreakpoint.width}px`, minHeight: '600px' }}
                    >
                        {sections.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">🎨</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Canvas Vide</h3>
                                <p className="text-gray-600">Utilisez la bibliothèque de composants pour commencer</p>
                            </div>
                        ) : (
                            sections.map((section: any) => (
                                <SectionPreview
                                    key={section.id}
                                    section={section}
                                    theme={theme}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* AI Chat Assistant */}
            {showAIChat && (
                <AIAssistant onClose={() => setShowAIChat(false)} />
            )}
        </div>
    );
}

function SectionPreview({ section, theme }: any) {
    const getAnimationClass = (animation: any) => {
        if (!animation?.entrance) return '';
        const animations: any = {
            'fade': 'animate-fade-in',
            'slide-up': 'animate-slide-up',
            'slide-down': 'animate-slide-down',
            'scale': 'animate-scale-in'
        };
        return animations[animation.entrance] || '';
    };

    const renderContent = () => {
        switch (section.type) {
            case 'hero':
                return (
                    <div
                        className={`relative h-96 flex items-center justify-center ${getAnimationClass(section.animations)}`}
                        style={{
                            background: section.content.backgroundImage
                                ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${section.content.backgroundImage})`
                                : theme.primaryColor,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="text-center text-white px-8 max-w-4xl">
                            <h1 className="text-5xl font-bold mb-4">{section.content.title}</h1>
                            <p className="text-xl mb-8 opacity-90">{section.content.subtitle}</p>
                            <button
                                className="bg-white px-8 py-3 rounded-lg font-semibold text-lg hover:shadow-lg transition-shadow"
                                style={{ color: theme.primaryColor }}
                            >
                                {section.content.cta}
                            </button>
                        </div>
                    </div>
                );

            case 'grid':
                return (
                    <div className="py-20 px-8">
                        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>
                            {section.content.title}
                        </h2>
                        <div className={`grid grid-cols-${section.content.columns} gap-8 max-w-6xl mx-auto`}>
                            {section.content.items.map((item: any, i: number) => (
                                <div key={i} className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                                    <div className="text-4xl mb-4">{item.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-gray-600">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'cta':
                return (
                    <div
                        className="py-20 px-8 text-center"
                        style={{ background: section.style?.background, color: section.style?.color }}
                    >
                        <h2 className="text-4xl font-bold mb-4">{section.content.title}</h2>
                        <p className="text-xl mb-8 opacity-90">{section.content.text}</p>
                        <button className="bg-white px-8 py-3 rounded-lg font-semibold text-lg hover:shadow-lg transition-shadow" style={{ color: theme.primaryColor }}>
                            {section.content.cta}
                        </button>
                    </div>
                );

            case 'gallery':
                return (
                    <div className="py-20 px-8">
                        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>
                            {section.content.title}
                        </h2>
                        <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto">
                            {section.content.images?.map((img: string, i: number) => (
                                <div key={i} className="aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'testimonials':
                return (
                    <div className="py-20 px-8 bg-gray-50">
                        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>
                            {section.content.title}
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {section.content.items?.map((item: any, i: number) => (
                                <div key={i} className="bg-white p-8 rounded-xl shadow-md">
                                    <p className="text-lg mb-4 italic">"{item.text}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                        <div>
                                            <div className="font-semibold">{item.author}</div>
                                            <div className="text-sm text-gray-500">{item.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="p-12 bg-gray-50">
                        <h2 className="text-3xl font-bold" style={{ color: theme.primaryColor }}>
                            {section.content?.title || section.type}
                        </h2>
                    </div>
                );
        }
    };

    return (
        <div className="w-full relative group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-lg rounded-lg p-2 z-10 flex gap-2">
                <button className="p-1 hover:text-blue-600"><Settings size={16} /></button>
            </div>
            {renderContent()}
        </div>
    );
}
