import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Check } from 'lucide-react';
import { AIAssistant } from '../../../services/ai/ai-assistant';
import type { AIAssistantMessage, AIAction } from '../../../types/ai.types';

interface AIChatAssistantProps {
    currentSite: any; // Type 'Site' would be better if available globally
    onAction: (action: AIAction) => void;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ currentSite, onAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<AIAssistantMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hi! I'm your AI assistant. I can help you modify your site. Try saying things like 'Add a pricing section' or 'Change the primary color to blue'.",
            timestamp: new Date().toISOString()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // We'll use a ref to persist the service instance across renders but we'd normally instantiate it properly
    // Since we are mocking the service inside the component for now in the user provided code, we'll verify if we should use the class or the local mocked logic.
    // The user provided code had local logic inside processMessage. I will adapt it to use the AIAssistant class if possible, or keep the local logic as a fallback/mock for now.
    // Given I created the AIAssistant class, let's try to use it, but the user provided code had a simplified self-contained version.
    // I will use a mix: local state for UI, and I'll include the logic from the user snippet which seemed self-contained for the "Demo".
    // However, for a real app, I should use the service. I'll instantiate the service.

    const assistantRef = useRef<AIAssistant | null>(null);

    useEffect(() => {
        // Initialize assistant with current site context
        if (currentSite && !assistantRef.current) {
            assistantRef.current = new AIAssistant({
                currentSite,
                conversationHistory: messages
            });
        } else if (assistantRef.current) {
            // Update context if site changes
            assistantRef.current.updateContext({ currentSite });
        }
    }, [currentSite, messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isTyping) return;

        const userMessage: AIAssistantMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            let responseMsg: AIAssistantMessage;

            if (assistantRef.current) {
                responseMsg = await assistantRef.current.processMessage(userMessage.content);
            } else {
                // Fallback if service not init
                responseMsg = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: "I'm not ready yet.",
                    timestamp: new Date().toISOString()
                };
            }

            setMessages(prev => [...prev, responseMsg]);

            // Execute action if present
            if (responseMsg.action && onAction) {
                onAction(responseMsg.action);
            }

        } catch (error) {
            console.error("Error processing message", error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Sorry, I encountered an error.",
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const quickActions = [
        'Add a pricing section',
        'Change colors to blue',
        'Make it more professional',
        'Add testimonials'
    ];

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-50"
                >
                    <Sparkles className="w-6 h-6" />
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">AI Assistant</h3>
                                <p className="text-xs text-white/80">Here to help you build</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                        }`}
                                >
                                    <p className="text-sm">{message.content}</p>
                                    {message.action && (
                                        <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-2 text-xs opacity-80">
                                            <Check className="w-3 h-3" />
                                            <span>Action: {message.action.description}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    {messages.length === 1 && (
                        <div className="px-4 pb-3 border-t border-gray-200">
                            <p className="text-xs text-gray-600 mb-2 font-medium">Try asking:</p>
                            <div className="flex flex-wrap gap-2">
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setInputValue(action)}
                                        className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isTyping}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isTyping}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
