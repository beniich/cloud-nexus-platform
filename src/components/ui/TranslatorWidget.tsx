import React, { useState } from 'react';
import { Languages, ArrowRight, Copy, Check, Loader2, X } from 'lucide-react';

// Composant de traduction réutilisable
export function TranslatorWidget({ onClose, defaultText = '', compact = false }) {
    const [text, setText] = useState(defaultText);
    const [sourceLang, setSourceLang] = useState('auto');
    const [targetLang, setTargetLang] = useState('fr');
    const [translatedText, setTranslatedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const languages = [
        { code: 'auto', name: 'Auto' },
        { code: 'fr', name: 'Français' },
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' },
        { code: 'de', name: 'Deutsch' },
        { code: 'it', name: 'Italiano' },
        { code: 'pt', name: 'Português' },
        { code: 'ar', name: 'العربية' },
        { code: 'zh', name: '中文' },
        { code: 'ja', name: '日本語' },
        { code: 'ru', name: 'Русский' },
        { code: 'nl', name: 'Nederlands' },
        { code: 'tr', name: 'Türkçe' },
        { code: 'ko', name: '한국어' },
    ];

    const translate = async () => {
        if (!text.trim()) {
            setError('Veuillez entrer du texte à traduire');
            return;
        }

        setIsLoading(true);
        setError('');
        setTranslatedText('');

        try {
            const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

            if (!apiKey) {
                setError('API Key manquante (VITE_ANTHROPIC_API_KEY)');
                setIsLoading(false);
                return;
            }

            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'dangerously-allow-browser': 'true' // Only for demo/dev purposes
                },
                body: JSON.stringify({
                    model: 'claude-3-sonnet-20240229',
                    max_tokens: 1000,
                    messages: [
                        {
                            role: 'user',
                            content: `Traduis le texte suivant ${sourceLang !== 'auto' ? `du ${languages.find(l => l.code === sourceLang)?.name}` : ''} vers ${languages.find(l => l.code === targetLang)?.name}. Fournis uniquement la traduction sans commentaires.\n\nTexte:\n${text}`
                        }
                    ],
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `Erreur HTTP: ${response.status}`);
            }


            const data = await response.json();

            if (data.content && data.content[0]?.text) {
                setTranslatedText(data.content[0].text);
            } else {
                setError('Erreur lors de la traduction');
            }
        } catch (err) {
            setError(`Erreur: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(translatedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const swapLanguages = () => {
        if (sourceLang !== 'auto') {
            setSourceLang(targetLang);
            setTargetLang(sourceLang);
            setText(translatedText);
            setTranslatedText(text);
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-lg ${compact ? 'p-4' : 'p-6'}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Traduction</h3>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Language Selection */}
            <div className="flex items-center gap-2 mb-4">
                <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={swapLanguages}
                    disabled={sourceLang === 'auto'}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Inverser les langues"
                >
                    <ArrowRight className="w-4 h-4 text-orange-600 transform rotate-90" />
                </button>

                <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                    {languages.filter(l => l.code !== 'auto').map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Text Input */}
            <div className="space-y-3">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Entrez le texte à traduire..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={compact ? 3 : 4}
                />

                {/* Translate Button */}
                <button
                    onClick={translate}
                    disabled={isLoading}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Traduction...
                        </>
                    ) : (
                        <>
                            <Languages className="w-4 h-4" />
                            Traduire
                        </>
                    )}
                </button>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Translation Result */}
                {translatedText && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Résultat:</span>
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3 h-3 text-green-600" />
                                        <span className="text-green-600">Copié</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3 h-3" />
                                        <span>Copier</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                {translatedText}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
