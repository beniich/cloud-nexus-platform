// src/services/ai/ai-site-generator.ts

import type {
    AIGeneratorInput,
    AIGeneratorResult,
    AIGeneratedSection,
    TemplateSuggestion,
    AIServiceConfig
} from '../../types/ai.types';

/**
 * Service de génération de sites avec IA
 */
export class AISiteGenerator {
    private config: AIServiceConfig;

    constructor(config?: Partial<AIServiceConfig>) {
        this.config = {
            provider: 'anthropic',
            model: 'claude-sonnet-4-20250514',
            temperature: 0.7,
            maxTokens: 4000,
            ...config
        };
    }

    /**
     * Génère un site complet à partir des inputs utilisateur
     */
    async generateSite(input: AIGeneratorInput): Promise<AIGeneratorResult> {
        try {
            // 1. Analyser les besoins et suggérer un template
            const templateSuggestion = await this.suggestTemplate(input);

            // 2. Générer le thème de couleurs
            const theme = await this.generateTheme(input);

            // 3. Générer les sections
            const sections = await this.generateSections(input);

            // 4. Générer les éléments SEO
            const seo = await this.generateSEO(input);

            return {
                siteName: input.businessName,
                template: {
                    id: templateSuggestion.templateId,
                    category: this.getCategoryFromIndustry(input.industry)
                },
                theme,
                sections,
                seo
            };
        } catch (error) {
            throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Suggère le meilleur template basé sur les inputs
     */
    async suggestTemplate(input: AIGeneratorInput): Promise<TemplateSuggestion> {
        const prompt = this.buildTemplatePrompt(input);
        const response = await this.callAI(prompt);

        // Parser la réponse de l'IA
        const suggestion = this.parseTemplateSuggestion(response);

        return suggestion;
    }

    /**
     * Génère un thème de couleurs personnalisé
     */
    async generateTheme(input: AIGeneratorInput): Promise<any> {
        const prompt = `Generate a color theme for a ${input.style} ${input.industry} website.
Business: ${input.businessName}
Description: ${input.description}
${input.preferredColors ? `Preferred colors: ${input.preferredColors.join(', ')}` : ''}

Return ONLY a JSON object with these exact keys:
{
  "primary": "#hexcolor",
  "secondary": "#hexcolor",
  "accent": "#hexcolor",
  "background": "#hexcolor",
  "text": "#hexcolor",
  "textLight": "#hexcolor"
}`;

        const response = await this.callAI(prompt);
        const colors = this.parseJSON(response);

        return {
            colors,
            fonts: this.generateFonts(input.style)
        };
    }

    /**
     * Génère les sections du site
     */
    async generateSections(input: AIGeneratorInput): Promise<AIGeneratedSection[]> {
        const prompt = `Create website sections for a ${input.industry} business.
Business name: ${input.businessName}
Description: ${input.description}
Style: ${input.style}
Goals: ${input.goals.join(', ')}
Target audience: ${input.targetAudience || 'General public'}

Generate 5-7 sections with appropriate content. Return ONLY a JSON array with this structure:
[
  {
    "type": "hero|features|services|testimonials|team|contact|etc",
    "order": 0,
    "content": {
      "heading": "Main heading",
      "subheading": "Subheading",
      "text": "Body text",
      "cta": {
        "text": "Button text",
        "link": "#"
      }
    }
  }
]`;

        const response = await this.callAI(prompt);
        return this.parseJSON(response);
    }

    /**
     * Génère les éléments SEO
     */
    async generateSEO(input: AIGeneratorInput): Promise<any> {
        const prompt = `Create SEO metadata for a ${input.industry} website.
Business: ${input.businessName}
Description: ${input.description}

Return ONLY a JSON object:
{
  "title": "SEO title (50-60 chars)",
  "description": "Meta description (150-160 chars)",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`;

        const response = await this.callAI(prompt);
        return this.parseJSON(response);
    }

    /**
     * Appel à l'API Claude (Anthropic)
     */
    private async callAI(prompt: string): Promise<string> {
        try {
            // Simulation pour le moment si pas de clé API
            // Dans un contexte réel, on utiliserait le fetch vers l'API
            if (!process.env.VITE_ANTHROPIC_API_KEY) {
                console.warn('No API key found, skipping API call');
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

            if (!response.ok) {
                throw new Error(`AI API error: ${response.statusText}`);
            }

            const data = await response.json();

            // Extraire le texte de la réponse
            const text = data.content
                .filter((item: any) => item.type === 'text')
                .map((item: any) => item.text)
                .join('\n');

            return text;
        } catch (error) {
            console.error('AI API call failed:', error);
            // Fallback au mock en cas d'erreur
            return this.mockResponse(prompt);
        }
    }

    private mockResponse(prompt: string): string {
        if (prompt.includes('template')) {
            return JSON.stringify({
                templateId: 'business-professional',
                score: 95,
                reason: 'Best match for business needs'
            });
        }
        if (prompt.includes('color theme')) {
            return JSON.stringify({
                primary: '#2563EB',
                secondary: '#1E40AF',
                accent: '#10B981',
                background: '#FFFFFF',
                text: '#1F2937',
                textLight: '#6B7280'
            });
        }
        if (prompt.includes('sections')) {
            return JSON.stringify([
                {
                    type: 'hero',
                    order: 0,
                    content: {
                        heading: 'Welcome',
                        subheading: 'We help you grow',
                        text: 'Professional services for your business',
                        cta: { text: 'Get Started', link: '#' }
                    }
                },
                {
                    type: 'features',
                    order: 1,
                    content: {
                        heading: 'Why Choose Us',
                        text: 'Excellence in every detail'
                    }
                }
            ]);
        }
        if (prompt.includes('SEO')) {
            return JSON.stringify({
                title: 'Professional Business Services',
                description: 'Best business services for your growth',
                keywords: ['business', 'growth', 'services']
            });
        }
        return '';
    }

    /**
     * Construit le prompt pour la suggestion de template
     */
    private buildTemplatePrompt(input: AIGeneratorInput): string {
        return `Suggest the best website template for this business:
Industry: ${input.industry}
Business type: ${input.businessType}
Style preference: ${input.style}
Goals: ${input.goals.join(', ')}

Available templates:
1. Business Professional - Corporate, services, team showcase
2. Creative Portfolio - Visual projects, creative work
3. Landing Page - Single page, conversion-focused
4. Blog/Magazine - Content-heavy, articles
5. E-commerce - Product showcase, online store

Return ONLY a JSON object:
{
  "templateId": "business-professional|creative-portfolio|landing-page|blog-magazine|ecommerce",
  "score": 0-100,
  "reason": "Brief explanation"
}`;
    }

    /**
     * Parse la suggestion de template
     */
    private parseTemplateSuggestion(response: string): TemplateSuggestion {
        const data = this.parseJSON(response);

        const templateNames: Record<string, string> = {
            'business-professional': 'Business Professional',
            'creative-portfolio': 'Creative Portfolio',
            'landing-page': 'Landing Page Conversion',
            'blog-magazine': 'Blog/Magazine',
            'ecommerce': 'E-commerce Minimal'
        };

        return {
            templateId: data.templateId,
            score: data.score,
            reason: data.reason,
            preview: {
                name: templateNames[data.templateId] || data.templateId,
                thumbnail: `/templates/${data.templateId}.jpg`,
                description: data.reason
            }
        };
    }

    /**
     * Génère les polices selon le style
     */
    private generateFonts(style: string): Record<string, string> {
        const fontPairs: Record<string, Record<string, string>> = {
            professional: {
                heading: 'Inter, sans-serif',
                body: 'Inter, sans-serif'
            },
            creative: {
                heading: 'Playfair Display, serif',
                body: 'Source Sans Pro, sans-serif'
            },
            minimal: {
                heading: 'Helvetica Neue, sans-serif',
                body: 'Helvetica Neue, sans-serif'
            },
            bold: {
                heading: 'Montserrat, sans-serif',
                body: 'Open Sans, sans-serif'
            },
            elegant: {
                heading: 'Cormorant Garamond, serif',
                body: 'Lato, sans-serif'
            }
        };

        return fontPairs[style] || fontPairs.professional;
    }

    /**
     * Détermine la catégorie depuis l'industrie
     */
    private getCategoryFromIndustry(industry: string): string {
        const industryMap: Record<string, string> = {
            'technology': 'business',
            'consulting': 'business',
            'design': 'portfolio',
            'photography': 'portfolio',
            'blog': 'blog',
            'news': 'blog',
            'ecommerce': 'ecommerce',
            'retail': 'ecommerce',
            'marketing': 'landing',
            'saas': 'landing'
        };

        return industryMap[industry.toLowerCase()] || 'business';
    }

    /**
     * Parse JSON en gérant les erreurs
     */
    private parseJSON(text: string): any {
        try {
            // Nettoyer le texte (enlever les backticks markdown, etc.)
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

export default AISiteGenerator;
