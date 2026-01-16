import React, { createContext, useContext, useState, useCallback } from 'react';
import { aiService } from '../services/aiService';
import { AIConversation, AIMessage, AICapability } from '../types/ai.types';
// import { useAuth } from '../../../contexts/AuthContext'; // Si besoin de l'userId

interface AIContextType {
    isEnabled: boolean;
    currentConversation: AIConversation | null;
    sendMessage: (message: string, context?: string) => Promise<AIMessage>;
    clearConversation: () => void;
    capabilities: AICapability[];
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentConversation, setCurrentConversation] = useState<AIConversation | null>(null);
    const [isEnabled, setIsEnabled] = useState(true); // Paramétrable via feature flags

    const sendMessage = useCallback(async (message: string, context?: string) => {
        let conversation = currentConversation;

        if (!conversation) {
            // Créer une nouvelle conversation
            const newConversation: AIConversation = {
                id: crypto.randomUUID(),
                userId: 'current-user-id', // À récupérer du AuthContext
                messages: [],
                context,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            setCurrentConversation(newConversation);
            conversation = newConversation;
        }

        try {
            const response = await aiService.sendMessage(
                message,
                conversation!.id,
                context
            );

            // Mettre à jour la conversation
            setCurrentConversation(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    messages: [...prev.messages, response],
                    updatedAt: new Date()
                };
            });

            return response;
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            throw error;
        }
    }, [currentConversation]);

    const clearConversation = useCallback(() => {
        setCurrentConversation(null);
    }, []);

    const capabilities: AICapability[] = [
        {
            id: 'server-analysis',
            name: 'Analyse de serveurs',
            description: 'Analyse les performances et recommande des optimisations',
            category: 'analysis',
            permissions: ['servers:view']
        },
        {
            id: 'code-generation',
            name: 'Génération de code',
            description: 'Génère du code pour automatiser des tâches',
            category: 'generation',
            permissions: ['code:generate']
        },
        {
            id: 'support-assistant',
            name: 'Assistant support',
            description: 'Aide à résoudre les problèmes techniques',
            category: 'support',
            permissions: ['support:use']
        }
    ];

    return (
        <AIContext.Provider
            value={{
                isEnabled,
                currentConversation,
                sendMessage,
                clearConversation,
                capabilities
            }}
        >
            {children}
        </AIContext.Provider>
    );
};

export const useAI = () => {
    const context = useContext(AIContext);
    if (!context) {
        throw new Error('useAI doit être utilisé dans un AIProvider');
    }
    return context;
};
