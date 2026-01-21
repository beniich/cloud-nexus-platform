/**
 * Types pour les services d'IA du Site Builder
 */

// ============================================================================
// AI Site Generator (Niveau 1)
// ============================================================================

export interface AIGeneratorInput {
    businessType: string;
    businessName: string;
    description: string;
    targetAudience?: string;
    goals: string[];
    style: 'professional' | 'creative' | 'minimal' | 'bold' | 'elegant';
    industry: string;
    preferredColors?: string[];
}

export interface AIGeneratorResult {
    siteName: string;
    template: {
        id: string;
        category: string;
    };
    theme: {
        colors: Record<string, string>;
        fonts: Record<string, string>;
    };
    sections: AIGeneratedSection[];
    seo: {
        title: string;
        description: string;
        keywords: string[];
    };
}

export interface AIGeneratedSection {
    type: string;
    order: number;
    content: {
        heading?: string;
        subheading?: string;
        text?: string;
        // Items can be various structures depending on section type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items?: any[];
        cta?: {
            text: string;
            link: string;
        };
    };
}

export interface ConversationStep {
    id: number;
    question: string;
    field: string;
    type: 'text' | 'textarea' | 'select' | 'multiselect' | 'color';
    options?: string[];
    required?: boolean;
    placeholder?: string;
}

// ============================================================================
// AI Assistant (Niveau 2)
// ============================================================================

export interface AIAssistantMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    action?: AIAction;
}

export interface AIAction {
    type: 'add_section' | 'modify_section' | 'delete_section' | 'change_theme' | 'update_content' | 'reorder_sections';
    target?: string; // section ID
    // Action data structure varies by action type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    description: string;
}

export interface AICommand {
    intent: 'add' | 'modify' | 'delete' | 'change' | 'improve' | 'question';
    entity: 'section' | 'theme' | 'content' | 'layout' | 'seo';
    // Command details vary by intent and entity
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details: Record<string, any>;
    confidence: number;
}

export interface AssistantContext {
    currentSite: {
        id: string;
        name: string;
        // Sections and theme have dynamic structures
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sections: any[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        theme: any;
    };
    conversationHistory: AIAssistantMessage[];
    userPreferences?: {
        style: string;
        industry: string;
    };
}

// ============================================================================
// AI Content Generator (Niveau 3)
// ============================================================================

export interface ContentGenerationRequest {
    sectionType: string;
    context: {
        siteName?: string;
        businessType?: string;
        industry?: string;
        targetAudience?: string;
    };
    tone: 'professional' | 'casual' | 'friendly' | 'formal' | 'persuasive';
    length: 'short' | 'medium' | 'long';
    existingContent?: string;
    specificRequirements?: string[];
}

export interface ContentGenerationResult {
    heading?: string;
    subheading?: string;
    bodyText?: string;
    bulletPoints?: string[];
    ctaText?: string;
    metadata?: {
        wordCount: number;
        readingTime: number;
    };
}

export interface ContentImprovementRequest {
    originalContent: string;
    improvementType: 'clarity' | 'engagement' | 'seo' | 'brevity' | 'expansion';
    targetAudience?: string;
    keywords?: string[];
}

export interface ContentImprovementResult {
    improvedContent: string;
    changes: {
        type: string;
        description: string;
    }[];
    metrics: {
        readabilityScore: number;
        seoScore: number;
        engagementScore: number;
    };
}

// ============================================================================
// AI Service Configuration
// ============================================================================

export interface AIServiceConfig {
    provider: 'openai' | 'anthropic' | 'custom';
    apiKey?: string;
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt?: string;
}

export interface AIResponse {
    success: boolean;
    // AI response data structure varies by request type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    error?: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

// ============================================================================
// Template Suggestions
// ============================================================================

export interface TemplateSuggestion {
    templateId: string;
    score: number;
    reason: string;
    preview: {
        name: string;
        thumbnail: string;
        description: string;
    };
}

// ============================================================================
// AI Analytics
// ============================================================================

export interface AIUsageMetrics {
    userId: string;
    period: {
        start: string;
        end: string;
    };
    generationCount: number;
    assistantInteractions: number;
    contentGenerations: number;
    averageResponseTime: number;
    successRate: number;
}
