/**
 * Service de persistance pour les préférences AI et l'historique
 * Supporte localStorage, IndexedDB, et API backend
 */

export interface AIPreferences {
    userId: string;
    defaultProvider: 'claude' | 'gpt' | 'gemini' | 'veo';
    defaultModel: string;
    temperature: number;
    maxTokens: number;
    favoritePrompts: string[];
    customInstructions?: string;
    apiKeys: Partial<Record<'claude' | 'gpt' | 'gemini' | 'veo', string>>;
    lastUpdated: string;
}

export interface GenerationHistory {
    id: string;
    userId: string;
    type: 'site-generation' | 'content-generation' | 'content-improvement' | 'chat';
    provider: string;
    model: string;
    input: {
        prompt: string;
        context?: any;
    };
    output: {
        content: string;
        metadata?: any;
    };
    feedback?: 'positive' | 'negative';
    feedbackComment?: string;
    tokens: {
        input: number;
        output: number;
        total: number;
    };
    cost: number;
    timestamp: string;
    tags?: string[];
}

export interface PromptTemplate {
    id: string;
    userId: string;
    name: string;
    description: string;
    category: string;
    template: string;
    variables: string[];
    isPublic: boolean;
    usageCount: number;
    avgRating: number;
    createdAt: string;
    updatedAt: string;
}

export type StorageBackend = 'localStorage' | 'indexedDB' | 'api';

export class AIPersistenceService {
    private backend: StorageBackend;
    private dbName = 'ai_site_builder';
    private dbVersion = 1;
    private db?: IDBDatabase;

    constructor(backend: StorageBackend = 'indexedDB') {
        this.backend = backend;
        if (backend === 'indexedDB') {
            this.initIndexedDB();
        }
    }

    // ============================================================================
    // PREFERENCES
    // ============================================================================

    /**
     * Sauvegarde les préférences utilisateur
     */
    async savePreferences(preferences: AIPreferences): Promise<void> {
        preferences.lastUpdated = new Date().toISOString();

        switch (this.backend) {
            case 'localStorage':
                localStorage.setItem(
                    `ai_preferences_${preferences.userId}`,
                    JSON.stringify(preferences)
                );
                break;

            case 'indexedDB':
                await this.indexedDBPut('preferences', preferences);
                break;

            case 'api':
                await this.apiPost('/api/ai/preferences', preferences);
                break;
        }
    }

    /**
     * Récupère les préférences utilisateur
     */
    async getPreferences(userId: string): Promise<AIPreferences | null> {
        switch (this.backend) {
            case 'localStorage':
                const stored = localStorage.getItem(`ai_preferences_${userId}`);
                return stored ? JSON.parse(stored) : null;

            case 'indexedDB':
                return await this.indexedDBGet('preferences', userId);

            case 'api':
                return await this.apiFetch(`/api/ai/preferences/${userId}`);

            default:
                return null;
        }
    }

    /**
     * Met à jour une clé API
     */
    async updateAPIKey(
        userId: string,
        provider: 'claude' | 'gpt' | 'gemini' | 'veo',
        apiKey: string
    ): Promise<void> {
        const prefs = await this.getPreferences(userId);
        if (!prefs) throw new Error('Preferences not found');

        prefs.apiKeys = prefs.apiKeys || {};
        prefs.apiKeys[provider] = apiKey;

        await this.savePreferences(prefs);
    }

    // ============================================================================
    // HISTORY
    // ============================================================================

    /**
     * Ajoute une entrée à l'historique
     */
    async addToHistory(entry: Omit<GenerationHistory, 'id'>): Promise<GenerationHistory> {
        const newEntry: GenerationHistory = {
            ...entry,
            id: this.generateId(),
        };

        switch (this.backend) {
            case 'localStorage':
                const history = this.getLocalStorageHistory(entry.userId);
                history.push(newEntry);
                localStorage.setItem(
                    `ai_history_${entry.userId}`,
                    JSON.stringify(history)
                );
                break;

            case 'indexedDB':
                await this.indexedDBPut('history', newEntry);
                break;

            case 'api':
                await this.apiPost('/api/ai/history', newEntry);
                break;
        }

        return newEntry;
    }

    /**
     * Récupère l'historique complet
     */
    async getHistory(
        userId: string,
        filters?: {
            type?: GenerationHistory['type'];
            provider?: string;
            startDate?: string;
            endDate?: string;
            limit?: number;
        }
    ): Promise<GenerationHistory[]> {
        let history: GenerationHistory[] = [];

        switch (this.backend) {
            case 'localStorage':
                history = this.getLocalStorageHistory(userId);
                break;

            case 'indexedDB':
                history = await this.indexedDBGetAll('history', userId);
                break;

            case 'api':
                const params = new URLSearchParams(filters as any);
                history = await this.apiFetch(`/api/ai/history/${userId}?${params}`);
                break;
        }

        // Filtrer localement si nécessaire
        if (filters) {
            if (filters.type) {
                history = history.filter(h => h.type === filters.type);
            }
            if (filters.provider) {
                history = history.filter(h => h.provider === filters.provider);
            }
            if (filters.startDate) {
                history = history.filter(h => h.timestamp >= filters.startDate!);
            }
            if (filters.endDate) {
                history = history.filter(h => h.timestamp <= filters.endDate!);
            }
            if (filters.limit) {
                history = history.slice(0, filters.limit);
            }
        }

        return history.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }

    /**
     * Met à jour le feedback d'une entrée
     */
    async updateFeedback(
        entryId: string,
        feedback: 'positive' | 'negative',
        comment?: string
    ): Promise<void> {
        switch (this.backend) {
            case 'localStorage':
                // Récupérer toutes les entrées, trouver et mettre à jour
                const allHistory = Object.keys(localStorage)
                    .filter(key => key.startsWith('ai_history_'))
                    .flatMap(key => JSON.parse(localStorage.getItem(key) || '[]'));

                const entry = allHistory.find(h => h.id === entryId);
                if (entry) {
                    entry.feedback = feedback;
                    entry.feedbackComment = comment;
                    // Sauvegarder à nouveau
                    const userId = entry.userId;
                    const userHistory = allHistory.filter(h => h.userId === userId);
                    localStorage.setItem(
                        `ai_history_${userId}`,
                        JSON.stringify(userHistory)
                    );
                }
                break;

            case 'indexedDB':
                const idbEntry = await this.indexedDBGetById('history', entryId);
                if (idbEntry) {
                    idbEntry.feedback = feedback;
                    idbEntry.feedbackComment = comment;
                    await this.indexedDBPut('history', idbEntry);
                }
                break;

            case 'api':
                await this.apiPatch(`/api/ai/history/${entryId}`, {
                    feedback,
                    feedbackComment: comment
                });
                break;
        }
    }

    /**
     * Supprime l'historique
     */
    async clearHistory(userId: string): Promise<void> {
        switch (this.backend) {
            case 'localStorage':
                localStorage.removeItem(`ai_history_${userId}`);
                break;

            case 'indexedDB':
                await this.indexedDBClear('history', userId);
                break;

            case 'api':
                await this.apiDelete(`/api/ai/history/${userId}`);
                break;
        }
    }

    // ============================================================================
    // PROMPT TEMPLATES
    // ============================================================================

    /**
     * Sauvegarde un template de prompt
     */
    async savePromptTemplate(template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<PromptTemplate> {
        const newTemplate: PromptTemplate = {
            ...template,
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        switch (this.backend) {
            case 'localStorage':
                const templates = this.getLocalStorageTemplates();
                templates.push(newTemplate);
                localStorage.setItem('ai_prompt_templates', JSON.stringify(templates));
                break;

            case 'indexedDB':
                await this.indexedDBPut('templates', newTemplate);
                break;

            case 'api':
                await this.apiPost('/api/ai/templates', newTemplate);
                break;
        }

        return newTemplate;
    }

    /**
     * Récupère les templates de prompts
     */
    async getPromptTemplates(
        userId: string,
        includePublic: boolean = true
    ): Promise<PromptTemplate[]> {
        let templates: PromptTemplate[] = [];

        switch (this.backend) {
            case 'localStorage':
                templates = this.getLocalStorageTemplates();
                break;

            case 'indexedDB':
                templates = await this.indexedDBGetAll('templates');
                break;

            case 'api':
                templates = await this.apiFetch(
                    `/api/ai/templates?userId=${userId}&includePublic=${includePublic}`
                );
                break;
        }

        return templates.filter(
            t => t.userId === userId || (includePublic && t.isPublic)
        );
    }

    /**
     * Met à jour un template
     */
    async updatePromptTemplate(
        templateId: string,
        updates: Partial<PromptTemplate>
    ): Promise<void> {
        updates.updatedAt = new Date().toISOString();

        switch (this.backend) {
            case 'localStorage':
                const templates = this.getLocalStorageTemplates();
                const index = templates.findIndex(t => t.id === templateId);
                if (index >= 0) {
                    templates[index] = { ...templates[index], ...updates };
                    localStorage.setItem('ai_prompt_templates', JSON.stringify(templates));
                }
                break;

            case 'indexedDB':
                const template = await this.indexedDBGetById('templates', templateId);
                if (template) {
                    Object.assign(template, updates);
                    await this.indexedDBPut('templates', template);
                }
                break;

            case 'api':
                await this.apiPatch(`/api/ai/templates/${templateId}`, updates);
                break;
        }
    }

    // ============================================================================
    // STATISTICS
    // ============================================================================

    /**
     * Calcule les statistiques d'utilisation
     */
    async getUsageStats(userId: string, period: { start: string; end: string }): Promise<{
        totalGenerations: number;
        totalTokens: number;
        totalCost: number;
        byProvider: Record<string, { count: number; tokens: number; cost: number }>;
        byType: Record<string, number>;
        avgResponseTime: number;
    }> {
        const history = await this.getHistory(userId, {
            startDate: period.start,
            endDate: period.end
        });

        const stats = {
            totalGenerations: history.length,
            totalTokens: 0,
            totalCost: 0,
            byProvider: {} as Record<string, any>,
            byType: {} as Record<string, number>,
            avgResponseTime: 0
        };

        history.forEach(entry => {
            stats.totalTokens += entry.tokens.total;
            stats.totalCost += entry.cost;

            // Par provider
            if (!stats.byProvider[entry.provider]) {
                stats.byProvider[entry.provider] = { count: 0, tokens: 0, cost: 0 };
            }
            stats.byProvider[entry.provider].count++;
            stats.byProvider[entry.provider].tokens += entry.tokens.total;
            stats.byProvider[entry.provider].cost += entry.cost;

            // Par type
            stats.byType[entry.type] = (stats.byType[entry.type] || 0) + 1;
        });

        return stats;
    }

    // ============================================================================
    // INDEXEDDB HELPERS
    // ============================================================================

    private async initIndexedDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Store pour les préférences
                if (!db.objectStoreNames.contains('preferences')) {
                    const prefStore = db.createObjectStore('preferences', { keyPath: 'userId' });
                    prefStore.createIndex('lastUpdated', 'lastUpdated');
                }

                // Store pour l'historique
                if (!db.objectStoreNames.contains('history')) {
                    const historyStore = db.createObjectStore('history', { keyPath: 'id' });
                    historyStore.createIndex('userId', 'userId');
                    historyStore.createIndex('timestamp', 'timestamp');
                    historyStore.createIndex('type', 'type');
                }

                // Store pour les templates
                if (!db.objectStoreNames.contains('templates')) {
                    const templateStore = db.createObjectStore('templates', { keyPath: 'id' });
                    templateStore.createIndex('userId', 'userId');
                    templateStore.createIndex('category', 'category');
                    templateStore.createIndex('isPublic', 'isPublic');
                }
            };
        });
    }

    private async indexedDBPut(storeName: string, data: any): Promise<void> {
        if (!this.db) await this.initIndexedDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    private async indexedDBGet(storeName: string, key: string): Promise<any> {
        if (!this.db) await this.initIndexedDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    private async indexedDBGetById(storeName: string, id: string): Promise<any> {
        if (!this.db) await this.initIndexedDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    private async indexedDBGetAll(storeName: string, indexValue?: string): Promise<any[]> {
        if (!this.db) await this.initIndexedDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);

            const request = indexValue
                ? store.index('userId').getAll(indexValue)
                : store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    private async indexedDBClear(storeName: string, userId?: string): Promise<void> {
        if (!this.db) await this.initIndexedDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);

            if (userId) {
                const index = store.index('userId');
                const request = index.openCursor(IDBKeyRange.only(userId));

                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest).result;
                    if (cursor) {
                        cursor.delete();
                        cursor.continue();
                    } else {
                        resolve();
                    }
                };
                request.onerror = () => reject(request.error);
            } else {
                const request = store.clear();
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            }
        });
    }

    // ============================================================================
    // LOCALSTORAGE HELPERS
    // ============================================================================

    private getLocalStorageHistory(userId: string): GenerationHistory[] {
        const stored = localStorage.getItem(`ai_history_${userId}`);
        return stored ? JSON.parse(stored) : [];
    }

    private getLocalStorageTemplates(): PromptTemplate[] {
        const stored = localStorage.getItem('ai_prompt_templates');
        return stored ? JSON.parse(stored) : [];
    }

    // ============================================================================
    // API HELPERS
    // ============================================================================

    private async apiFetch(url: string): Promise<any> {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.getAuthToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return response.json();
    }

    private async apiPost(url: string, data: any): Promise<any> {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return response.json();
    }

    private async apiPatch(url: string, data: any): Promise<any> {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return response.json();
    }

    private async apiDelete(url: string): Promise<void> {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.getAuthToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
    }

    private getAuthToken(): string {
        // Récupérer le token d'authentification
        return localStorage.getItem('auth_token') || '';
    }

    // ============================================================================
    // UTILITIES
    // ============================================================================

    private generateId(): string {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Export des données utilisateur
     */
    async exportUserData(userId: string): Promise<Blob> {
        const data = {
            preferences: await this.getPreferences(userId),
            history: await this.getHistory(userId),
            templates: await this.getPromptTemplates(userId, false)
        };

        return new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
    }

    /**
     * Import des données utilisateur
     */
    async importUserData(userId: string, data: any): Promise<void> {
        if (data.preferences) {
            data.preferences.userId = userId;
            await this.savePreferences(data.preferences);
        }

        if (data.history) {
            for (const entry of data.history) {
                entry.userId = userId;
                await this.addToHistory(entry);
            }
        }

        if (data.templates) {
            for (const template of data.templates) {
                template.userId = userId;
                await this.savePromptTemplate(template);
            }
        }
    }
}

export default AIPersistenceService;
