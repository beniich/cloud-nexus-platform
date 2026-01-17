import React, { useState } from 'react';
import { SiteProvider, useSites } from './context/SiteContext';
import { DashboardView } from './components/DashboardView';
import { TemplateSelector } from './components/TemplateSelector';
import { Editor } from './components/Editor';
import { Site } from '../../types/site.types';

import { SitesInsights } from './components/SitesInsights';

import { AIGeneratorModal } from './components/AIGeneratorModal';

const SiteBuilderApp: React.FC = () => {
    const [view, setView] = useState<'dashboard' | 'templates' | 'editor' | 'insights' | 'ai-generator'>('dashboard');
    const [editingSite, setEditingSite] = useState<Site | null>(null);
    const { addSite, addGeneratedSite } = useSites();

    const handleCreateSite = () => {
        setView('templates');
    };

    const handleSelectTemplate = (template: string, siteName: string) => {
        addSite(template, siteName);
        setView('dashboard');
    };

    const handleEditSite = (site: Site) => {
        setEditingSite(site);
        setView('editor');
    };

    const handleViewInsights = (site: Site) => {
        setEditingSite(site);
        setView('insights');
    };

    const handleBackToDashboard = () => {
        setView('dashboard');
        setEditingSite(null);
    };

    return (
        <>
            {view === 'dashboard' && (
                <DashboardView
                    onCreateSite={handleCreateSite}
                    onEditSite={handleEditSite}
                    onViewInsights={handleViewInsights}
                    onCreateWithAI={() => setView('ai-generator')}
                />
            )}
            {view === 'templates' && (
                <TemplateSelector onSelect={handleSelectTemplate} onBack={handleBackToDashboard} />
            )}
            {view === 'editor' && editingSite && (
                <Editor site={editingSite} onBack={handleBackToDashboard} />
            )}
            {view === 'insights' && editingSite && (
                <SitesInsights site={editingSite} onBack={handleBackToDashboard} />
            )}

            <AIGeneratorModal
                isOpen={view === 'ai-generator'}
                onClose={() => setView('dashboard')}
                onGenerate={(siteData) => {
                    addGeneratedSite(siteData);
                    setView('dashboard');
                }}
            />
        </>
    );
};

export default function SiteBuilder() {
    return (
        <SiteProvider>
            <SiteBuilderApp />
        </SiteProvider>
    );
}
