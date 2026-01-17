// src/services/ai/ai-assistant.ts

import type {
    AIAssistantMessage,
    AICommand,
    AIAction,
    AssistantContext,
    AIServiceConfig
} from '../../types/ai.types';

/**
 * Assistant IA conversationnel pour l'éditeur de site
 */
export class AIAssistant {
    private config: AIServiceConfig;
    private context: AssistantContext;

    constructor(context: AssistantContext, config?: Partial<AIServiceConfig>) {
        this.context = context;
        this.config = {
            provider: 'anthropic',
            model: 'claude-sonnet-4-20250514',
            temperature: 0.7,
            maxTokens: 2000,
            ...config
        };
    }

    /**
     * Traite un message utilisateur et retourne une réponse + action
     */
    async processMessage(userMessage: string): Promise<AIAssistantMessage> {
        // Ajouter le message utilisateur à l'historique
        const userMsg: AIAssistantMessage = {
            id: this.generateId(),
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        };

        this.context.conversationHistory.push(userMsg);

        // Analyser l'intention de l'utilisateur
        const command = await this.parseIntent(userMessage);

        // Générer une action si nécessaire
        let action: AIAction | undefined;
        if (command.intent !== 'question') {
            action = await this.generateAction(command);
        }

        // Générer la réponse de l'assistant
        const response = await this.generateResponse(userMessage, command, action);

        const assistantMsg: AIAssistantMessage = {
            id: this.generateId(),
            role: 'assistant',
            content: response,
            timestamp: new Date().toISOString(),
            action
        };

        this.context.conversationHistory.push(assistantMsg);

        return assistantMsg;
    }

    /**
     * Parse l'intention de l'utilisateur
     */
    private async parseIntent(message: string): Promise<AICommand> {
        const prompt = `Analyze this user request for a website editor and extract the intent.

Current site context:
- Name: ${this.context.currentSite.name}
- Sections: ${this.context.currentSite.sections.map(s => s.type).join(', ')}

User message: "${message}"

Return ONLY a JSON object:
{
  "intent": "add|modify|delete|change|improve|question",
  "entity": "section|theme|content|layout|seo",
  "details": {
    "sectionType": "hero|features|etc (if applicable)",
    "property": "color|text|etc (if applicable)",
    "value": "new value (if applicable)"
  },
  "confidence": 0.0-1.0
}

Examples:
- "Add a pricing section" -> intent: add, entity: section, details: {sectionType: "pricing"}
- "Change the primary color to blue" -> intent: change, entity: theme, details: {property: "primary", value: "blue"}
- "Make the hero text more engaging" -> intent: improve, entity: content, details: {sectionType: "hero"}`;

        const response = await this.callAI(prompt);
        return this.parseJSON(response);
    }

    /**
     * Génère une action à exécuter
     */
    private async generateAction(command: AICommand): Promise<AIAction | undefined> {
        if (command.confidence < 0.6) {
            return undefined;
        }

        switch (command.intent) {
            case 'add':
                if (command.entity === 'section') {
                    return await this.createAddSectionAction(command.details);
                }
                break;

            case 'modify':
            case 'change':
                if (command.entity === 'theme') {
                    return this.createChangeThemeAction(command.details);
                } else if (command.entity === 'section') {
                    return this.createModifySectionAction(command.details);
                }
                break;

            case 'delete':
                if (command.entity === 'section') {
                    return this.createDeleteSectionAction(command.details);
                }
                break;

            case 'improve':
                if (command.entity === 'content') {
                    return await this.createImproveContentAction(command.details);
                }
                break;
        }

        return undefined;
    }

    /**
     * Crée une action d'ajout de section
     */
    private async createAddSectionAction(details: any): Promise<AIAction> {
        const sectionType = details.sectionType || 'features';

        // Générer le contenu initial de la section avec l'IA
        const content = await this.generateSectionContent(sectionType);

        return {
            type: 'add_section',
            data: {
                type: sectionType,
                order: this.context.currentSite.sections.length,
                content
            },
            description: `Adding a ${sectionType} section`
        };
    }

    /**
     * Crée une action de changement de thème
     */
    private createChangeThemeAction(details: any): AIAction {
        const { property, value } = details;

        return {
            type: 'change_theme',
            data: {
                property,
                value: this.normalizeColorValue(value)
            },
            description: `Changing ${property} color to ${value}`
        };
    }

    /**
     * Crée une action de modification de section
     */
    private createModifySectionAction(details: any): AIAction {
        const targetSection = this.findSection(details.sectionType);

        return {
            type: 'modify_section',
            target: targetSection?.id,
            data: details,
            description: `Modifying ${details.sectionType} section`
        };
    }

    /**
     * Crée une action de suppression de section
     */
    private createDeleteSectionAction(details: any): AIAction {
        const targetSection = this.findSection(details.sectionType);

        return {
            type: 'delete_section',
            target: targetSection?.id,
            data: {},
            description: `Deleting ${details.sectionType} section`
        };
    }

    /**
     * Crée une action d'amélioration de contenu
     */
    private async createImproveContentAction(details: any): Promise<AIAction> {
        const targetSection = this.findSection(details.sectionType);

        if (!targetSection) {
            throw new Error('Section not found');
        }

        // Améliorer le contenu existant
        const improvedContent = await this.improveContent(
            targetSection.content,
            details.sectionType
        );

        return {
            type: 'update_content',
            target: targetSection.id,
            data: improvedContent,
            description: `Improving content in ${details.sectionType} section`
        };
    }

    /**
     * Génère le contenu d'une nouvelle section
     */
    private async generateSectionContent(sectionType: string): Promise<any> {
        const prompt = `Generate content for a ${sectionType} section for a website about ${this.context.currentSite.name}.

Return ONLY a JSON object:
{
  "heading": "Main heading",
  "subheading": "Optional subheading",
  "text": "Body text",
  "cta": {
    "text": "Call to action button text",
    "link": "#"
  }
}`;

        const response = await this.callAI(prompt);
        return this.parseJSON(response);
    }

    /**
     * Améliore le contenu existant
     */
    private async improveContent(currentContent: any, sectionType: string): Promise<any> {
        const prompt = `Improve this ${sectionType} section content to be more engaging and effective:

Current content:
${JSON.stringify(currentContent, null, 2)}

Return ONLY the improved JSON object with the same structure.`;

        const response = await this.callAI(prompt);
        return this.parseJSON(response);
    }

    /**
     * Génère la réponse de l'assistant
     */
    private async generateResponse(
        userMessage: string,
        command: AICommand,
        action?: AIAction
    ): Promise<string> {
        if (command.intent === 'question') {
            // Répondre à une question
            const prompt = `You are a helpful website builder assistant. Answer this question:
      
User: ${userMessage}

Context: The user is editing a website called "${this.context.currentSite.name}".

Provide a helpful, concise response.`;

            return await this.callAI(prompt);
        }

        // Confirmer l'action
        if (action) {
            const confirmations: Record<string, string> = {
                'add_section': `I'll add a ${command.details.sectionType} section to your site.`,
                'change_theme': `I'll change the ${command.details.property} color to ${command.details.value}.`,
                'modify_section': `I'll update the ${command.details.sectionType} section.`,
                'delete_section': `I'll remove the ${command.details.sectionType} section.`,
                'update_content': `I'll improve the content in the ${command.details.sectionType} section.`
            };

            return confirmations[action.type] || 'I\'ll make that change for you.';
        }

        return 'I understand, but I need more information to help with that. Can you be more specific?';
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
        if (prompt.includes('extract the intent')) {
            // Simple mock parser logic
            if (prompt.includes('Add')) return JSON.stringify({ intent: 'add', entity: 'section', details: { sectionType: 'features' }, confidence: 0.9 });
            if (prompt.includes('Change')) return JSON.stringify({ intent: 'change', entity: 'theme', details: { property: 'primary', value: 'blue' }, confidence: 0.9 });
            return JSON.stringify({ intent: 'question', entity: 'content', details: {}, confidence: 0.8 });
        }
        return "This is a simulated AI response.";
    }

    /**
     * Trouve une section par type
     */
    private findSection(sectionType: string): any {
        return this.context.currentSite.sections.find(
            s => s.type.toLowerCase() === sectionType?.toLowerCase()
        );
    }

    /**
     * Normalise une valeur de couleur
     */
    private normalizeColorValue(value: string): string {
        // Convertir les noms de couleur en hex
        const colorMap: Record<string, string> = {
            'blue': '#3B82F6',
            'red': '#EF4444',
            'green': '#10B981',
            'purple': '#8B5CF6',
            'orange': '#F59E0B',
            'pink': '#EC4899',
            'yellow': '#F59E0B'
        };

        return colorMap[value.toLowerCase()] || value;
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
            // Fallback
            return {};
        }
    }

    /**
     * Génère un ID unique
     */
    private generateId(): string {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Met à jour le contexte
     */
    updateContext(context: Partial<AssistantContext>): void {
        this.context = { ...this.context, ...context };
    }

    /**
     * Réinitialise la conversation
     */
    resetConversation(): void {
        this.context.conversationHistory = [];
    }
}

export default AIAssistant;
