/**
 * Service d'intégration réelle des APIs d'IA
 * Supporte Claude (Anthropic), ChatGPT (OpenAI), Gemini (Google), et Veo 2
 */

export type AIProvider = 'claude' | 'gpt' | 'gemini' | 'veo';

export interface APIConfig {
    provider: AIProvider;
    apiKey: string;
    model: string;
    endpoint?: string;
}

export interface APIRequest {
    prompt: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
    metadata?: Record<string, any>;
}

export interface APIResponse {
    content: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    model: string;
    provider: AIProvider;
    latency: number;
    cached?: boolean;
}

export class AIAPIIntegration {
    private config: APIConfig;
    private cache: Map<string, { response: APIResponse; timestamp: number }>;
    private cacheDuration = 3600000; // 1 heure

    constructor(config: APIConfig) {
        this.config = config;
        this.cache = new Map();
    }

    /**
     * Appel universel à l'API selon le provider
     */
    async call(request: APIRequest): Promise<APIResponse> {
        const startTime = Date.now();

        // Vérifier le cache
        const cacheKey = this.getCacheKey(request);
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            return { ...cached, cached: true };
        }

        let response: APIResponse;

        switch (this.config.provider) {
            case 'claude':
                response = await this.callClaude(request);
                break;
            case 'gpt':
                response = await this.callOpenAI(request);
                break;
            case 'gemini':
                response = await this.callGemini(request);
                break;
            case 'veo':
                response = await this.callVeo(request);
                break;
            default:
                throw new Error(`Unsupported provider: ${this.config.provider}`);
        }

        response.latency = Date.now() - startTime;
        response.cached = false;

        // Mettre en cache
        this.cache.set(cacheKey, {
            response,
            timestamp: Date.now()
        });

        return response;
    }

    /**
     * Appel à l'API Claude (Anthropic)
     */
    private async callClaude(request: APIRequest): Promise<APIResponse> {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.config.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.config.model,
                max_tokens: request.maxTokens || 4000,
                temperature: request.temperature || 0.7,
                messages: [
                    ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
                    { role: 'user', content: request.prompt }
                ],
                stop_sequences: request.stopSequences
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Claude API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();

        return {
            content: data.content[0].text,
            usage: {
                promptTokens: data.usage.input_tokens,
                completionTokens: data.usage.output_tokens,
                totalTokens: data.usage.input_tokens + data.usage.output_tokens
            },
            model: data.model,
            provider: 'claude',
            latency: 0
        };
    }

    /**
     * Appel à l'API OpenAI (ChatGPT)
     */
    private async callOpenAI(request: APIRequest): Promise<APIResponse> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: [
                    ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
                    { role: 'user', content: request.prompt }
                ],
                temperature: request.temperature || 0.7,
                max_tokens: request.maxTokens || 4000,
                stop: request.stopSequences
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();

        return {
            content: data.choices[0].message.content,
            usage: {
                promptTokens: data.usage.prompt_tokens,
                completionTokens: data.usage.completion_tokens,
                totalTokens: data.usage.total_tokens
            },
            model: data.model,
            provider: 'gpt',
            latency: 0
        };
    }

    /**
     * Appel à l'API Google Gemini
     */
    private async callGemini(request: APIRequest): Promise<APIResponse> {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: request.systemPrompt
                                        ? `${request.systemPrompt}\n\n${request.prompt}`
                                        : request.prompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: request.temperature || 0.7,
                        maxOutputTokens: request.maxTokens || 4000,
                        stopSequences: request.stopSequences
                    }
                })
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();

        return {
            content: data.candidates[0].content.parts[0].text,
            usage: {
                promptTokens: data.usageMetadata?.promptTokenCount || 0,
                completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
                totalTokens: data.usageMetadata?.totalTokenCount || 0
            },
            model: this.config.model,
            provider: 'gemini',
            latency: 0
        };
    }

    /**
     * Appel à l'API Veo 2 (Google - Video Generation)
     * Note: Veo 2 est principalement pour la génération vidéo
     */
    private async callVeo(request: APIRequest): Promise<APIResponse> {
        // Veo 2 API (exemple - l'API réelle peut différer)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/veo-2:generate?key=${this.config.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: request.prompt,
                    ...request.metadata
                })
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Veo API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();

        return {
            content: data.result || data.output || '',
            usage: {
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0
            },
            model: this.config.model,
            provider: 'veo',
            latency: 0
        };
    }

    /**
     * Streaming support pour réponses progressives
     */
    async *callStream(request: APIRequest): AsyncGenerator<string> {
        switch (this.config.provider) {
            case 'claude':
                yield* this.streamClaude(request);
                break;
            case 'gpt':
                yield* this.streamOpenAI(request);
                break;
            case 'gemini':
                yield* this.streamGemini(request);
                break;
            default:
                throw new Error(`Streaming not supported for ${this.config.provider}`);
        }
    }

    /**
     * Stream Claude
     */
    private async *streamClaude(request: APIRequest): AsyncGenerator<string> {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.config.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.config.model,
                max_tokens: request.maxTokens || 4000,
                temperature: request.temperature || 0.7,
                messages: [{ role: 'user', content: request.prompt }],
                stream: true
            })
        });

        if (!response.body) throw new Error('No response body');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = JSON.parse(line.slice(6));
                    if (data.type === 'content_block_delta') {
                        yield data.delta.text;
                    }
                }
            }
        }
    }

    /**
     * Stream OpenAI
     */
    private async *streamOpenAI(request: APIRequest): AsyncGenerator<string> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: [{ role: 'user', content: request.prompt }],
                temperature: request.temperature || 0.7,
                max_tokens: request.maxTokens || 4000,
                stream: true
            })
        });

        if (!response.body) throw new Error('No response body');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') break;

                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content;
                        if (content) yield content;
                    } catch (e) {
                        // Ignore parsing errors
                    }
                }
            }
        }
    }

    /**
     * Stream Gemini
     */
    private async *streamGemini(request: APIRequest): AsyncGenerator<string> {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:streamGenerateContent?key=${this.config.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: request.prompt }] }],
                    generationConfig: {
                        temperature: request.temperature || 0.7,
                        maxOutputTokens: request.maxTokens || 4000
                    }
                })
            }
        );

        if (!response.body) throw new Error('No response body');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            try {
                const data = JSON.parse(chunk);
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) yield text;
            } catch (e) {
                // Ignore parsing errors
            }
        }
    }

    /**
     * Batch processing pour plusieurs requêtes
     */
    async callBatch(requests: APIRequest[]): Promise<APIResponse[]> {
        return Promise.all(requests.map(req => this.call(req)));
    }

    /**
     * Gestion du cache
     */
    private getCacheKey(request: APIRequest): string {
        return `${this.config.provider}-${this.config.model}-${JSON.stringify(request)}`;
    }

    private getFromCache(key: string): APIResponse | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const age = Date.now() - cached.timestamp;
        if (age > this.cacheDuration) {
            this.cache.delete(key);
            return null;
        }

        return cached.response;
    }

    /**
     * Nettoyage du cache
     */
    clearCache(): void {
        this.cache.clear();
    }

    /**
     * Statistiques du cache
     */
    getCacheStats(): {
        size: number;
        hitRate: number;
        avgAge: number;
    } {
        const now = Date.now();
        let totalAge = 0;

        this.cache.forEach(({ timestamp }) => {
            totalAge += now - timestamp;
        });

        return {
            size: this.cache.size,
            hitRate: 0, // À implémenter avec un compteur
            avgAge: this.cache.size > 0 ? totalAge / this.cache.size : 0
        };
    }

    /**
     * Change le provider à la volée
     */
    updateConfig(config: Partial<APIConfig>): void {
        this.config = { ...this.config, ...config };
        this.clearCache(); // Clear cache lors du changement de config
    }

    /**
     * Validation de la clé API
     */
    async validateAPIKey(): Promise<boolean> {
        try {
            await this.call({
                prompt: 'Hello',
                maxTokens: 10
            });
            return true;
        } catch (error) {
            console.error('API key validation failed:', error);
            return false;
        }
    }

    /**
     * Estimation du coût
     */
    estimateCost(tokens: number): number {
        // Prix approximatifs par 1M tokens (à jour en 2024)
        const pricing: Record<AIProvider, { input: number; output: number }> = {
            claude: { input: 3.0, output: 15.0 },
            gpt: { input: 10.0, output: 30.0 },
            gemini: { input: 0.5, output: 1.5 },
            veo: { input: 0, output: 0 } // Pricing différent pour vidéo
        };

        const rates = pricing[this.config.provider];
        return (tokens / 1000000) * ((rates.input + rates.output) / 2);
    }
}

export default AIAPIIntegration;
