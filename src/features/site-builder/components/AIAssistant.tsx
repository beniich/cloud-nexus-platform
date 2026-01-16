import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Sparkles } from 'lucide-react';
import { AI_RESPONSES } from '../data/site-data';

export default function AIAssistant({ onClose }: { onClose: () => void }) {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: "Bonjour ! Je suis ton assistant CloudNexus ✦\nComment puis-je t'aider avec ton site aujourd'hui ?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

            if (!API_KEY) {
                throw new Error("Clé API Anthropic manquante");
            }

            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                    "anthropic-version": "2023-06-01",
                },
                body: JSON.stringify({
                    model: "claude-3-5-sonnet-20241022",
                    max_tokens: 1200,
                    temperature: 0.7,
                    system: `Tu es un assistant expert ultra-pratique pour CloudNexus Site Builder.
Réponds TOUJOURS en français, de façon concise, directe et actionnable.
Structure tes réponses avec :
• Instructions claires et numérotées quand c'est une procédure
• Exemples concrets quand c'est pertinent
• Évite le blabla marketing inutile

Tu peux aider avec :
- Création / gestion de sites
- Ajout et personnalisation de sections (Hero, Grid, CTA, Gallery, Testimonials...)
- Modification du thème (couleurs, polices, espacements)
- Prévisualisation responsive
- Animations d'entrée
- Upload et gestion d'images
- Export HTML/CSS/JS

Sois le plus utile possible en peu de mots.`,
                    messages: [
                        ...messages.map(m => ({
                            role: m.role === 'assistant' ? 'assistant' : 'user',
                            content: m.text
                        })),
                        { role: 'user', content: input.trim() }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const aiText = data.content
                .filter((item: any) => item.type === 'text')
                .map((item: any) => item.text)
                .join('\n');

            setMessages(prev => [...prev, { role: 'assistant', text: aiText || "Désolé, je n'ai pas pu générer de réponse..." }]);
        } catch (error) {
            console.error("Erreur AI:", error);

            // Fallback intelligent
            const query = input.toLowerCase();
            let fallback = AI_RESPONSES['default'];

            if (query.includes('créer') || query.includes('nouveau') || query.includes('commencer')) {
                fallback = AI_RESPONSES['creer site'];
            } else if (query.match(/section|ajouter|bloc/)) {
                fallback = AI_RESPONSES['ajouter section'];
            } else if (query.match(/couleur|theme|palette/)) {
                fallback = AI_RESPONSES['changer couleur'];
            } else if (query.match(/responsive|mobile|tablette/)) {
                fallback = AI_RESPONSES['responsive'];
            } else if (query.match(/export|télécharger|code|html/)) {
                fallback = AI_RESPONSES['exporter'];
            }

            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    text: fallback + "\n\n*(mode hors-ligne activé – l'API semble indisponible)*"
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-gray-900 rounded-2xl w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl border border-gray-700 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <Sparkles size={20} className="text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">Assistant CloudNexus</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-5 py-3 ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-gray-800 text-gray-100 rounded-bl-none'
                                    }`}
                            >
                                {msg.text.split('\n').map((line, idx) => (
                                    <p key={idx} className={line.trim() ? 'mb-1.5 last:mb-0' : 'h-3'}>
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-800 rounded-2xl px-5 py-3 flex items-center gap-2">
                                <Loader2 size={18} className="animate-spin text-purple-400" />
                                <span className="text-gray-400">Réflexion en cours...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-700 p-4">
                    <div className="relative flex items-center">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Demande-moi n'importe quoi sur ton site..."
                            className="w-full bg-gray-800 text-white rounded-xl px-5 py-3 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[56px] max-h-32"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-3 bottom-3 p-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                        Appuie sur Entrée • Shift+Entrée pour nouvelle ligne
                    </p>
                </div>
            </div>
        </div>
    );
}
