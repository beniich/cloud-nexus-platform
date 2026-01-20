// @ts-nocheck
import React, { useState, useCallback, useRef } from 'react';
import { Trash2, Settings, Plus, Save, Smartphone, Monitor, Globe, ArrowLeft, Palette, ChevronDown, Undo2, Redo2, Code, Download, GripVertical, Copy, Image as ImageIcon, Grid3x3, Sparkles, MessageSquare, Send, X, Columns, Layout, Zap, Eye, Upload } from 'lucide-react';

// Données utilisateur
const USER_DATA = {
    plan: 'pro',
    sitesCreated: 2,
    limits: { basic: 1, pro: 5, enterprise: Infinity }
};

// Bibliothèque de composants réutilisables
const COMPONENT_LIBRARY = [
    {
        id: 'hero-gradient',
        name: 'Hero Gradient',
        category: 'hero',
        thumbnail: '🌅',
        component: {
            type: 'hero',
            content: { title: 'Titre Accrocheur', subtitle: 'Sous-titre percutant', cta: 'Commencer' },
            style: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '500px' }
        }
    },
    {
        id: 'hero-image',
        name: 'Hero Image',
        category: 'hero',
        thumbnail: '🖼️',
        component: {
            type: 'hero',
            content: { title: 'Votre Titre', subtitle: 'Description', cta: 'En savoir plus', backgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926' },
            style: { minHeight: '600px', backgroundSize: 'cover' }
        }
    },
    {
        id: 'features-3col',
        name: 'Features 3 Colonnes',
        category: 'features',
        thumbnail: '📋',
        component: {
            type: 'grid',
            content: {
                title: 'Nos Services',
                columns: 3,
                items: [
                    { icon: '⚡', title: 'Rapide', text: 'Performance optimale' },
                    { icon: '🎨', title: 'Design', text: 'Interface moderne' },
                    { icon: '🔒', title: 'Sécurisé', text: 'Protection totale' }
                ]
            }
        }
    },
    {
        id: 'cta-centered',
        name: 'CTA Centré',
        category: 'cta',
        thumbnail: '🎯',
        component: {
            type: 'cta',
            content: { title: 'Prêt à commencer ?', text: 'Rejoignez des milliers d\'utilisateurs', cta: 'S\'inscrire gratuitement' },
            style: { background: '#3b82f6', color: 'white', padding: '80px 20px' }
        }
    },
    {
        id: 'gallery-masonry',
        name: 'Galerie Masonry',
        category: 'gallery',
        thumbnail: '🖼️',
        component: {
            type: 'gallery',
            content: {
                title: 'Portfolio',
                layout: 'masonry',
                images: [
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
                    'https://images.unsplash.com/photo-1557683316-973673baf926',
                    'https://images.unsplash.com/photo-1559827260-dc66d52bef19'
                ]
            }
        }
    },
    {
        id: 'testimonials-slider',
        name: 'Témoignages',
        category: 'social-proof',
        thumbnail: '💬',
        component: {
            type: 'testimonials',
            content: {
                title: 'Ce qu\'ils disent',
                items: [
                    { text: 'Excellent produit !', author: 'Marie D.', role: 'CEO' },
                    { text: 'Service impeccable', author: 'Thomas L.', role: 'Designer' }
                ]
            }
        }
    }
];

// Templates
const TEMPLATES = [
    {
        id: 'restaurant',
        name: 'Restaurant',
        description: 'Parfait pour restaurants et cafés',
        thumbnail: '🍽️',
        sections: [
            { type: 'hero', id: 'hero-1', content: { title: 'Restaurant Le Gourmet', subtitle: 'Une expérience culinaire unique', cta: 'Réserver' }, animations: { entrance: 'fade', duration: 800 } },
            { type: 'about', id: 'about-1', content: { title: 'Notre Histoire', text: 'Depuis 1990, nous créons des expériences gastronomiques inoubliables.' }, animations: { entrance: 'slide-up', duration: 600 } }
        ]
    },
    {
        id: 'portfolio',
        name: 'Portfolio',
        description: 'Pour designers et développeurs',
        thumbnail: '💼',
        sections: [
            { type: 'hero', id: 'hero-1', content: { title: 'Nina Design', subtitle: 'Designer UI/UX basée à Paris', cta: 'Voir mon travail' } }
        ]
    }
];

// Breakpoints personnalisables
const DEFAULT_BREAKPOINTS = [
    { id: 'mobile', name: 'Mobile', width: 375, icon: Smartphone },
    { id: 'tablet', name: 'Tablet', width: 768, icon: Layout },
    { id: 'ipad-pro', name: 'iPad Pro', width: 1024, icon: Monitor },
    { id: 'desktop', name: 'Desktop', width: 1440, icon: Monitor },
    { id: 'large', name: 'Large', width: 1920, icon: Monitor }
];

export default function CloudNexusSiteBuilder() {
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
    const [currentSite, setCurrentSite] = useState(null);

    const handleCreateSite = () => {
        if (USER_DATA.sitesCreated >= USER_DATA.limits[USER_DATA.plan]) {
            alert('⚠️ Quota atteint! Passez à un plan supérieur.');
            return;
        }
        setView('create');
    };

    const handleSelectTemplate = (template) => {
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

    const handleEditSite = (site) => {
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
            onSave={(updatedSite) => {
                setSites(sites.map(s => s.id === updatedSite.id ? updatedSite : s));
                setCurrentSite(updatedSite);
            }}
        />;
    }

    return null;
}

function Dashboard({ sites, onCreateSite, onEditSite, userPlan }) {
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

function TemplateSelector({ templates, onSelect, onBack }) {
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
                    {templates.map(template => (
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

function SiteEditor({ site, onBack, onSave }) {
    const [previewMode, setPreviewMode] = useState('desktop');
    const [sections, setSections] = useState(site.sections || []);
    const [theme, setTheme] = useState(site.theme || { primaryColor: '#3b82f6', fontFamily: 'Inter', spacing: 'normal' });
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [showComponentLibrary, setShowComponentLibrary] = useState(false);
    const [showHistoryTimeline, setShowHistoryTimeline] = useState(false);
    const [customBreakpoints] = useState(DEFAULT_BREAKPOINTS);
    const [history, setHistory] = useState([{
        sections: site.sections || [],
        timestamp: Date.now(),
        preview: {
            sectionCount: (site.sections || []).length,
            types: (site.sections || []).map(s => s.type),
            firstSection: (site.sections || [])[0]?.content?.title || 'Sans titre'
        }
    }]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const selectedSection = sections.find(s => s.id === selectedSectionId);

    const generatePreviewSnapshot = (secs) => {
        return {
            sectionCount: secs.length,
            types: secs.map(s => s.type),
            firstSection: secs[0]?.content?.title || 'Sans titre'
        };
    };

    const saveHistory = (newSections) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({
            sections: newSections,
            timestamp: Date.now(),
            preview: generatePreviewSnapshot(newSections)
        });
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setSections(history[historyIndex - 1].sections || history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setSections(history[historyIndex + 1].sections || history[historyIndex + 1]);
        }
    };

    const jumpToHistoryPoint = (index) => {
        setHistoryIndex(index);
        setSections(history[index].sections || history[index]);
        setShowHistoryTimeline(false);
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Version initiale';
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);

        if (minutes < 1) return 'À l\'instant';
        if (minutes < 60) return `Il y a ${minutes} min`;
        if (hours < 24) return `Il y a ${hours}h`;
        return new Date(timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const addComponentFromLibrary = (component) => {
        const newSection = {
            ...component.component,
            id: `${component.id}-${Date.now()}`,
            animations: { entrance: 'fade', duration: 600 },
            spacing: { paddingTop: 80, paddingBottom: 80 }
        };
        const newSections = [...sections, newSection];
        setSections(newSections);
        saveHistory(newSections);
        setShowComponentLibrary(false);
        setSelectedSectionId(newSection.id);
    };

    const updateSectionProperty = (property, value) => {
        if (!selectedSectionId) return;

        const newSections = sections.map(section => {
            if (section.id === selectedSectionId) {
                const keys = property.split('.');
                const updatedSection = { ...section };
                let current = updatedSection;

                for (let i = 0; i < keys.length - 1; i++) {
                    if (!current[keys[i]]) current[keys[i]] = {};
                    current[keys[i]] = { ...current[keys[i]] };
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = value;

                return updatedSection;
            }
            return section;
        });
        setSections(newSections);
        saveHistory(newSections);
    };

    const deleteSection = (sectionId) => {
        const newSections = sections.filter(s => s.id !== sectionId);
        setSections(newSections);
        saveHistory(newSections);
        setSelectedSectionId(null);
    };

    const exportHTML = () => {
        const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${site.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: ${theme.fontFamily}, sans-serif; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .hero { min-height: 500px; display: flex; align-items: center; justify-content: center; background: ${theme.primaryColor}; color: white; text-align: center; }
    .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
    .hero p { font-size: 1.25rem; margin-bottom: 2rem; }
    .btn { background: white; color: ${theme.primaryColor}; padding: 1rem 2rem; border: none; border-radius: 8px; font-size: 1.125rem; cursor: pointer; font-weight: 600; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; padding: 4rem 0; }
    .card { padding: 2rem; background: #f9fafb; border-radius: 12px; }
    .card h3 { font-size: 1.5rem; margin: 1rem 0; color: ${theme.primaryColor}; }
    @media (max-width: 768px) {
      .hero h1 { font-size: 2rem; }
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
${sections.map(section => {
            if (section.type === 'hero') {
                return `  <section class="hero">
    <div class="container">
      <h1>${section.content.title}</h1>
      <p>${section.content.subtitle}</p>
      <button class="btn">${section.content.cta}</button>
    </div>
  </section>`;
            }
            if (section.type === 'grid') {
                return `  <section class="container">
    <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: ${theme.primaryColor};">${section.content.title}</h2>
    <div class="grid">
${section.content.items.map(item => `      <div class="card">
        <div style="font-size: 3rem;">${item.icon}</div>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </div>`).join('\n')}
    </div>
  </section>`;
            }
            return '';
        }).join('\n')}
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${site.subdomain}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const currentBreakpoint = customBreakpoints.find(bp => bp.id === previewMode) || customBreakpoints[3];

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
                    {/* Undo/Redo with History */}
                    <div className="flex bg-gray-700 rounded-lg relative">
                        <button
                            onClick={undo}
                            disabled={historyIndex === 0}
                            className={`p-2 ${historyIndex === 0 ? 'text-gray-500' : 'text-gray-300 hover:text-white'}`}
                            title="Annuler (Ctrl+Z)"
                        >
                            <Undo2 size={18} />
                        </button>
                        <button
                            onClick={redo}
                            disabled={historyIndex === history.length - 1}
                            className={`p-2 ${historyIndex === history.length - 1 ? 'text-gray-500' : 'text-gray-300 hover:text-white'}`}
                            title="Refaire (Ctrl+Y)"
                        >
                            <Redo2 size={18} />
                        </button>
                        <div className="w-px bg-gray-600"></div>
                        <button
                            onClick={() => setShowHistoryTimeline(!showHistoryTimeline)}
                            className={`p-2 relative ${showHistoryTimeline ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
                            title="Historique visuel"
                        >
                            <Eye size={18} />
                            {history.length > 1 && (
                                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {history.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Preview modes */}
                    <div className="flex bg-gray-700 rounded-lg p-1">
                        {customBreakpoints.slice(0, 4).map(bp => {
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
                        onClick={exportHTML}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                    >
                        <Download size={18} />
                        Export HTML
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
                {/* Timeline Historique */}
                {showHistoryTimeline && (
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6 w-[900px] max-h-[600px] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-white text-xl font-bold flex items-center gap-2">
                                    <Eye size={24} />
                                    Historique de Versions
                                </h3>
                                <p className="text-gray-400 text-sm mt-1">{history.length} versions • Position actuelle : {historyIndex + 1}</p>
                            </div>
                            <button
                                onClick={() => setShowHistoryTimeline(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Timeline visuelle */}
                        <div className="space-y-3">
                            {history.map((point, index) => {
                                const isCurrentVersion = index === historyIndex;
                                const isFutureVersion = index > historyIndex;
                                const snapshot = point.preview || point;
                                const versionSections = point.sections || point;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => jumpToHistoryPoint(index)}
                                        className={`relative cursor-pointer transition-all ${isCurrentVersion
                                                ? 'bg-blue-900 border-2 border-blue-500 shadow-lg scale-[1.02]'
                                                : isFutureVersion
                                                    ? 'bg-gray-700 border border-gray-600 opacity-50 hover:opacity-70'
                                                    : 'bg-gray-700 border border-gray-600 hover:bg-gray-650 hover:border-gray-500'
                                            } rounded-xl p-4`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Version indicator */}
                                            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isCurrentVersion
                                                    ? 'bg-blue-600 text-white ring-4 ring-blue-400/30'
                                                    : isFutureVersion
                                                        ? 'bg-gray-600 text-gray-400'
                                                        : 'bg-gray-600 text-gray-300'
                                                }`}>
                                                {index + 1}
                                            </div>

                                            {/* Preview miniature */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className={`font-semibold ${isCurrentVersion ? 'text-white' : 'text-gray-300'}`}>
                                                                {isCurrentVersion ? '🔵 Version actuelle' : isFutureVersion ? '⏭️ Version future' : `Version ${index + 1}`}
                                                            </h4>
                                                            {isCurrentVersion && (
                                                                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-medium">
                                                                    ACTUELLE
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-400 text-sm mt-1">
                                                            {formatTimestamp(point.timestamp)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-gray-400 text-xs">
                                                            {Array.isArray(versionSections) ? versionSections.length : 0} sections
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Mini preview des sections */}
                                                <div className="bg-gray-900 rounded-lg p-3 space-y-1.5">
                                                    {(Array.isArray(versionSections) ? versionSections : []).slice(0, 3).map((section, sIdx) => {
                                                        const sectionEmoji = section.type === 'hero' ? '🎯' :
                                                            section.type === 'grid' ? '📊' :
                                                                section.type === 'cta' ? '🚀' :
                                                                    section.type === 'gallery' ? '🖼️' :
                                                                        section.type === 'testimonials' ? '💬' : '📄';

                                                        return (
                                                            <div key={sIdx} className="flex items-center gap-2 text-xs">
                                                                <span className="text-lg">{sectionEmoji}</span>
                                                                <span className="text-gray-400">{section.type}</span>
                                                                <span className="text-gray-500">•</span>
                                                                <span className="text-gray-400 truncate flex-1">
                                                                    {section.content?.title || section.content?.text || 'Sans titre'}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                    {Array.isArray(versionSections) && versionSections.length > 3 && (
                                                        <div className="text-gray-500 text-xs">
                                                            +{versionSections.length - 3} autres sections...
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                {!isCurrentVersion && (
                                                    <div className="mt-3 flex gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                jumpToHistoryPoint(index);
                                                            }}
                                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg font-medium transition-colors"
                                                        >
                                                            ↩️ Restaurer cette version
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Connection line */}
                                        {index < history.length - 1 && (
                                            <div className="absolute left-6 top-full w-0.5 h-3 bg-gray-600"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer stats */}
                        <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between text-sm">
                            <div className="text-gray-400">
                                💾 Toutes vos modifications sont sauvegardées automatiquement
                            </div>
                            <div className="text-gray-400">
                                ⌨️ Raccourcis : Ctrl+Z (Annuler) • Ctrl+Y (Refaire)
                            </div>
                        </div>
                    </div>
                )}

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
                                {COMPONENT_LIBRARY.map(comp => (
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

                        {/* Section properties */}
                        {selectedSection && (
                            <div className="border-t border-gray-700 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white font-semibold">Propriétés</h3>
                                    <button
                                        onClick={() => deleteSection(selectedSectionId)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {selectedSection.type === 'hero' && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-gray-300 text-sm mb-1 block">Titre</label>
                                            <input
                                                type="text"
                                                value={selectedSection.content.title}
                                                onChange={(e) => updateSectionProperty('content.title', e.target.value)}
                                                className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-gray-300 text-sm mb-1 block">Sous-titre</label>
                                            <input
                                                type="text"
                                                value={selectedSection.content.subtitle}
                                                onChange={(e) => updateSectionProperty('content.subtitle', e.target.value)}
                                                className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-gray-300 text-sm mb-1 block">CTA</label>
                                            <input
                                                type="text"
                                                value={selectedSection.content.cta}
                                                onChange={(e) => updateSectionProperty('content.cta', e.target.value)}
                                                className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-gray-900 overflow-y-auto p-8 flex justify-center">
                    <div
                        className="bg-white shadow-2xl transition-all duration-300 overflow-hidden"
                        style={{ width: `${currentBreakpoint.width}px`, minHeight: '100%' }}
                    >
                        {sections.map((section, index) => (
                            <div
                                key={section.id}
                                onClick={() => setSelectedSectionId(section.id)}
                                className={`cursor-pointer transition-all ${selectedSectionId === section.id ? 'ring-4 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'
                                    }`}
                            >
                                {section.type === 'hero' && (
                                    <div
                                        className="min-h-[500px] flex items-center justify-center text-white text-center"
                                        style={{
                                            background: section.style?.background || theme.primaryColor,
                                            ...section.style
                                        }}
                                    >
                                        <div className="px-6">
                                            <h1 className="text-5xl font-bold mb-4">{section.content.title}</h1>
                                            <p className="text-xl mb-6">{section.content.subtitle}</p>
                                            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold">
                                                {section.content.cta}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {section.type === 'grid' && (
                                    <div className="py-20 px-6">
                                        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>
                                            {section.content.title}
                                        </h2>
                                        <div
                                            className="grid gap-8 max-w-6xl mx-auto"
                                            style={{ gridTemplateColumns: `repeat(${section.content.columns}, 1fr)` }}
                                        >
                                            {section.content.items.map((item, idx) => (
                                                <div key={idx} className="bg-gray-50 p-6 rounded-xl">
                                                    <div className="text-5xl mb-4">{item.icon}</div>
                                                    <h3 className="text-2xl font-bold mb-2" style={{ color: theme.primaryColor }}>
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-gray-600">{item.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {section.type === 'cta' && (
                                    <div
                                        className="py-20 px-6 text-center"
                                        style={{ ...section.style }}
                                    >
                                        <h2 className="text-4xl font-bold mb-4">{section.content.title}</h2>
                                        <p className="text-xl mb-6">{section.content.text}</p>
                                        <button className="bg-white px-8 py-3 rounded-lg font-semibold" style={{ color: section.style?.background }}>
                                            {section.content.cta}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
