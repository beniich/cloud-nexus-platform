// Site section can be any JSON-serializable object structure
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SiteSection = Record<string, any>;

export interface Site {
    id: string;
    name: string;
    domain?: string;
    customDomain?: string;
    sections: SiteSection[];
    theme: {
        colors: Record<string, string>;
        fonts: Record<string, string>;
    };
    seo: SEOConfig;
    settings: SiteSettings;
}

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

export interface SiteSettings {
    favicon?: string;
    analyticsId?: string;
    gtmId?: string;
    language: string;
    timezone: string;
    customCss?: string;
    customJs?: string;
}

export interface BuildResult {
    success: boolean;
    outputPath: string;
    files: BuildFile[];
    assets: OptimizedAssets;
    errors: BuildError[];
    warnings: string[];
    buildTime: number;
    size: {
        html: number;
        css: number;
        js: number;
        images: number;
        total: number;
    };
}

export interface BuildFile {
    path: string;
    content: string;
    size: number;
    hash: string;
}

export interface OptimizedAssets {
    images: OptimizedImage[];
    css: {
        inline: string;
        external: string[];
        minified: boolean;
    };
    js: {
        inline: string;
        external: string[];
        minified: boolean;
    };
}

export interface OptimizedImage {
    original: string;
    optimized: string;
    formats: {
        webp?: string;
        avif?: string;
    };
    sizes: {
        width: number;
        height: number;
    };
    alt: string;
}

export interface BuildError {
    type: 'fatal' | 'error' | 'warning';
    message: string;
    file?: string;
    line?: number;
    column?: number;
}

export interface BuildConfig {
    minify: boolean;
    optimizeImages: boolean;
    inlineCSS: boolean;
    generateSourceMaps: boolean;
    target: 'production' | 'development';
}
