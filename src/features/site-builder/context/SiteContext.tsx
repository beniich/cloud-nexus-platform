import React, { createContext, useContext, useState, useEffect } from 'react';
import { Site } from '../../types/site.types';

interface SiteContextType {
    sites: Site[];
    addSite: (templateId: string, name: string) => Promise<Site>;
    updateSite: (siteId: string, updates: Partial<Site>) => void;
    deleteSite: (siteId: string) => void;
    publishSite: (siteId: string) => Promise<void>;
    getSite: (siteId: string) => Site | undefined;
    addGeneratedSite: (siteData: any) => Site;
    reorderSections: (siteId: string, sections: any[]) => void;
    addSection: (siteId: string, sectionType: string, content: any) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sites, setSites] = useState<Site[]>(() => {
        const saved = localStorage.getItem('sites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('sites', JSON.stringify(sites));
    }, [sites]);

    const addSite = async (templateId: string, name: string) => {
        const newSite: Site = {
            id: crypto.randomUUID(),
            name,
            template: templateId, // Using templateId as template name for now or map it
            thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=800',
            status: 'draft',
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            sections: [], // Would initialize with template sections
            theme: {
                colors: { primary: '#3b82f6', secondary: '#64748b', background: '#ffffff', text: '#0f172a' },
                fonts: { heading: 'Inter', body: 'Inter' }
            },
            seo: {
                title: name,
                description: `Website for ${name}`,
                keywords: [],
                robotsMeta: { index: true, follow: true }
            },
            settings: {
                language: 'en',
                timezone: 'UTC'
            }
        };
        setSites(prev => [newSite, ...prev]);
        return newSite;
    };

    const updateSite = (siteId: string, updates: Partial<Site>) => {
        setSites(prev => prev.map(site =>
            site.id === siteId
                ? { ...site, ...updates, updatedAt: new Date().toISOString() }
                : site
        ));
    };

    const deleteSite = (siteId: string) => {
        setSites(prev => prev.filter(site => site.id !== siteId));
    };

    const publishSite = async (siteId: string) => {
        updateSite(siteId, { status: 'published', url: `https://site-${siteId.slice(0, 8)}.lovable.app` });
    };

    const reorderSections = (siteId: string, sections: any[]) => {
        updateSite(siteId, { sections });
    };

    const addSection = (siteId: string, sectionType: string, content: any) => {
        const site = getSite(siteId);
        if (!site) return;

        const newSection = {
            id: `section-${Date.now()}`,
            type: sectionType,
            title: sectionType,
            order: site.sections.length,
            props: {},
            content
        };
        // Ensure newSection matches SiteSection type roughly
        updateSite(siteId, { sections: [...site.sections, newSection] as any[] });
    };

    const getSite = (siteId: string) => sites.find(s => s.id === siteId);

    const addGeneratedSite = (siteData: any) => {
        const newSite: Site = {
            id: crypto.randomUUID(),
            name: siteData.siteName,
            template: siteData.template.id,
            thumbnail: siteData.template.preview?.thumbnail || '/templates/business.jpg', // Fallback
            status: 'draft',
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            sections: siteData.sections.map((s: any) => ({
                id: `section-${Date.now()}-${s.order}`,
                type: s.type,
                title: s.type, // or s.content.heading
                order: s.order,
                props: {},
                content: s.content
            })),
            theme: siteData.theme,
            seo: {
                title: siteData.seo.title || siteData.siteName,
                description: siteData.seo.description || '',
                keywords: siteData.seo.keywords || [],
                robotsMeta: siteData.seo.robotsMeta || { index: true, follow: true },
                ...siteData.seo
            },
            settings: {
                language: 'en',
                timezone: 'UTC'
            }
        };
        setSites(prev => [newSite, ...prev]);
        return newSite;
    };

    return (
        <SiteContext.Provider value={{ sites, addSite, updateSite, deleteSite, publishSite, getSite, addGeneratedSite, reorderSections, addSection }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSites = () => {
    const context = useContext(SiteContext);
    if (!context) throw new Error('useSites must be used within a SiteProvider');
    return context;
};
