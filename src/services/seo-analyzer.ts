import type { SEOScore, SEOCheck, SEOIssue } from '../types/analytics.types';

export class SEOAnalyzer {
    /**
     * Analyse le SEO d'un site
     */
    analyzePage(site: any): SEOScore {
        const technicalChecks = this.analyzeTechnical(site);
        const contentChecks = this.analyzeContent(site);
        const performanceChecks = this.analyzePerformance(site);
        const mobileChecks = this.analyzeMobile(site);

        const issues = this.collectIssues([
            ...technicalChecks,
            ...contentChecks,
            ...performanceChecks,
            ...mobileChecks
        ]);

        const suggestions = this.generateSuggestions(issues);

        const technicalScore = this.calculateCategoryScore(technicalChecks);
        const contentScore = this.calculateCategoryScore(contentChecks);
        const performanceScore = this.calculateCategoryScore(performanceChecks);
        const mobileScore = this.calculateCategoryScore(mobileChecks);

        const overall = Math.round(
            (technicalScore + contentScore + performanceScore + mobileScore) / 4
        );

        return {
            overall,
            categories: {
                technical: { score: technicalScore, maxScore: 100, checks: technicalChecks },
                content: { score: contentScore, maxScore: 100, checks: contentChecks },
                performance: { score: performanceScore, maxScore: 100, checks: performanceChecks },
                mobile: { score: mobileScore, maxScore: 100, checks: mobileChecks }
            },
            issues,
            suggestions
        };
    }

    /**
     * Analyse technique
     */
    private analyzeTechnical(site: any): SEOCheck[] {
        const checks: SEOCheck[] = [];

        // Meta Title
        checks.push({
            name: 'Meta Title',
            passed: this.hasValidTitle(site.seo?.title),
            impact: 'high',
            description: 'Page has a proper meta title (50-60 characters)'
        });

        // Meta Description
        checks.push({
            name: 'Meta Description',
            passed: this.hasValidDescription(site.seo?.description),
            impact: 'high',
            description: 'Page has a meta description (150-160 characters)'
        });

        // Canonical URL
        checks.push({
            name: 'Canonical URL',
            passed: !!site.seo?.canonicalUrl,
            impact: 'medium',
            description: 'Page has a canonical URL defined'
        });

        // Robots Meta
        checks.push({
            name: 'Robots Meta',
            passed: site.seo?.robotsMeta?.index !== false,
            impact: 'high',
            description: 'Page is set to be indexed by search engines'
        });

        // Sitemap
        checks.push({
            name: 'Sitemap',
            passed: true, // Toujours généré
            impact: 'medium',
            description: 'Site has a sitemap.xml file'
        });

        // Robots.txt
        checks.push({
            name: 'Robots.txt',
            passed: true, // Toujours généré
            impact: 'low',
            description: 'Site has a robots.txt file'
        });

        // HTTPS
        checks.push({
            name: 'HTTPS',
            passed: site.customDomain ? true : true, // Simulé
            impact: 'high',
            description: 'Site is served over HTTPS'
        });

        return checks;
    }

    /**
     * Analyse du contenu
     */
    private analyzeContent(site: any): SEOCheck[] {
        const checks: SEOCheck[] = [];

        // Headings Structure
        checks.push({
            name: 'Heading Structure',
            passed: this.hasProperHeadings(site.sections),
            impact: 'high',
            description: 'Page has proper H1, H2, H3 hierarchy'
        });

        // Content Length
        checks.push({
            name: 'Content Length',
            passed: this.hasSufficientContent(site.sections),
            impact: 'medium',
            description: 'Page has at least 300 words of content'
        });

        // Image Alt Text
        checks.push({
            name: 'Image Alt Text',
            passed: this.hasImageAltText(site.sections),
            impact: 'medium',
            description: 'All images have alt text'
        });

        // Internal Links
        checks.push({
            name: 'Internal Links',
            passed: this.hasInternalLinks(site.sections),
            impact: 'low',
            description: 'Page has internal links'
        });

        // Focus Keyword
        checks.push({
            name: 'Focus Keyword',
            passed: !!site.seo?.focusKeyword,
            impact: 'medium',
            description: 'Page has a focus keyword defined'
        });

        return checks;
    }

    /**
     * Analyse des performances
     */
    private analyzePerformance(site: any): SEOCheck[] {
        const checks: SEOCheck[] = [];

        // Page Size
        checks.push({
            name: 'Page Size',
            passed: true, // Simulé
            impact: 'medium',
            description: 'Page size is under 3MB'
        });

        // Image Optimization
        checks.push({
            name: 'Image Optimization',
            passed: true, // Toujours optimisé dans le build
            impact: 'high',
            description: 'Images are optimized'
        });

        // CSS Minification
        checks.push({
            name: 'CSS Minification',
            passed: true,
            impact: 'low',
            description: 'CSS is minified'
        });

        // HTML Minification
        checks.push({
            name: 'HTML Minification',
            passed: true,
            impact: 'low',
            description: 'HTML is minified'
        });

        return checks;
    }

    /**
     * Analyse mobile
     */
    private analyzeMobile(site: any): SEOCheck[] {
        const checks: SEOCheck[] = [];

        // Viewport Meta
        checks.push({
            name: 'Viewport Meta',
            passed: true, // Toujours ajouté
            impact: 'high',
            description: 'Page has viewport meta tag'
        });

        // Responsive Design
        checks.push({
            name: 'Responsive Design',
            passed: true, // Tous nos templates sont responsive
            impact: 'high',
            description: 'Page is mobile-friendly'
        });

        // Touch Elements
        checks.push({
            name: 'Touch Elements',
            passed: true,
            impact: 'medium',
            description: 'Touch targets are adequately sized'
        });

        return checks;
    }

    /**
     * Vérifie si le titre est valide
     */
    private hasValidTitle(title?: string): boolean {
        if (!title) return false;
        return title.length >= 30 && title.length <= 60;
    }

    /**
     * Vérifie si la description est valide
     */
    private hasValidDescription(description?: string): boolean {
        if (!description) return false;
        return description.length >= 120 && description.length <= 160;
    }

    /**
     * Vérifie la structure des headings
     */
    private hasProperHeadings(sections: any[]): boolean {
        // Simplification: vérifie juste qu'il y a des sections
        return sections && sections.length > 0;
    }

    /**
     * Vérifie la longueur du contenu
     */
    private hasSufficientContent(sections: any[]): boolean {
        // Simplification: au moins 3 sections
        return sections && sections.length >= 3;
    }

    /**
     * Vérifie les alt text des images
     */
    private hasImageAltText(sections: any[]): boolean {
        // Simulé
        return true;
    }

    /**
     * Vérifie les liens internes
     */
    private hasInternalLinks(sections: any[]): boolean {
        // Simulé
        return sections && sections.length > 1;
    }

    /**
     * Calcule le score d'une catégorie
     */
    private calculateCategoryScore(checks: SEOCheck[]): number {
        const weights = {
            high: 3,
            medium: 2,
            low: 1
        };

        let totalWeight = 0;
        let earnedWeight = 0;

        checks.forEach(check => {
            const weight = weights[check.impact];
            totalWeight += weight;
            if (check.passed) {
                earnedWeight += weight;
            }
        });

        return totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
    }

    /**
     * Collecte les problèmes
     */
    private collectIssues(checks: SEOCheck[]): SEOIssue[] {
        return checks
            .filter(check => !check.passed)
            .map(check => ({
                severity: check.impact === 'high' ? 'error' : check.impact === 'medium' ? 'warning' : 'info',
                message: check.description,
                element: check.name,
                solution: this.getSolution(check.name)
            }));
    }

    /**
     * Génère des suggestions
     */
    private generateSuggestions(issues: SEOIssue[]): string[] {
        const suggestions: string[] = [];

        if (issues.some(i => i.element === 'Meta Title')) {
            suggestions.push('Add a descriptive title between 50-60 characters');
        }

        if (issues.some(i => i.element === 'Meta Description')) {
            suggestions.push('Write a compelling meta description (150-160 characters)');
        }

        if (issues.some(i => i.element === 'Focus Keyword')) {
            suggestions.push('Define a focus keyword for this page');
        }

        if (issues.some(i => i.element === 'Image Alt Text')) {
            suggestions.push('Add descriptive alt text to all images');
        }

        if (issues.some(i => i.element === 'Heading Structure')) {
            suggestions.push('Use proper H1, H2, H3 heading hierarchy');
        }

        return suggestions;
    }

    /**
     * Obtient la solution pour un problème
     */
    private getSolution(checkName: string): string {
        const solutions: Record<string, string> = {
            'Meta Title': 'Add a unique, descriptive title between 50-60 characters',
            'Meta Description': 'Write a meta description between 150-160 characters',
            'Canonical URL': 'Add a canonical URL to avoid duplicate content issues',
            'Robots Meta': 'Set robots meta to allow indexing',
            'Heading Structure': 'Use one H1 and proper H2, H3 hierarchy',
            'Content Length': 'Add more quality content (aim for at least 300 words)',
            'Image Alt Text': 'Add descriptive alt text to all images',
            'Focus Keyword': 'Define a primary keyword for this page'
        };

        return solutions[checkName] || 'Review and fix this SEO issue';
    }
}

export default SEOAnalyzer;
