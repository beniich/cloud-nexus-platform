export interface SEOConfig {
    title: string;
    description: string;
    keywords: string[];
    focusKeyword?: string;
    ogImage?: string;
    twitterCard?: 'summary' | 'summary_large_image';
    canonicalUrl?: string;
    robotsMeta: {
        index: boolean;
        follow: boolean;
    };
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
