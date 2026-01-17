// src/services/ai/ai-content-generator.ts

import type {
    ContentGenerationRequest,
    ContentGenerationResult,
    ContentImprovementRequest,
    ContentImprovementResult,
    AIServiceConfig
} from '../../types/ai.types';

/**
 * Générateur de contenu IA pour sections individuelles
 */
export class AIContentGenerator {
    private config: AIServiceConfig;

    constructor(config?: Partial<AIServiceConfig>) {
        this.config = {
            provider: 'anthropic',
            model: 'claude-sonnet-4-20250514',
            temperature: 0.7,
            maxTokens: 2000,
            ...config
        };
    }

    /**
     * Génère du contenu pour une section spécifique
     */
    async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResult> {
        const prompt = this.buildGenerationPrompt(request);
        const response = await this.callAI(prompt);
        let content;

        try {
            content = this.parseJSON(response);
        } catch (e) {
            content = { bodyText: response };
        }

        // Calculer les métriques
        const bodyText = content.bodyText || '';
        const wordCount = bodyText.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // 200 mots par minute

        return {
            ...content,
            metadata: {
                wordCount,
                readingTime
            }
        };
    }

    /**
     * Améliore du contenu existant
     */
    async improveContent(request: ContentImprovementRequest): Promise<ContentImprovementResult> {
        const prompt = this.buildImprovementPrompt(request);
        const response = await this.callAI(prompt);
        let result;

        try {
            result = this.parseJSON(response);
        } catch (e) {
            result = { improvedContent: response, changes: [] };
        }

        // Calculer les scores
        const metrics = this.calculateMetrics(
            request.originalContent,
            result.improvedContent
        );

        return {
            improvedContent: result.improvedContent,
            changes: result.changes || [],
            metrics
        };
    }

    /**
     * Génère des variations de texte
     */
    async generateVariations(
        text: string,
        count: number = 3,
        tone?: string
    ): Promise<string[]> {
        const prompt = `Generate ${count} variations of this text${tone ? ` with a ${tone} tone` : ''}:

"${text}"

Return ONLY a JSON array of strings:
["variation 1", "variation 2", "variation 3"]`;

        const response = await this.callAI(prompt);
        return this.parseJSON(response);
    }

    /**
     * Optimise pour le SEO
     */
    async optimizeForSEO(
        content: string,
        keyword: string,
        targetLength?: number
    ): Promise<string> {
        const prompt = `Optimize this content for SEO with focus keyword "${keyword}":

Original content:
"${content}"

${targetLength ? `Target length: ~${targetLength} words` : ''}

Guidelines:
- Include the keyword naturally 2-3 times
- Improve readability
- Make it engaging
- Keep the core message

Return ONLY the optimized text (no JSON, no explanation).`;

        return await this.callAI(prompt);
    }

    /**
     * Génère des meta descriptions
     */
    async generateMetaDescription(
        pageContent: string,
        keyword?: string
    ): Promise<string> {
        const prompt = `Generate a compelling meta description (150-160 characters) for this page:

Content summary: ${pageContent.substring(0, 500)}
${keyword ? `Focus keyword: ${keyword}` : ''}

Return ONLY the meta description text (no JSON, no quotes).`;

        return await this.callAI(prompt);
    }

    /**
     * Construit le prompt de génération
     */
    private buildGenerationPrompt(request: ContentGenerationRequest): string {
        const sectionPrompts: Record<string, string> = {
            hero: 'a compelling hero section with a strong headline, subheadline, and call-to-action',
            features: 'a features section highlighting key benefits and capabilities',
            services: 'a services section describing what the business offers',
            about: 'an about section telling the company story and values',
            testimonials: 'testimonial content with customer quotes',
            team: 'a team section introducing key people',
            pricing: 'a pricing section with clear value propositions',
            faq: 'frequently asked questions with helpful answers',
            contact: 'a contact section encouraging visitors to get in touch',
            cta: 'a call-to-action section with persuasive copy'
        };

        const sectionDescription = sectionPrompts[request.sectionType] ||
            `content for a ${request.sectionType} section`;

        return `Generate ${sectionDescription} for a ${request.context.businessType || 'business'} website.

Context:
${request.context.siteName ? `- Business name: ${request.context.siteName}` : ''}
${request.context.industry ? `- Industry: ${request.context.industry}` : ''}
${request.context.targetAudience ? `- Target audience: ${request.context.targetAudience}` : ''}

Tone: ${request.tone}
Length: ${request.length}
${request.specificRequirements ? `Special requirements: ${request.specificRequirements.join(', ')}` : ''}

Return ONLY a JSON object:
{
  "heading": "Main heading (5-10 words)",
  "subheading": "Supporting subheading (optional)",
  "bodyText": "Main body text (${this.getLengthGuide(request.length)} words)",
  "bulletPoints": ["point 1", "point 2", "point 3"] (optional),
  "ctaText": "Call-to-action button text (2-4 words)" (optional)
}`;
    }

    /**
     * Construit le prompt d'amélioration
     */
    private buildImprovementPrompt(request: ContentImprovementRequest): string {
        const improvementTypes: Record<string, string> = {
            clarity: 'Make it clearer and easier to understand',
            engagement: 'Make it more engaging and compelling',
            seo: 'Optimize for search engines while keeping it natural',
            brevity: 'Make it more concise without losing key information',
            expansion: 'Expand with more detail and examples'
        };

        const instruction = improvementTypes[request.improvementType] ||
            'Improve the overall quality';

        return `${instruction}:

Original content:
"${request.originalContent}"

${request.targetAudience ? `Target audience: ${request.targetAudience}` : ''}
${request.keywords ? `Keywords to include: ${request.keywords.join(', ')}` : ''}

Return ONLY a JSON object:
{
  "improvedContent": "The improved version",
  "changes": [
    {"type": "clarity|tone|structure|etc", "description": "What was changed"}
  ]
}`;
    }

    /**
     * Obtient le guide de longueur
     */
    private getLengthGuide(length: 'short' | 'medium' | 'long'): string {
        const guides = {
            short: '50-100',
            medium: '150-250',
            long: '300-500'
        };
        return guides[length];
    }

    /**
     * Calcule les métriques de qualité
     */
    private calculateMetrics(
        original: string,
        improved: string
    ): ContentImprovementResult['metrics'] {
        // Readability score (simulé - Flesch Reading Ease)
        const readabilityScore = this.calculateReadability(improved);

        // SEO score (basé sur la longueur et structure)
        const seoScore = this.calculateSEOScore(improved);

        // Engagement score (basé sur des mots d'action, questions, etc.)
        const engagementScore = this.calculateEngagementScore(improved);

        return {
            readabilityScore,
            seoScore,
            engagementScore
        };
    }

    /**
     * Calcule le score de lisibilité
     */
    private calculateReadability(text: string): number {
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).length;
        const avgWordsPerSentence = words / sentences;

        // Plus de 20 mots par phrase = moins lisible
        let score = 100;
        if (avgWordsPerSentence > 20) {
            score -= (avgWordsPerSentence - 20) * 2;
        }

        return Math.max(0, Math.min(100, Math.round(score)));
    }

    /**
     * Calcule le score SEO
     */
    private calculateSEOScore(text: string): number {
        let score = 50;

        const words = text.split(/\s+/).length;

        // Longueur appropriée
        if (words >= 100 && words <= 500) score += 20;
        else if (words >= 50) score += 10;

        // Présence de structure (paragraphes)
        if (text.includes('\n\n') || text.length > 200) score += 15;

        // Variété de mots
        const uniqueWords = new Set(text.toLowerCase().split(/\s+/)).size;
        const variety = uniqueWords / words;
        if (variety > 0.5) score += 15;

        return Math.min(100, score);
    }

    /**
     * Calcule le score d'engagement
     */
    private calculateEngagementScore(text: string): number {
        let score = 40;

        // Mots d'action
        const actionWords = ['discover', 'learn', 'get', 'start', 'join', 'explore', 'create'];
        const hasActionWords = actionWords.some(word =>
            text.toLowerCase().includes(word)
        );
        if (hasActionWords) score += 20;

        // Questions
        if (text.includes('?')) score += 15;

        // Appels à l'action
        const ctaWords = ['now', 'today', 'free', 'easy', 'simple'];
        const hasCTA = ctaWords.some(word =>
            text.toLowerCase().includes(word)
        );
        if (hasCTA) score += 15;

        // Utilisation de chiffres
        if (/\d+/.test(text)) score += 10;

        return Math.min(100, score);
    }

    /**
     * Appel à l'API IA
     */
    private async callAI(prompt: string): Promise<string> {
        try {
            if (!process.env.VITE_ANTHROPIC_API_KEY) {
                return this.mockResponse(prompt);
            }

            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.VITE_ANTHROPIC_API_KEY || ''
                },
                body: JSON.stringify({
                    model: this.config.model,
                    max_tokens: this.config.maxTokens,
                    temperature: this.config.temperature,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ]
                })
            });

            const data = await response.json();

            return data.content
                .filter((item: any) => item.type === 'text')
                .map((item: any) => item.text)
                .join('\n');
        } catch (error) {
            console.error('AI API call failed:', error);
            return this.mockResponse(prompt);
        }
    }

    private mockResponse(prompt: string): string {
        if (prompt.includes('features section')) {
            return JSON.stringify({
                heading: "Powerful Features",
                subheading: "Everything you need",
                bodyText: "Our platform offers a comprehensive suite of tools designed to help you succeed. From analytics to automation, we have it all.",
                bulletPoints: ["Easy to use", "Scalable", "Secure"],
                ctaText: "Get Started"
            });
        }
        return JSON.stringify({ bodyText: "Simulated AI content response." });
    }

    /**
     * Parse JSON
     */
    private parseJSON(text: string): any {
        try {
            const cleaned = text
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            return JSON.parse(cleaned);
        } catch (error) {
            console.error('Failed to parse JSON:', text);
            throw new Error('Invalid JSON response from AI');
        }
    }
}

export default AIContentGenerator;
