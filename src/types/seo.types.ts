export interface SEOConfig {
    metaTitle: string;
    metaDescription: string;
    keywords?: string;
    ogImage?: string;
    twitterCard?: 'summary' | 'summary_large_image';
    canonicalUrl?: string;
    noIndex?: boolean;
    noFollow?: boolean;
}

export interface SEOScore {
    overall: number;
    checks: SEOCheck[];
}

export interface SEOCheck {
    name: string;
    passed: boolean;
    score: number;
    message: string;
    priority: 'high' | 'medium' | 'low';
}
