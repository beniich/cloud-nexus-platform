export type TemplateCategory = 'business' | 'portfolio' | 'blog' | 'ecommerce' | 'landing';

export type SectionType =
    | 'hero'
    | 'about'
    | 'features'
    | 'services'
    | 'testimonials'
    | 'team'
    | 'gallery'
    | 'pricing'
    | 'faq'
    | 'contact'
    | 'footer'
    | 'blog-grid'
    | 'product-grid'
    | 'newsletter'
    | 'form';

export interface ColorTheme {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textLight: string;
    border: string;
}

export interface FontTheme {
    heading: string;
    body: string;
    sizes: {
        h1: string;
        h2: string;
        h3: string;
        body: string;
        small: string;
    };
}

export interface TemplateSection {
    id: string;
    type: SectionType;
    title: string;
    order: number;
    props: Record<string, any>;
    content: {
        heading?: string;
        subheading?: string;
        text?: string;
        items?: any[];
        image?: string;
        cta?: {
            text: string;
            link: string;
            style: 'primary' | 'secondary' | 'outline';
        };
        form?: any; // Using any to avoid circular dependency with forms.types.ts
    };
}

export interface SiteTemplate {
    id: string;
    name: string;
    description: string;
    category: TemplateCategory;
    thumbnail: string;
    previewUrl?: string;
    sections: TemplateSection[];
    colors: ColorTheme;
    fonts: FontTheme;
    metadata: {
        author: string;
        created: string;
        updated: string;
        version: string;
        tags: string[];
    };
}

export interface TemplatePreview {
    id: string;
    name: string;
    category: TemplateCategory;
    thumbnail: string;
    description: string;
    isPremium: boolean;
}

export interface TemplateFilter {
    category?: TemplateCategory;
    tags?: string[];
    search?: string;
    isPremium?: boolean;
}
