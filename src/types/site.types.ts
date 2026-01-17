import { SEOConfig } from './seo.types';
import { SiteTemplate, TemplateSection } from './template.types';

// Re-exporting SiteSection as it is used in components, aliasing TemplateSection for compatibility
export type SiteSection = TemplateSection & {
    order: number;
};

export interface Site {
    id: string;
    name: string;
    template: string; // keeping string ID for reference, or could be SiteTemplate object if full hydration needed
    templateConfig?: SiteTemplate; // Optional full template config
    subdomain?: string; // Added for compatibility with original code
    domain?: string;
    status: 'draft' | 'published' | 'archived';
    url?: string;
    sections: SiteSection[];
    seo?: SEOConfig;
    createdAt: Date;
    updatedAt: Date;
}
