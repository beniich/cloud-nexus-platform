import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../contexts/AIContext';
import { XSSProtection } from '@/lib/security/xssProtection';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Send, Bot, User, Loader2, AlertTriangle } from 'lucide-react';

export const AIChat: React.FC<{
    context?: string;
    placeholder?: string;
}> = ({ context, placeholder = 'Posez votre question...' }) => {
    const { currentConversation, sendMessage, clearConversation } = useAI();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll automatique vers le bas
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentConversation?.messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setError(null);
        setIsLoading(true);

        try {
            await sendMessage(userMessage, context);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Assistant IA</h3>
                    {context && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {context}
                        </span>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearConversation}
                >
                    Nouvelle conversation
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {!currentConversation?.messages.length && (
                    <div className="text-center py-8">
                        <Bot className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                            Posez-moi une question pour commencer
                        </p>
                    </div>
                )}

                {currentConversation?.messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''
                            }`}
                    >
                        {/* Avatar */}
                        <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                                    ? 'bg-blue-600'
                                    : 'bg-gray-200'
                                }`}
                        >
                            {message.role === 'user' ? (
                                <User className="h-5 w-5 text-white" />
                            ) : (
                                <Bot className="h-5 w-5 text-gray-600" />
                            )}
                        </div>

                        {/* Message Content */}
                        <div
                            className={`flex-1 max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                        >
                            {/* Sanitiser le contenu pour éviter XSS */}
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: XSSProtection.sanitizeHTML(
                                        message.content.replace(/\n/g, '<br>')
                                    ),
                                }}
                            />

                            {/* Metadata */}
                            {message.metadata && message.role === 'assistant' && (
                                <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                                    {message.metadata.tokens && (
                                        <span>Tokens: {message.metadata.tokens}</span>
                                    )}
                                    {message.metadata.confidence && (
                                        <span className="ml-2">
                                            Confiance: {Math.round(message.metadata.confidence * 100)}%
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <Bot className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1 max-w-[80%] rounded-lg p-3 bg-gray-100">
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                                <span className="text-sm text-gray-600">En train d'analyser...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Error Display */}
            {error && (
                <div className="px-4 pb-2">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={isLoading}
                        className="flex-1"
                        maxLength={4000}
                    />
                    <Button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {input.length}/4000 caractères
                </p>
            </form>

            {/* Security Notice */}
            <div className="px-4 pb-4">
                <div className="p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                    ⚠️ Ne partagez jamais d'informations sensibles (mots de passe, cartes bancaires)
                </div>
            </div>
        </div>
    );
};
