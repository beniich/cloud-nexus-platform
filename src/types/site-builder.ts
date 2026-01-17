export interface SiteSection {
    id: string;
    type: 'hero' | 'about' | 'services' | 'gallery' | 'contact';
    order: number;
    content: {
        title?: string;
        subtitle?: string;
        description?: string;
        buttonText?: string;
        items?: Array<{ id: string; title: string; description: string; }>;
        images?: string[];
    };
}

export interface Site {
    id: string;
    name: string;
    template: string;
    status: 'draft' | 'published';
    url?: string;
    sections: SiteSection[];
    createdAt: Date;
    updatedAt: Date;
}
