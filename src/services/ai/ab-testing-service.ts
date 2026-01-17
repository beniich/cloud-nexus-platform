/**
 * Service A/B Testing pour optimiser automatiquement les prompts
 */

export interface ABTest {
    id: string;
    name: string;
    description: string;
    category: string;
    status: 'draft' | 'running' | 'paused' | 'completed';
    variants: ABVariant[];
    targetSampleSize: number;
    currentSampleSize: number;
    startDate: string;
    endDate?: string;
    winner?: string;
    metadata: {
        createdBy: string;
        createdAt: string;
        updatedAt: string;
    };
}

export interface ABVariant {
    id: string;
    name: string;
    prompt: string;
    systemPrompt?: string;
    weight: number; // Pourcentage de trafic (0-100)
    metrics: ABMetrics;
}

export interface ABMetrics {
    impressions: number;
    successCount: number;
    failureCount: number;
    avgRating: number;
    avgResponseTime: number;
    avgTokens: number;
    conversionRate: number;
    confidenceLevel: number;
}

export interface ABTestResult {
    testId: string;
    winner: ABVariant;
    confidence: number;
    improvement: number; // Pourcentage d'amélioration
    metrics: {
        variant: string;
        successRate: number;
        avgRating: number;
        sampleSize: number;
    }[];
    recommendation: string;
    statistical: {
        pValue: number;
        zScore: number;
        significanceLevel: number;
    };
}

export class ABTestingService {
    private tests: Map<string, ABTest>;
    private activeVariants: Map<string, string[]>; // testId -> variantIds in rotation

    constructor() {
        this.tests = new Map();
        this.activeVariants = new Map();
        this.loadTests();
    }

    /**
     * Crée un nouveau test A/B
     */
    createTest(config: {
        name: string;
        description: string;
        category: string;
        variants: Array<{ name: string; prompt: string; systemPrompt?: string; weight?: number }>;
        targetSampleSize?: number;
    }): ABTest {
        const test: ABTest = {
            id: this.generateId(),
            name: config.name,
            description: config.description,
            category: config.category,
            status: 'draft',
            variants: config.variants.map((v, index) => ({
                id: `variant_${index}`,
                name: v.name,
                prompt: v.prompt,
                systemPrompt: v.systemPrompt,
                weight: v.weight || Math.floor(100 / config.variants.length),
                metrics: this.initializeMetrics()
            })),
            targetSampleSize: config.targetSampleSize || 100,
            currentSampleSize: 0,
            startDate: new Date().toISOString(),
            metadata: {
                createdBy: 'system',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };

        this.tests.set(test.id, test);
        this.saveTests();

        return test;
    }

    /**
     * Démarre un test A/B
     */
    startTest(testId: string): void {
        const test = this.tests.get(testId);
        if (!test) throw new Error('Test not found');

        if (test.status !== 'draft' && test.status !== 'paused') {
            throw new Error('Test can only be started from draft or paused state');
        }

        test.status = 'running';
        test.metadata.updatedAt = new Date().toISOString();

        // Créer la rotation des variantes basée sur les poids
        this.activeVariants.set(testId, this.createVariantRotation(test.variants));

        this.saveTests();
    }

    /**
     * Pause un test A/B
     */
    pauseTest(testId: string): void {
        const test = this.tests.get(testId);
        if (!test) throw new Error('Test not found');

        test.status = 'paused';
        test.metadata.updatedAt = new Date().toISOString();
        this.saveTests();
    }

    /**
     * Termine un test A/B et détermine le gagnant
     */
    completeTest(testId: string): ABTestResult {
        const test = this.tests.get(testId);
        if (!test) throw new Error('Test not found');

        const result = this.analyzeTest(testId);

        test.status = 'completed';
        test.endDate = new Date().toISOString();
        test.winner = result.winner.id;
        test.metadata.updatedAt = new Date().toISOString();

        this.saveTests();

        return result;
    }

    /**
     * Sélectionne la variante à utiliser pour une requête
     */
    selectVariant(testId: string): ABVariant {
        const test = this.tests.get(testId);
        if (!test) throw new Error('Test not found');

        if (test.status !== 'running') {
            throw new Error('Test is not running');
        }

        // Sélection basée sur les poids
        const rotation = this.activeVariants.get(testId) || [];
        const randomIndex = Math.floor(Math.random() * rotation.length);
        const variantId = rotation[randomIndex];

        return test.variants.find(v => v.id === variantId)!;
    }

    /**
     * Enregistre le résultat d'une variante
     */
    recordResult(
        testId: string,
        variantId: string,
        result: {
            success: boolean;
            rating?: number;
            responseTime: number;
            tokens: number;
        }
    ): void {
        const test = this.tests.get(testId);
        if (!test) throw new Error('Test not found');

        const variant = test.variants.find(v => v.id === variantId);
        if (!variant) throw new Error('Variant not found');

        // Mettre à jour les métriques
        variant.metrics.impressions++;

        if (result.success) {
            variant.metrics.successCount++;
        } else {
            variant.metrics.failureCount++;
        }

        if (result.rating !== undefined) {
            const currentTotal = variant.metrics.avgRating * (variant.metrics.impressions - 1);
            variant.metrics.avgRating = (currentTotal + result.rating) / variant.metrics.impressions;
        }

        const currentTimeTotal = variant.metrics.avgResponseTime * (variant.metrics.impressions - 1);
        variant.metrics.avgResponseTime = (currentTimeTotal + result.responseTime) / variant.metrics.impressions;

        const currentTokenTotal = variant.metrics.avgTokens * (variant.metrics.impressions - 1);
        variant.metrics.avgTokens = (currentTokenTotal + result.tokens) / variant.metrics.impressions;

        variant.metrics.conversionRate =
            variant.metrics.successCount / variant.metrics.impressions;

        // Incrémenter la taille de l'échantillon total
        test.currentSampleSize++;

        // Vérifier si le test devrait se terminer automatiquement
        if (test.currentSampleSize >= test.targetSampleSize) {
            this.checkEarlyWinner(testId);
        }

        this.saveTests();
    }

    /**
     * Analyse un test et détermine le gagnant
     */
    analyzeTest(testId: string): ABTestResult {
        const test = this.tests.get(testId);
        if (!test) throw new Error('Test not found');

        // Calculer les statistiques pour chaque variante
        const metrics = test.variants.map(v => ({
            variant: v.name,
            successRate: v.metrics.conversionRate,
            avgRating: v.metrics.avgRating,
            sampleSize: v.metrics.impressions
        }));

        // Trouver le gagnant (meilleur taux de conversion)
        const winner = test.variants.reduce((best, current) =>
            current.metrics.conversionRate > best.metrics.conversionRate ? current : best
        );

        // Calculer l'amélioration
        const baseline = test.variants[0]; // On prend la première variante comme baseline
        const improvement = baseline.metrics.conversionRate > 0
            ? ((winner.metrics.conversionRate - baseline.metrics.conversionRate) /
                baseline.metrics.conversionRate) * 100
            : 0;

        // Calculer la significativité statistique
        const statistical = this.calculateSignificance(test.variants);

        // Générer une recommandation
        const recommendation = this.generateRecommendation(winner, statistical, improvement);

        return {
            testId,
            winner,
            confidence: statistical.confidenceLevel,
            improvement,
            metrics,
            recommendation,
            statistical
        };
    }

    /**
     * Vérifie s'il y a un gagnant évident avant d'atteindre l'échantillon cible
     */
    private checkEarlyWinner(testId: string): void {
        const result = this.analyzeTest(testId);

        // Si la confiance est > 95% et l'amélioration > 20%, on peut terminer tôt
        if (result.confidence > 95 && result.improvement > 20) {
            console.log(`Early winner detected for test ${testId}`);
            // On pourrait auto-compléter le test ici
        }
    }

    /**
     * Calcule la significativité statistique entre les variantes
     */
    private calculateSignificance(variants: ABVariant[]): {
        pValue: number;
        zScore: number;
        significanceLevel: number;
    } {
        if (variants.length < 2) {
            return { pValue: 1, zScore: 0, significanceLevel: 0 };
        }

        // Comparer la première variante (control) avec la meilleure variante
        const control = variants[0];
        const best = variants.reduce((a, b) =>
            b.metrics.conversionRate > a.metrics.conversionRate ? b : a
        );

        // Calculer le z-score (test de proportion)
        const p1 = control.metrics.conversionRate;
        const n1 = control.metrics.impressions;
        const p2 = best.metrics.conversionRate;
        const n2 = best.metrics.impressions;

        if (n1 === 0 || n2 === 0) {
            return { pValue: 1, zScore: 0, significanceLevel: 0 };
        }

        const pooledP = (p1 * n1 + p2 * n2) / (n1 + n2);
        const standardError = Math.sqrt(pooledP * (1 - pooledP) * (1 / n1 + 1 / n2));

        const zScore = standardError > 0 ? (p2 - p1) / standardError : 0;

        // Calculer la p-value (approximation)
        const pValue = this.calculatePValue(Math.abs(zScore));

        // Niveau de confiance
        const significanceLevel = (1 - pValue) * 100;

        return {
            pValue,
            zScore,
            significanceLevel
        };
    }

    /**
     * Calcule la p-value à partir du z-score
     */
    private calculatePValue(zScore: number): number {
        // Approximation de la fonction de distribution cumulative normale
        const t = 1 / (1 + 0.2316419 * zScore);
        const d = 0.3989423 * Math.exp(-zScore * zScore / 2);
        const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

        return probability * 2; // Two-tailed test
    }

    /**
     * Génère une recommandation basée sur les résultats
     */
    private generateRecommendation(
        winner: ABVariant,
        statistical: { pValue: number; significanceLevel: number },
        improvement: number
    ): string {
        if (statistical.significanceLevel < 90) {
            return 'The test needs more data to reach statistical significance. Continue running the test.';
        }

        if (improvement < 5) {
            return `Winner: "${winner.name}". However, the improvement is marginal (${improvement.toFixed(1)}%). Consider testing more distinct variations.`;
        }

        if (improvement >= 20) {
            return `Strong winner: "${winner.name}" with ${improvement.toFixed(1)}% improvement. Highly recommended to adopt this variant.`;
        }

        return `Winner: "${winner.name}" with ${improvement.toFixed(1)}% improvement and ${statistical.significanceLevel.toFixed(1)}% confidence. Safe to adopt.`;
    }

    /**
     * Crée une rotation de variantes basée sur les poids
     */
    private createVariantRotation(variants: ABVariant[]): string[] {
        const rotation: string[] = [];

        variants.forEach(variant => {
            const count = Math.round(variant.weight);
            for (let i = 0; i < count; i++) {
                rotation.push(variant.id);
            }
        });

        // Mélanger pour randomiser
        return this.shuffle(rotation);
    }

    /**
     * Mélange un tableau (Fisher-Yates)
     */
    private shuffle<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Initialise les métriques d'une variante
     */
    private initializeMetrics(): ABMetrics {
        return {
            impressions: 0,
            successCount: 0,
            failureCount: 0,
            avgRating: 0,
            avgResponseTime: 0,
            avgTokens: 0,
            conversionRate: 0,
            confidenceLevel: 0
        };
    }

    /**
     * Récupère tous les tests
     */
    getAllTests(filter?: { status?: ABTest['status']; category?: string }): ABTest[] {
        let tests = Array.from(this.tests.values());

        if (filter) {
            if (filter.status) {
                tests = tests.filter(t => t.status === filter.status);
            }
            if (filter.category) {
                tests = tests.filter(t => t.category === filter.category);
            }
        }

        return tests.sort((a, b) =>
            new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
        );
    }

    /**
     * Récupère un test par ID
     */
    getTest(testId: string): ABTest | undefined {
        return this.tests.get(testId);
    }

    /**
     * Supprime un test
     */
    deleteTest(testId: string): void {
        this.tests.delete(testId);
        this.activeVariants.delete(testId);
        this.saveTests();
    }

    /**
     * Clone un test pour créer une nouvelle itération
     */
    cloneTest(testId: string, newName: string): ABTest {
        const original = this.tests.get(testId);
        if (!original) throw new Error('Test not found');

        const cloned: ABTest = {
            ...original,
            id: this.generateId(),
            name: newName,
            status: 'draft',
            currentSampleSize: 0,
            startDate: new Date().toISOString(),
            endDate: undefined,
            winner: undefined,
            variants: original.variants.map(v => ({
                ...v,
                metrics: this.initializeMetrics()
            })),
            metadata: {
                createdBy: 'system',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };

        this.tests.set(cloned.id, cloned);
        this.saveTests();

        return cloned;
    }

    /**
     * Obtient des insights sur les tests
     */
    getInsights(): {
        totalTests: number;
        runningTests: number;
        completedTests: number;
        avgImprovement: number;
        topPerformingCategories: Array<{ category: string; avgImprovement: number }>;
    } {
        const tests = Array.from(this.tests.values());
        const completed = tests.filter(t => t.status === 'completed');

        const improvements = completed.map(test => {
            if (!test.winner) return 0;

            const winner = test.variants.find(v => v.id === test.winner);
            const baseline = test.variants[0];

            if (!winner || !baseline || baseline.metrics.conversionRate === 0) return 0;

            return ((winner.metrics.conversionRate - baseline.metrics.conversionRate) /
                baseline.metrics.conversionRate) * 100;
        });

        const avgImprovement = improvements.length > 0
            ? improvements.reduce((a, b) => a + b, 0) / improvements.length
            : 0;

        // Grouper par catégorie
        const byCategory = new Map<string, number[]>();
        completed.forEach(test => {
            if (!test.winner) return;

            const winner = test.variants.find(v => v.id === test.winner);
            const baseline = test.variants[0];

            if (!winner || !baseline || baseline.metrics.conversionRate === 0) return;

            const improvement = ((winner.metrics.conversionRate - baseline.metrics.conversionRate) /
                baseline.metrics.conversionRate) * 100;

            if (!byCategory.has(test.category)) {
                byCategory.set(test.category, []);
            }
            byCategory.get(test.category)!.push(improvement);
        });

        const topPerformingCategories = Array.from(byCategory.entries())
            .map(([category, improvements]) => ({
                category,
                avgImprovement: improvements.reduce((a, b) => a + b, 0) / improvements.length
            }))
            .sort((a, b) => b.avgImprovement - a.avgImprovement)
            .slice(0, 5);

        return {
            totalTests: tests.length,
            runningTests: tests.filter(t => t.status === 'running').length,
            completedTests: completed.length,
            avgImprovement,
            topPerformingCategories
        };
    }

    /**
     * Persistence
     */
    private loadTests(): void {
        try {
            const stored = localStorage.getItem('ab_tests');
            if (stored) {
                const data = JSON.parse(stored);
                this.tests = new Map(Object.entries(data));
            }
        } catch (error) {
            console.error('Failed to load AB tests:', error);
        }
    }

    private saveTests(): void {
        try {
            const data = Object.fromEntries(this.tests);
            localStorage.setItem('ab_tests', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save AB tests:', error);
        }
    }

    private generateId(): string {
        return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

export default ABTestingService;
