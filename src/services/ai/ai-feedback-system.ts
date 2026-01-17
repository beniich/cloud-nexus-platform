// src/services/ai/ai-feedback-system.ts

/**
 * Système de feedback et d'amélioration des prompts AI
 */

export interface AIFeedback {
    id: string;
    generationId: string;
    userId: string;
    rating: 'positive' | 'negative';
    category: 'generation' | 'improvement' | 'chat';
    feedback?: string;
    tags?: string[];
    timestamp: string;
    provider: string;
    model: string;
    prompt: string;
    response: string;
}

export interface PromptTemplate {
    id: string;
    name: string;
    category: string;
    template: string;
    variables: string[];
    successRate: number;
    avgRating: number;
    usageCount: number;
    lastUpdated: string;
}

export interface TrainingData {
    prompt: string;
    response: string;
    rating: number;
    context: Record<string, any>;
}

export class AIFeedbackSystem {
    private feedbackKey = 'ai_feedback';
    private promptsKey = 'ai_prompts';

    /**
     * Enregistre un feedback utilisateur
     */
    async submitFeedback(feedback: Omit<AIFeedback, 'id' | 'timestamp'>): Promise<AIFeedback> {
        const newFeedback: AIFeedback = {
            ...feedback,
            id: this.generateId(),
            timestamp: new Date().toISOString()
        };

        const feedbacks = this.getFeedbacks();
        feedbacks.push(newFeedback);
        this.saveFeedbacks(feedbacks);

        // Mettre à jour les statistiques du prompt
        await this.updatePromptStats(feedback.category, feedback.rating);

        return newFeedback;
    }

    /**
     * Récupère tous les feedbacks
     */
    getFeedbacks(filters?: {
        category?: string;
        rating?: 'positive' | 'negative';
        provider?: string;
        startDate?: string;
        endDate?: string;
    }): AIFeedback[] {
        let feedbacks = this.getStoredFeedbacks();

        if (filters) {
            if (filters.category) {
                feedbacks = feedbacks.filter(f => f.category === filters.category);
            }
            if (filters.rating) {
                feedbacks = feedbacks.filter(f => f.rating === filters.rating);
            }
            if (filters.provider) {
                feedbacks = feedbacks.filter(f => f.provider === filters.provider);
            }
            if (filters.startDate) {
                feedbacks = feedbacks.filter(f => f.timestamp >= filters.startDate!);
            }
            if (filters.endDate) {
                feedbacks = feedbacks.filter(f => f.timestamp <= filters.endDate!);
            }
        }

        return feedbacks;
    }

    /**
     * Analyse les feedbacks pour identifier les problèmes
     */
    analyzeFeedback(): {
        commonIssues: Array<{ issue: string; count: number; examples: string[] }>;
        successPatterns: Array<{ pattern: string; successRate: number }>;
        recommendations: string[];
    } {
        const feedbacks = this.getStoredFeedbacks();
        const negativeFeedbacks = feedbacks.filter(f => f.rating === 'negative');

        // Identifier les problèmes communs
        const issuesMap = new Map<string, string[]>();

        negativeFeedbacks.forEach(f => {
            if (f.feedback) {
                const issue = this.categorizeIssue(f.feedback);
                if (!issuesMap.has(issue)) {
                    issuesMap.set(issue, []);
                }
                issuesMap.get(issue)!.push(f.feedback);
            }
        });

        const commonIssues = Array.from(issuesMap.entries())
            .map(([issue, examples]) => ({
                issue,
                count: examples.length,
                examples: examples.slice(0, 3)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Identifier les patterns de succès
        const positiveFeedbacks = feedbacks.filter(f => f.rating === 'positive');
        const successPatterns = this.identifySuccessPatterns(positiveFeedbacks);

        // Générer des recommandations
        const recommendations = this.generateRecommendations(commonIssues, successPatterns);

        return {
            commonIssues,
            successPatterns,
            recommendations
        };
    }

    /**
     * Optimise un prompt basé sur les feedbacks
     */
    async optimizePrompt(promptId: string): Promise<PromptTemplate> {
        const prompt = this.getPromptTemplate(promptId);
        if (!prompt) {
            throw new Error('Prompt template not found');
        }

        const feedbacks = this.getFeedbacks({ category: prompt.category });
        const positiveFeedbacks = feedbacks.filter(f => f.rating === 'positive');
        const negativeFeedbacks = feedbacks.filter(f => f.rating === 'negative');

        // Analyser les prompts réussis
        const successfulPrompts = positiveFeedbacks.map(f => f.prompt);
        const failedPrompts = negativeFeedbacks.map(f => f.prompt);

        // Identifier les éléments communs dans les prompts réussis
        const successElements = this.extractCommonElements(successfulPrompts);
        const failureElements = this.extractCommonElements(failedPrompts);

        // Reconstruire le prompt
        let optimizedTemplate = prompt.template;

        // Ajouter les éléments de succès
        successElements.forEach(element => {
            if (!optimizedTemplate.includes(element)) {
                optimizedTemplate += `\n${element}`;
            }
        });

        // Retirer les éléments problématiques
        failureElements.forEach(element => {
            optimizedTemplate = optimizedTemplate.replace(element, '');
        });

        // Mettre à jour le template
        const optimizedPrompt: PromptTemplate = {
            ...prompt,
            template: optimizedTemplate,
            lastUpdated: new Date().toISOString()
        };

        this.savePromptTemplate(optimizedPrompt);

        return optimizedPrompt;
    }

    /**
     * Génère des données d'entraînement pour améliorer l'IA
     */
    generateTrainingData(): TrainingData[] {
        const feedbacks = this.getFeedbacks({ rating: 'positive' });

        return feedbacks.map(f => ({
            prompt: f.prompt,
            response: f.response,
            rating: 1, // Positive = 1
            context: {
                provider: f.provider,
                model: f.model,
                category: f.category
            }
        }));
    }

    /**
     * Calcule les métriques de performance
     */
    getPerformanceMetrics(timeRange?: { start: string; end: string }): {
        totalFeedbacks: number;
        positiveRate: number;
        negativeRate: number;
        avgResponseQuality: number;
        byCategory: Record<string, { positive: number; negative: number; rate: number }>;
        byProvider: Record<string, { positive: number; negative: number; rate: number }>;
        trends: Array<{ date: string; positive: number; negative: number }>;
    } {
        let feedbacks = this.getStoredFeedbacks();

        if (timeRange) {
            feedbacks = feedbacks.filter(
                f => f.timestamp >= timeRange.start && f.timestamp <= timeRange.end
            );
        }

        const total = feedbacks.length;
        const positive = feedbacks.filter(f => f.rating === 'positive').length;
        const negative = feedbacks.filter(f => f.rating === 'negative').length;

        // Par catégorie
        const byCategory: Record<string, any> = {};
        ['generation', 'improvement', 'chat'].forEach(cat => {
            const catFeedbacks = feedbacks.filter(f => f.category === cat);
            const catPositive = catFeedbacks.filter(f => f.rating === 'positive').length;
            const catNegative = catFeedbacks.filter(f => f.rating === 'negative').length;

            byCategory[cat] = {
                positive: catPositive,
                negative: catNegative,
                rate: catFeedbacks.length > 0 ? (catPositive / catFeedbacks.length) * 100 : 0
            };
        });

        // Par provider
        const byProvider: Record<string, any> = {};
        const providers = [...new Set(feedbacks.map(f => f.provider))];

        providers.forEach(provider => {
            const providerFeedbacks = feedbacks.filter(f => f.provider === provider);
            const providerPositive = providerFeedbacks.filter(f => f.rating === 'positive').length;
            const providerNegative = providerFeedbacks.filter(f => f.rating === 'negative').length;

            byProvider[provider] = {
                positive: providerPositive,
                negative: providerNegative,
                rate: providerFeedbacks.length > 0 ? (providerPositive / providerFeedbacks.length) * 100 : 0
            };
        });

        // Trends (derniers 7 jours)
        const trends = this.calculateTrends(feedbacks, 7);

        return {
            totalFeedbacks: total,
            positiveRate: total > 0 ? (positive / total) * 100 : 0,
            negativeRate: total > 0 ? (negative / total) * 100 : 0,
            avgResponseQuality: total > 0 ? (positive / total) * 5 : 0, // Sur 5
            byCategory,
            byProvider,
            byProvider,
            trends
        };
    }

    /**
     * Catégorise un problème depuis le feedback textuel
     */
    private categorizeIssue(feedback: string): string {
        const lowerFeedback = feedback.toLowerCase();

        if (lowerFeedback.includes('incorrect') || lowerFeedback.includes('wrong')) {
            return 'Incorrect Information';
        }
        if (lowerFeedback.includes('generic') || lowerFeedback.includes('vague')) {
            return 'Too Generic';
        }
        if (lowerFeedback.includes('long') || lowerFeedback.includes('verbose')) {
            return 'Too Lengthy';
        }
        if (lowerFeedback.includes('short') || lowerFeedback.includes('brief')) {
            return 'Too Brief';
        }
        if (lowerFeedback.includes('tone') || lowerFeedback.includes('style')) {
            return 'Wrong Tone/Style';
        }
        if (lowerFeedback.includes('format') || lowerFeedback.includes('structure')) {
            return 'Poor Formatting';
        }

        return 'Other';
    }

    /**
     * Identifie les patterns de succès
     */
    private identifySuccessPatterns(positiveFeedbacks: AIFeedback[]): Array<{ pattern: string; successRate: number }> {
        // Simplification : identifier les providers et modèles les plus réussis
        const providerStats = new Map<string, { success: number; total: number }>();

        positiveFeedbacks.forEach(f => {
            const key = `${f.provider}-${f.model}`;
            if (!providerStats.has(key)) {
                providerStats.set(key, { success: 0, total: 0 });
            }
            const stats = providerStats.get(key)!;
            stats.success++;
            stats.total++;
        });

        return Array.from(providerStats.entries())
            .map(([pattern, stats]) => ({
                pattern,
                successRate: (stats.success / stats.total) * 100
            }))
            .sort((a, b) => b.successRate - a.successRate);
    }

    /**
     * Génère des recommandations basées sur l'analyse
     */
    private generateRecommendations(
        issues: Array<{ issue: string; count: number }>,
        patterns: Array<{ pattern: string; successRate: number }>
    ): string[] {
        const recommendations: string[] = [];

        // Recommandations basées sur les problèmes
        issues.forEach(issue => {
            switch (issue.issue) {
                case 'Too Generic':
                    recommendations.push('Add more specific context variables to prompts');
                    break;
                case 'Too Lengthy':
                    recommendations.push('Add word count limits to generation prompts');
                    break;
                case 'Wrong Tone/Style':
                    recommendations.push('Make tone parameter more explicit in prompts');
                    break;
            }
        });

        // Recommandations basées sur les succès
        if (patterns.length > 0) {
            const bestPattern = patterns[0];
            recommendations.push(`Consider using ${bestPattern.pattern} more often (${bestPattern.successRate.toFixed(1)}% success rate)`);
        }

        return [...new Set(recommendations)]; // Dédupliquer
    }

    /**
     * Extrait les éléments communs des prompts
     */
    private extractCommonElements(prompts: string[]): string[] {
        // Simplification : extraire les phrases qui apparaissent dans >50% des prompts
        const elements = new Map<string, number>();

        prompts.forEach(prompt => {
            const sentences = prompt.split('\n').filter(s => s.trim().length > 0);
            sentences.forEach(sentence => {
                elements.set(sentence, (elements.get(sentence) || 0) + 1);
            });
        });

        const threshold = prompts.length * 0.5;
        return Array.from(elements.entries())
            .filter(([_, count]) => count >= threshold)
            .map(([element]) => element);
    }

    /**
     * Calcule les trends sur N jours
     */
    private calculateTrends(feedbacks: AIFeedback[], days: number): Array<{ date: string; positive: number; negative: number }> {
        const trends: Array<{ date: string; positive: number; negative: number }> = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayFeedbacks = feedbacks.filter(f => f.timestamp.startsWith(dateStr));

            trends.push({
                date: dateStr,
                positive: dayFeedbacks.filter(f => f.rating === 'positive').length,
                negative: dayFeedbacks.filter(f => f.rating === 'negative').length
            });
        }

        return trends;
    }

    /**
     * Met à jour les stats d'un prompt
     */
    private async updatePromptStats(category: string, rating: 'positive' | 'negative'): Promise<void> {
        // Implémentation simplifiée
        console.log(`Updating stats for ${category}: ${rating}`);
    }

    /**
     * Récupère un template de prompt
     */
    private getPromptTemplate(id: string): PromptTemplate | null {
        const prompts = this.getStoredPrompts();
        return prompts.find(p => p.id === id) || null;
    }

    /**
     * Sauvegarde un template de prompt
     */
    private savePromptTemplate(prompt: PromptTemplate): void {
        const prompts = this.getStoredPrompts();
        const index = prompts.findIndex(p => p.id === prompt.id);

        if (index >= 0) {
            prompts[index] = prompt;
        } else {
            prompts.push(prompt);
        }

        localStorage.setItem(this.promptsKey, JSON.stringify(prompts));
    }

    /**
     * Storage helpers
     */
    private getStoredFeedbacks(): AIFeedback[] {
        try {
            const data = localStorage.getItem(this.feedbackKey);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    private saveFeedbacks(feedbacks: AIFeedback[]): void {
        localStorage.setItem(this.feedbackKey, JSON.stringify(feedbacks));
    }

    private getStoredPrompts(): PromptTemplate[] {
        try {
            const data = localStorage.getItem(this.promptsKey);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    private generateId(): string {
        return `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
