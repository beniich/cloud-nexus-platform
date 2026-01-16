export type SiteStatus = 'draft' | 'published' | 'archived';

export interface SiteSection {
    id: string;
    type: 'hero' | 'features' | 'about' | 'contact' | 'footer';
    content: Record<string, any>;
    style?: Record<string, any>;
}

export interface SiteTheme {
    primaryColor: string;
    fontFamily: string;
    backgroundColor: string;
}

export interface Site {
    id: string;
    userId: string;
    name: string;
    subdomain: string;
    templateId: string;
    sections: SiteSection[];
    theme: SiteTheme;
    status: SiteStatus;
    thumbnailUrl?: string;
    publishedUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SiteTemplate {
    id: string;
    name: string;
    description: string;
    thumbnailUrl: string;
    defaultSections: SiteSection[];
    defaultTheme: SiteTheme;
}
