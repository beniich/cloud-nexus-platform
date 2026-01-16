export interface AIMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: {
        tokens?: number;
        model?: string;
        confidence?: number;
    };
}

export interface AIConversation {
    id: string;
    userId: string;
    messages: AIMessage[];
    context?: string; // Feature context (servers, hosting, etc.)
    createdAt: Date;
    updatedAt: Date;
}

export interface AICapability {
    id: string;
    name: string;
    description: string;
    category: 'analysis' | 'generation' | 'automation' | 'support';
    permissions: string[];
}
