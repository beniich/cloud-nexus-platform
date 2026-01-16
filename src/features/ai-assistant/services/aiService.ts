import { cryptoService } from '../../../lib/crypto/encryption';
import { AIMessage } from '../types/ai.types';

class AIService {
    private readonly API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:3002/api/ai'; // Fallback
    private conversationHistory: Map<string, AIMessage[]> = new Map();

    // Rate limiting
    private requestCount: Map<string, number> = new Map();
    private readonly MAX_REQUESTS_PER_MINUTE = 10;

    // Session Crypto Key
    private sessionKey: CryptoKey | null = null;

    async initSession() {
        if (!this.sessionKey) {
            this.sessionKey = await cryptoService.generateKey();
        }
    }

    /**
     * Envoie une requête IA de manière sécurisée
     */
    async sendMessage(
        message: string,
        conversationId: string,
        context?: string
    ): Promise<AIMessage> {
        // 1. Validation et sanitisation
        const sanitizedMessage = this.sanitizeInput(message);

        // 2. Vérification du rate limiting
        if (!this.checkRateLimit(conversationId)) {
            throw new Error('Limite de requêtes atteinte. Réessayez dans 1 minute.');
        }

        // 3. Vérification des permissions
        await this.checkPermissions(context);

        // 4. Filtrage du contenu sensible
        const filteredMessage = this.filterSensitiveData(sanitizedMessage);

        // Initialiser crypto si besoin
        if (!this.sessionKey) await this.initSession();

        // 5. Chiffrement de la requête
        const payload = JSON.stringify({
            message: filteredMessage,
            conversationId,
            context,
            timestamp: new Date().toISOString()
        });

        // Mock Encryption if no backend handshake (Simulation for client-side structure)
        // In real flow: Handshake first -> get Shared Key -> Encrypt
        // Here we use our local key to simulate the process
        const encryptedPayload = await cryptoService.encrypt(payload, this.sessionKey!);

        try {
            // 6. Appel API sécurisé
            // Note: En mode Mock, on intercepte ici
            if (import.meta.env.VITE_ENABLE_MOCK === 'true') {
                return await this.mockResponse(filteredMessage, conversationId);
            }

            const response = await fetch(`${this.API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Request-ID': crypto.randomUUID(),
                    'X-CSRF-Token': this.getCsrfToken(),
                },
                credentials: 'include', // Pour les cookies httpOnly
                body: JSON.stringify({ data: encryptedPayload })
            });

            if (!response.ok) {
                throw new Error(`Erreur IA: ${response.status}`);
            }

            const encryptedResponse = await response.json();
            // Decrypt response
            const decryptedData = await cryptoService.decrypt(encryptedResponse.data, this.sessionKey!);
            const aiResponse: AIMessage = JSON.parse(decryptedData);

            // 7. Validation de la réponse
            this.validateAIResponse(aiResponse);

            // 8. Sauvegarde sécurisée de l'historique
            this.saveToHistory(conversationId, aiResponse);

            return aiResponse;
        } catch (error: any) {
            // 9. Logging sécurisé (sans données sensibles)
            this.logError('ai_request_failed', { conversationId, error: error.message });
            throw error;
        }
    }

    /**
     * Sanitisation des entrées utilisateur
     */
    private sanitizeInput(input: string): string {
        // Suppression des caractères dangereux
        let sanitized = input
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .trim();

        // Limitation de longueur
        const MAX_LENGTH = 4000;
        if (sanitized.length > MAX_LENGTH) {
            sanitized = sanitized.substring(0, MAX_LENGTH);
        }

        return sanitized;
    }

    /**
     * Filtrage des données sensibles avant envoi à l'IA
     */
    private filterSensitiveData(message: string): string {
        const patterns = [
            /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // CB
            /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
            /password[:\s]*[^\s]+/gi // Passwords
        ];

        let filtered = message;
        patterns.forEach(pattern => {
            filtered = filtered.replace(pattern, '[DONNÉES_MASQUÉES]');
        });

        return filtered;
    }

    /**
     * Rate limiting par utilisateur
     */
    private checkRateLimit(userId: string): boolean {
        const now = Date.now();
        const key = `${userId}-${Math.floor(now / 60000)}`; // Par minute

        const count = this.requestCount.get(key) || 0;

        if (count >= this.MAX_REQUESTS_PER_MINUTE) {
            return false;
        }

        this.requestCount.set(key, count + 1);

        // Nettoyage des anciennes entrées
        setTimeout(() => this.requestCount.delete(key), 60000);

        return true;
    }

    /**
     * Validation de la réponse IA
     */
    private validateAIResponse(response: any): void {
        if (!response || typeof response.content !== 'string') {
            throw new Error('Réponse IA invalide');
        }

        // Vérifier qu'il n'y a pas de contenu malveillant dans la réponse
        if (this.containsMaliciousContent(response.content)) {
            throw new Error('Réponse IA rejetée pour raisons de sécurité');
        }
    }

    /**
     * Détection de contenu malveillant
     */
    private containsMaliciousContent(content: string): boolean {
        const maliciousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i, // onclick, onerror, etc.
            /<iframe/i,
            /eval\(/i
        ];

        return maliciousPatterns.some(pattern => pattern.test(content));
    }

    /**
     * Vérification des permissions
     */
    private async checkPermissions(context?: string): Promise<void> {
        // Implémenter selon votre système de permissions
        // const requiredPermission = `ai:use:${context || 'general'}`;
        // TODO: Connect to permissionSystem
        return;
    }

    private getCsrfToken(): string {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta?.getAttribute('content') || '';
    }

    private logError(type: string, details: any): void {
        console.error(`[AI Security] ${type}`, {
            timestamp: new Date().toISOString(),
            ...details
        });
    }

    private saveToHistory(conversationId: string, message: AIMessage): void {
        const history = this.conversationHistory.get(conversationId) || [];
        history.push(message);

        // Limiter l'historique à 100 messages
        if (history.length > 100) {
            history.shift();
        }

        this.conversationHistory.set(conversationId, history);
    }

    // --- MOCK RESPONSE GENERATOR ---
    private async mockResponse(message: string, conversationId: string): Promise<AIMessage> {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Latency

        const mockMsg: AIMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `[MOCK AI] J'ai bien reçu votre message sécurisé : "${message.substring(0, 20)}..."`,
            timestamp: new Date(),
            metadata: { model: 'mock-gpt-4', confidence: 0.99 }
        };

        this.saveToHistory(conversationId, mockMsg);
        return mockMsg;
    }
}

export const aiService = new AIService();
