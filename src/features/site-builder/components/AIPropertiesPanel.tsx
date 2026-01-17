import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Settings, MessageSquare } from 'lucide-react';

interface AIPropertiesPanelProps {
    section: any; // Ideally typed as TemplateSection
    onUpdate: (updatedSection: any) => void;
}

export const AIPropertiesPanel: React.FC<AIPropertiesPanelProps> = ({ section, onUpdate }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showAISettings, setShowAISettings] = useState(false);
    const [aiProvider, setAiProvider] = useState('claude');

    const aiProviders = [
        { id: 'claude', name: 'Claude (Anthropic)', icon: '🤖', models: ['claude-sonnet-4', 'claude-opus-4'] },
        { id: 'gpt', name: 'ChatGPT (OpenAI)', icon: '💬', models: ['gpt-4', 'gpt-4-turbo'] },
        { id: 'gemini', name: 'Gemini (Google)', icon: '✨', models: ['gemini-pro', 'gemini-ultra'] },
        { id: 'veo', name: 'Veo 2 (Google)', icon: '🎬', models: ['veo-2'] }
    ];

    const [selectedModel, setSelectedModel] = useState('claude-sonnet-4');

    const handleGenerateContent = async () => {
        setIsGenerating(true);

        // Simuler la génération
        setTimeout(() => {
            const generatedContent = {
                heading: `${section.type === 'hero' ? 'Transform Your Business' : 'Discover Our Features'}`,
                subheading: 'AI-powered content generation for your website',
                text: 'This is AI-generated content tailored to your section type and business needs.'
            };

            onUpdate({
                ...section,
                content: { ...section.content, ...generatedContent }
            });

            setIsGenerating(false);
        }, 2000);
    };

    const handleImproveContent = async () => {
        setIsGenerating(true);

        setTimeout(() => {
            const improved = {
                ...section.content,
                text: section.content.text + ' Enhanced with AI improvements for clarity and engagement.'
            };

            onUpdate({
                ...section,
                content: improved
            });

            setIsGenerating(false);
        }, 1500);
    };

    const currentProvider = aiProviders.find(p => p.id === aiProvider);

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Properties</h3>
                    <button
                        onClick={() => setShowAISettings(!showAISettings)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Settings className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
                <p className="text-sm text-gray-600">Section: {section.type}</p>
            </div>

            {/* AI Settings Dropdown */}
            {showAISettings && (
                <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">AI Provider Settings</h4>

                    {/* Provider Selection */}
                    <div className="mb-3">
                        <label className="text-xs text-gray-600 mb-2 block">AI Provider</label>
                        <div className="grid grid-cols-2 gap-2">
                            {aiProviders.map(provider => (
                                <button
                                    key={provider.id}
                                    onClick={() => {
                                        setAiProvider(provider.id);
                                        setSelectedModel(provider.models[0]);
                                    }}
                                    className={`p-2 rounded-lg border-2 transition-all text-left ${aiProvider === provider.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">{provider.icon}</span>
                                        <span className="text-xs font-medium">{provider.name.split(' ')[0]}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Model Selection */}
                    <div>
                        <label className="text-xs text-gray-600 mb-2 block">Model</label>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {currentProvider?.models.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-3 p-2 bg-white/50 rounded-lg">
                        <p className="text-xs text-gray-600">
                            Using: <span className="font-semibold text-gray-900">{currentProvider?.name}</span>
                        </p>
                    </div>
                </div>
            )}

            {/* AI Actions */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <h4 className="text-sm font-semibold text-gray-900">AI Content Tools</h4>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={handleGenerateContent}
                        disabled={isGenerating}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all text-sm font-medium"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4" />
                                Generate Content
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleImproveContent}
                        disabled={isGenerating || !section.content.text}
                        className="w-full px-4 py-2.5 bg-white border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all text-sm font-medium"
                    >
                        <Sparkles className="w-4 h-4" />
                        Improve with AI
                    </button>
                </div>

                <div className="mt-3 text-xs text-gray-600 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>Powered by {currentProvider?.name}</span>
                </div>
            </div>

            {/* Content Fields */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heading
                    </label>
                    <input
                        type="text"
                        value={section.content.heading || ''}
                        onChange={(e) => onUpdate({
                            ...section,
                            content: { ...section.content, heading: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter heading"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subheading
                    </label>
                    <input
                        type="text"
                        value={section.content.subheading || ''}
                        onChange={(e) => onUpdate({
                            ...section,
                            content: { ...section.content, subheading: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter subheading"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Body Text
                    </label>
                    <textarea
                        value={section.content.text || ''}
                        onChange={(e) => onUpdate({
                            ...section,
                            content: { ...section.content, text: e.target.value }
                        })}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Enter body text"
                    />
                </div>

                {section.type === 'hero' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CTA Button Text
                        </label>
                        <input
                            type="text"
                            value={section.content.cta?.text || ''}
                            onChange={(e) => onUpdate({
                                ...section,
                                content: {
                                    ...section.content,
                                    cta: { ...section.content.cta, text: e.target.value }
                                }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Get Started"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
