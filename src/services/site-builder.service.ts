import { Site, SiteTemplate } from '@/types/site-builder';

// Mock Data
const MOCK_SITES: Site[] = [
    {
        id: 'site-1',
        userId: 'user-1',
        name: 'Mon Restaurant',
        subdomain: 'le-gourmet',
        templateId: 'restaurant-v1',
        status: 'published',
        publishedUrl: 'https://le-gourmet.cloudnexus.io',
        thumbnailUrl: 'https://placehold.co/600x400/orange/white?text=Resto',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: {
            primaryColor: '#ff6b6b',
            fontFamily: 'Inter',
            backgroundColor: '#ffffff'
        },
        sections: []
    },
    {
        id: 'site-2',
        userId: 'user-1',
        name: 'Portfolio Design',
        subdomain: 'nina-design',
        templateId: 'portfolio-v1',
        status: 'draft',
        thumbnailUrl: 'https://placehold.co/600x400/purple/white?text=Portfolio',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        theme: {
            primaryColor: '#6b37ff',
            fontFamily: 'Outfit',
            backgroundColor: '#f8f9fa'
        },
        sections: []
    }
];

export const SiteBuilderAPI = {
    async getSites(): Promise<Site[]> {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simule latence
        return JSON.parse(localStorage.getItem('user_sites') || JSON.stringify(MOCK_SITES));
    },

    async createSite(name: string, templateId: string): Promise<Site> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newSite: Site = {
            id: `site-${Date.now()}`,
            userId: 'user-1',
            name,
            subdomain: name.toLowerCase().replace(/\s+/g, '-'),
            templateId,
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            theme: {
                primaryColor: '#000000',
                fontFamily: 'Inter',
                backgroundColor: '#ffffff'
            },
            sections: [], // À remplir selon le template
            thumbnailUrl: 'https://placehold.co/600x400/gray/white?text=New+Site'
        };

        const sites = await this.getSites();
        localStorage.setItem('user_sites', JSON.stringify([...sites, newSite]));

        return newSite;
    },

    async deleteSite(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const sites = await this.getSites();
        const filtered = sites.filter(s => s.id !== id);
        localStorage.setItem('user_sites', JSON.stringify(filtered));
    }
};
