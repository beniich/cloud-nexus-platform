/**
 * Service de fine-tuning pour entraîner des modèles personnalisés
 * Supporte OpenAI fine-tuning et Anthropic's Claude (via API future)
 */

export type FineTuningProvider = 'openai' | 'anthropic' | 'custom';

export interface TrainingDataset {
    id: string;
    name: string;
    description: string;
    provider: FineTuningProvider;
    format: 'jsonl' | 'csv' | 'parquet';
    size: number; // Nombre d'exemples
    dataUrl?: string;
    examples: TrainingExample[];
    metadata: {
        createdAt: string;
        updatedAt: string;
        version: string;
    };
}

export interface TrainingExample {
    id: string;
    messages: Array<{
        role: 'system' | 'user' | 'assistant';
        content: string;
    }>;
    metadata?: {
        category?: string;
        rating?: number;
        tokens?: number;
        source?: string;
    };
}

export interface FineTuningJob {
    id: string;
    name: string;
    provider: FineTuningProvider;
    baseModel: string;
    datasetId: string;
    status: 'pending' | 'running' | 'succeeded' | 'failed' | 'cancelled';
    progress: number; // 0-100
    hyperparameters: {
        epochs?: number;
        batchSize?: number;
        learningRate?: number;
        validationSplit?: number;
    };
    metrics?: {
        trainingLoss: number[];
        validationLoss: number[];
        accuracy: number;
    };
    fineTunedModel?: string;
    cost?: number;
    startedAt?: string;
    completedAt?: string;
    error?: string;
    metadata: {
        createdBy: string;
        createdAt: string;
        updatedAt: string;
    };
}

export interface ModelEvaluation {
    modelId: string;
    metrics: {
        accuracy: number;
        precision: number;
        recall: number;
        f1Score: number;
        perplexity: number;
    };
    comparison: {
        baseModel: string;
        improvement: number; // Pourcentage
    };
    testResults: Array<{
        input: string;
        expected: string;
        actual: string;
        score: number;
    }>;
    recommendations: string[];
}

export class FineTuningService {
    private datasets: Map<string, TrainingDataset>;
    private jobs: Map<string, FineTuningJob>;

    constructor() {
        this.datasets = new Map();
        this.jobs = new Map();
        this.loadData();
    }

    // ============================================================================
    // DATASET MANAGEMENT
    // ============================================================================

    /**
     * Crée un dataset d'entraînement à partir de l'historique
     */
    async createDatasetFromHistory(config: {
        name: string;
        description: string;
        provider: FineTuningProvider;
        filters?: {
            minRating?: number;
            category?: string;
            startDate?: string;
            endDate?: string;
        };
        maxExamples?: number;
    }): Promise<TrainingDataset> {
        // Récupérer l'historique depuis le service de persistance
        // (Simplification : on utilise des exemples fictifs)
        const examples = await this.fetchHistoricalExamples(config.filters, config.maxExamples);

        const dataset: TrainingDataset = {
            id: this.generateId(),
            name: config.name,
            description: config.description,
            provider: config.provider,
            format: 'jsonl',
            size: examples.length,
            examples,
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: '1.0.0'
            }
        };

        this.datasets.set(dataset.id, dataset);
        this.saveDatasets();

        return dataset;
    }

    /**
     * Ajoute des exemples à un dataset
     */
    async addExamplesToDataset(
        datasetId: string,
        examples: TrainingExample[]
    ): Promise<void> {
        const dataset = this.datasets.get(datasetId);
        if (!dataset) throw new Error('Dataset not found');

        dataset.examples.push(...examples);
        dataset.size = dataset.examples.length;
        dataset.metadata.updatedAt = new Date().toISOString();

        this.saveDatasets();
    }

    /**
     * Valide un dataset avant l'entraînement
     */
    validateDataset(datasetId: string): {
        valid: boolean;
        errors: string[];
        warnings: string[];
        stats: {
            totalExamples: number;
            avgTokensPerExample: number;
            categoryDistribution: Record<string, number>;
        };
    } {
        const dataset = this.datasets.get(datasetId);
        if (!dataset) throw new Error('Dataset not found');

        const errors: string[] = [];
        const warnings: string[] = [];

        // Vérifier la taille minimale
        if (dataset.size < 10) {
            errors.push('Dataset must contain at least 10 examples');
        }

        // Vérifier la structure des exemples
        dataset.examples.forEach((example, index) => {
            if (!example.messages || example.messages.length === 0) {
                errors.push(`Example ${index} has no messages`);
            }

            if (example.messages.some(m => !m.role || !m.content)) {
                errors.push(`Example ${index} has invalid message format`);
            }
        });

        // Vérifier la diversité
        const categories = new Map<string, number>();
        dataset.examples.forEach(ex => {
            const cat = ex.metadata?.category || 'unknown';
            categories.set(cat, (categories.get(cat) || 0) + 1);
        });

        if (categories.size < 2) {
            warnings.push('Dataset lacks diversity. Consider adding examples from different categories');
        }

        // Calculer les statistiques
        const avgTokens = dataset.examples.reduce((sum, ex) => {
            const tokens = ex.metadata?.tokens || 0;
            return sum + tokens;
        }, 0) / dataset.size;

        return {
            valid: errors.length === 0,
            errors,
            warnings,
            stats: {
                totalExamples: dataset.size,
                avgTokensPerExample: avgTokens,
                categoryDistribution: Object.fromEntries(categories)
            }
        };
    }

    /**
     * Exporte un dataset au format JSONL pour OpenAI
     */
    exportDataset(datasetId: string, format: 'jsonl' | 'csv' = 'jsonl'): Blob {
        const dataset = this.datasets.get(datasetId);
        if (!dataset) throw new Error('Dataset not found');

        if (format === 'jsonl') {
            const lines = dataset.examples.map(ex =>
                JSON.stringify({ messages: ex.messages })
            );
            return new Blob([lines.join('\n')], { type: 'application/jsonl' });
        } else {
            // Format CSV (simplifié)
            const headers = 'prompt,completion\n';
            const rows = dataset.examples.map(ex => {
                const userMsg = ex.messages.find(m => m.role === 'user')?.content || '';
                const assistantMsg = ex.messages.find(m => m.role === 'assistant')?.content || '';
                return `"${userMsg.replace(/"/g, '""')}","${assistantMsg.replace(/"/g, '""')}"`;
            });
            return new Blob([headers + rows.join('\n')], { type: 'text/csv' });
        }
    }

    // ============================================================================
    // FINE-TUNING JOBS
    // ============================================================================

    /**
     * Lance un job de fine-tuning
     */
    async startFineTuning(config: {
        name: string;
        provider: FineTuningProvider;
        baseModel: string;
        datasetId: string;
        hyperparameters?: {
            epochs?: number;
            batchSize?: number;
            learningRate?: number;
            validationSplit?: number;
        };
    }): Promise<FineTuningJob> {
        const dataset = this.datasets.get(config.datasetId);
        if (!dataset) throw new Error('Dataset not found');

        // Valider le dataset
        const validation = this.validateDataset(config.datasetId);
        if (!validation.valid) {
            throw new Error(`Dataset validation failed: ${validation.errors.join(', ')}`);
        }

        const job: FineTuningJob = {
            id: this.generateId(),
            name: config.name,
            provider: config.provider,
            baseModel: config.baseModel,
            datasetId: config.datasetId,
            status: 'pending',
            progress: 0,
            hyperparameters: {
                epochs: config.hyperparameters?.epochs || 3,
                batchSize: config.hyperparameters?.batchSize || 4,
                learningRate: config.hyperparameters?.learningRate || 0.0001,
                validationSplit: config.hyperparameters?.validationSplit || 0.1
            },
            metadata: {
                createdBy: 'system',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };

        this.jobs.set(job.id, job);

        // Lancer le fine-tuning selon le provider
        switch (config.provider) {
            case 'openai':
                await this.startOpenAIFineTuning(job, dataset);
                break;
            case 'anthropic':
                await this.startAnthropicFineTuning(job, dataset);
                break;
            case 'custom':
                await this.startCustomFineTuning(job, dataset);
                break;
        }

        this.saveJobs();
        return job;
    }

    /**
     * Fine-tuning OpenAI
     */
    private async startOpenAIFineTuning(
        job: FineTuningJob,
        dataset: TrainingDataset
    ): Promise<void> {
        try {
            job.status = 'running';
            job.startedAt = new Date().toISOString();

            // 1. Upload du fichier de training
            const dataBlob = this.exportDataset(dataset.id, 'jsonl');

            // Upload vers OpenAI (simulation)
            // const fileResponse = await this.uploadToOpenAI(dataBlob);

            // 2. Créer le job de fine-tuning
            // const response = await fetch('https://api.openai.com/v1/fine_tuning/jobs', {
            //   method: 'POST',
            //   headers: {
            //     'Authorization': `Bearer ${apiKey}`,
            //     'Content-Type': 'application/json'
            //   },
            //   body: JSON.stringify({
            //     training_file: fileResponse.id,
            //     model: job.baseModel,
            //     hyperparameters: {
            //       n_epochs: job.hyperparameters.epochs,
            //       batch_size: job.hyperparameters.batchSize,
            //       learning_rate_multiplier: job.hyperparameters.learningRate
            //     }
            //   })
            // });

            // Simulation du processus
            this.simulateFineTuning(job.id);

        } catch (error) {
            job.status = 'failed';
            job.error = error instanceof Error ? error.message : 'Unknown error';
            this.saveJobs();
        }
    }

    /**
     * Fine-tuning Anthropic (API future)
     */
    private async startAnthropicFineTuning(
        job: FineTuningJob,
        dataset: TrainingDataset
    ): Promise<void> {
        // Anthropic ne supporte pas encore le fine-tuning public
        // Ceci est une simulation pour l'architecture
        console.log('Anthropic fine-tuning will be available in the future');
        this.simulateFineTuning(job.id);
    }

    /**
     * Fine-tuning personnalisé
     */
    private async startCustomFineTuning(
        job: FineTuningJob,
        dataset: TrainingDataset
    ): Promise<void> {
        // Pour un backend personnalisé
        this.simulateFineTuning(job.id);
    }

    /**
     * Simule le processus de fine-tuning
     */
    private simulateFineTuning(jobId: string): void {
        const job = this.jobs.get(jobId);
        if (!job) return;

        const epochs = job.hyperparameters.epochs || 3;
        const trainingLoss: number[] = [];
        const validationLoss: number[] = [];

        let currentEpoch = 0;

        const interval = setInterval(() => {
            currentEpoch++;
            job.progress = (currentEpoch / epochs) * 100;

            // Simuler les pertes décroissantes
            const trainLoss = 2.0 - (currentEpoch / epochs) * 1.5 + Math.random() * 0.1;
            const valLoss = 2.1 - (currentEpoch / epochs) * 1.4 + Math.random() * 0.15;

            trainingLoss.push(trainLoss);
            validationLoss.push(valLoss);

            job.metrics = {
                trainingLoss,
                validationLoss,
                accuracy: 0.7 + (currentEpoch / epochs) * 0.25
            };

            if (currentEpoch >= epochs) {
                clearInterval(interval);
                job.status = 'succeeded';
                job.completedAt = new Date().toISOString();
                job.fineTunedModel = `ft-${job.baseModel}-${this.generateId()}`;
                job.cost = this.estimateFineTuningCost(job);
            }

            this.saveJobs();
        }, 2000); // Update every 2 seconds
    }

    /**
     * Récupère le statut d'un job
     */
    getJobStatus(jobId: string): FineTuningJob | undefined {
        return this.jobs.get(jobId);
    }

    /**
     * Annule un job de fine-tuning
     */
    async cancelJob(jobId: string): Promise<void> {
        const job = this.jobs.get(jobId);
        if (!job) throw new Error('Job not found');

        if (job.status !== 'running' && job.status !== 'pending') {
            throw new Error('Only running or pending jobs can be cancelled');
        }

        job.status = 'cancelled';
        job.metadata.updatedAt = new Date().toISOString();
        this.saveJobs();
    }

    // ============================================================================
    // MODEL EVALUATION
    // ============================================================================

    /**
     * Évalue un modèle fine-tuné
     */
    async evaluateModel(
        modelId: string,
        testDatasetId: string
    ): Promise<ModelEvaluation> {
        const testDataset = this.datasets.get(testDatasetId);
        if (!testDataset) throw new Error('Test dataset not found');

        const job = Array.from(this.jobs.values()).find(j => j.fineTunedModel === modelId);
        if (!job) throw new Error('Model not found');

        // Exécuter les tests
        const testResults = await this.runEvaluationTests(modelId, testDataset.examples);

        // Calculer les métriques
        const metrics = this.calculateEvaluationMetrics(testResults);

        // Comparer avec le modèle de base
        const baselineResults = await this.runEvaluationTests(job.baseModel, testDataset.examples);
        const baselineMetrics = this.calculateEvaluationMetrics(baselineResults);

        const improvement = ((metrics.accuracy - baselineMetrics.accuracy) / baselineMetrics.accuracy) * 100;

        // Générer des recommandations
        const recommendations = this.generateModelRecommendations(metrics, improvement);

        return {
            modelId,
            metrics,
            comparison: {
                baseModel: job.baseModel,
                improvement
            },
            testResults: testResults.slice(0, 10), // Top 10 examples
            recommendations
        };
    }

    /**
     * Exécute les tests d'évaluation
     */
    private async runEvaluationTests(
        modelId: string,
        examples: TrainingExample[]
    ): Promise<Array<{
        input: string;
        expected: string;
        actual: string;
        score: number;
    }>> {
        // Simulation : en réalité, on appellerait le modèle pour chaque exemple
        return examples.map(ex => {
            const userMsg = ex.messages.find(m => m.role === 'user')?.content || '';
            const expectedMsg = ex.messages.find(m => m.role === 'assistant')?.content || '';

            // Simuler une réponse (en réalité, appeler le modèle)
            const actualMsg = this.simulateModelResponse(modelId, userMsg);

            // Calculer la similarité (simplifié)
            const score = this.calculateSimilarity(expectedMsg, actualMsg);

            return {
                input: userMsg,
                expected: expectedMsg,
                actual: actualMsg,
                score
            };
        });
    }

    /**
     * Simule une réponse du modèle
     */
    private simulateModelResponse(modelId: string, input: string): string {
        // Simulation : retourner une variation de l'input
        return `Model response for: ${input}`;
    }

    /**
     * Calcule la similarité entre deux textes
     */
    private calculateSimilarity(text1: string, text2: string): number {
        // Implémentation simplifiée (en réalité, utiliser BLEU, ROUGE, ou embeddings)
        const words1 = new Set(text1.toLowerCase().split(/\s+/));
        const words2 = new Set(text2.toLowerCase().split(/\s+/));

        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);

        return union.size > 0 ? intersection.size / union.size : 0;
    }

    /**
     * Calcule les métriques d'évaluation
     */
    private calculateEvaluationMetrics(testResults: any[]): {
        accuracy: number;
        precision: number;
        recall: number;
        f1Score: number;
        perplexity: number;
    } {
        const avgScore = testResults.reduce((sum, r) => sum + r.score, 0) / testResults.length;

        // Calculer précision et rappel (simplifié)
        const truePositives = testResults.filter(r => r.score > 0.7).length;
        const falsePositives = testResults.filter(r => r.score > 0.7 && r.score < 0.9).length;
        const falseNegatives = testResults.filter(r => r.score < 0.7).length;

        const precision = truePositives / (truePositives + falsePositives) || 0;
        const recall = truePositives / (truePositives + falseNegatives) || 0;
        const f1Score = precision + recall > 0
            ? 2 * (precision * recall) / (precision + recall)
            : 0;

        return {
            accuracy: avgScore,
            precision,
            recall,
            f1Score,
            perplexity: 1 / avgScore // Simplifié
        };
    }

    /**
     * Génère des recommandations
     */
    private generateModelRecommendations(
        metrics: any,
        improvement: number
    ): string[] {
        const recommendations: string[] = [];

        if (improvement < 5) {
            recommendations.push('Model shows minimal improvement. Consider increasing dataset size or adjusting hyperparameters.');
        }

        if (metrics.accuracy < 0.7) {
            recommendations.push('Accuracy is below 70%. Review training data quality and increase dataset diversity.');
        }

        if (metrics.precision < 0.8) {
            recommendations.push('Precision could be improved. Consider filtering low-quality training examples.');
        }

        if (improvement > 20) {
            recommendations.push('Excellent improvement! This model is ready for production use.');
        }

        return recommendations;
    }

    /**
     * Estime le coût du fine-tuning
     */
    private estimateFineTuningCost(job: FineTuningJob): number {
        const dataset = this.datasets.get(job.datasetId);
        if (!dataset) return 0;

        // Coûts approximatifs (OpenAI pricing 2024)
        const costPerToken = 0.008 / 1000; // $0.008 per 1K tokens
        const avgTokensPerExample = 100;
        const totalTokens = dataset.size * avgTokensPerExample * (job.hyperparameters.epochs || 3);

        return totalTokens * costPerToken;
    }

    // ============================================================================
    // UTILITIES
    // ============================================================================

    /**
     * Récupère des exemples depuis l'historique
     */
    private async fetchHistoricalExamples(
        filters?: any,
        maxExamples?: number
    ): Promise<TrainingExample[]> {
        // Simulation : en réalité, récupérer depuis AIPersistenceService
        const examples: TrainingExample[] = [];

        for (let i = 0; i < (maxExamples || 50); i++) {
            examples.push({
                id: this.generateId(),
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful website builder assistant.'
                    },
                    {
                        role: 'user',
                        content: `Generate content for a ${i % 2 === 0 ? 'hero' : 'features'} section`
                    },
                    {
                        role: 'assistant',
                        content: `Here's a great ${i % 2 === 0 ? 'hero' : 'features'} section...`
                    }
                ],
                metadata: {
                    category: i % 2 === 0 ? 'hero' : 'features',
                    rating: 4 + Math.random(),
                    tokens: 100 + Math.floor(Math.random() * 200)
                }
            });
        }

        return examples;
    }

    /**
     * Liste tous les datasets
     */
    getAllDatasets(): TrainingDataset[] {
        return Array.from(this.datasets.values()).sort((a, b) =>
            new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
        );
    }

    /**
     * Liste tous les jobs
     */
    getAllJobs(filter?: { status?: FineTuningJob['status'] }): FineTuningJob[] {
        let jobs = Array.from(this.jobs.values());

        if (filter?.status) {
            jobs = jobs.filter(j => j.status === filter.status);
        }

        return jobs.sort((a, b) =>
            new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
        );
    }

    /**
     * Persistence
     */
    private loadData(): void {
        try {
            const datasets = localStorage.getItem('ft_datasets');
            if (datasets) {
                this.datasets = new Map(Object.entries(JSON.parse(datasets)));
            }

            const jobs = localStorage.getItem('ft_jobs');
            if (jobs) {
                this.jobs = new Map(Object.entries(JSON.parse(jobs)));
            }
        } catch (error) {
            console.error('Failed to load fine-tuning data:', error);
        }
    }

    private saveDatasets(): void {
        try {
            const data = Object.fromEntries(this.datasets);
            localStorage.setItem('ft_datasets', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save datasets:', error);
        }
    }

    private saveJobs(): void {
        try {
            const data = Object.fromEntries(this.jobs);
            localStorage.setItem('ft_jobs', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save jobs:', error);
        }
    }

    private generateId(): string {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

export default FineTuningService;
