import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import type { ConversationStep, AIGeneratorResult } from '../../../types/ai.types';

interface AIGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (site: any) => void; // Using specific type would be better but 'any' matches user flow for now
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({ isOpen, onClose, onGenerate }) => {
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({
        businessName: '',
        businessType: '',
        industry: '',
        description: '',
        targetAudience: '',
        goals: [],
        style: 'professional',
        preferredColors: []
    });

    const conversationSteps: ConversationStep[] = [
        {
            id: 1,
            question: "What's your business name?",
            field: 'businessName',
            type: 'text',
            placeholder: 'e.g., Acme Corporation'
        },
        {
            id: 2,
            question: "What type of business do you run?",
            field: 'businessType',
            type: 'text',
            placeholder: 'e.g., Web Design Agency, Coffee Shop, SaaS Company'
        },
        {
            id: 3,
            question: "Which industry are you in?",
            field: 'industry',
            type: 'select',
            options: [
                'Technology', 'Design', 'Consulting', 'Retail',
                'Healthcare', 'Education', 'Finance', 'Marketing',
                'Real Estate', 'Food & Beverage', 'Other'
            ]
        },
        {
            id: 4,
            question: "Tell me about your business in a few sentences",
            field: 'description',
            type: 'textarea',
            placeholder: 'We help small businesses create professional websites...'
        },
        {
            id: 5,
            question: "What style do you prefer?",
            field: 'style',
            type: 'select',
            options: ['Professional', 'Creative', 'Minimal', 'Bold', 'Elegant']
        },
        {
            id: 6,
            question: "What are your main goals for this website?",
            field: 'goals',
            type: 'multiselect',
            options: [
                'Generate leads',
                'Sell products',
                'Showcase portfolio',
                'Build brand awareness',
                'Provide information',
                'Build community'
            ]
        }
    ];

    const currentStep = conversationSteps[step - 1];

    const handleInputChange = (value: any) => {
        setFormData(prev => ({
            ...prev,
            [currentStep.field]: value
        }));
    };

    const handleNext = () => {
        if (step < conversationSteps.length) {
            setStep(step + 1);
        } else {
            handleGenerate();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);

        try {
            // Simulation call - in production this would call the AISiteGenerator service
            await new Promise(resolve => setTimeout(resolve, 3000));

            const generatedSite = {
                name: formData.businessName,
                template: 'business-professional',
                theme: {
                    colors: {
                        primary: '#3B82F6',
                        secondary: '#8B5CF6',
                        accent: '#10B981',
                        background: '#FFFFFF',
                        text: '#1F2937',
                        textLight: '#6B7280'
                    },
                    fonts: {
                        heading: 'Inter, sans-serif',
                        body: 'Inter, sans-serif'
                    }
                },
                sections: [
                    {
                        type: 'hero',
                        order: 0,
                        content: {
                            heading: `Welcome to ${formData.businessName}`,
                            subheading: formData.description.split('.')[0] || 'Quality services for your needs',
                            cta: { text: 'Get Started', link: '#contact' }
                        }
                    },
                    {
                        type: 'features',
                        order: 1,
                        content: {
                            heading: 'Why Choose Us',
                            items: formData.goals.map((goal: string) => ({
                                title: goal,
                                description: `We excel at ${goal.toLowerCase()}`
                            }))
                        }
                    }
                ]
            };

            onGenerate(generatedSite);
            // Reset logic usually handled by parent closing modal
            onClose();
        } catch (error) {
            console.error('Generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const canProceed = () => {
        const value = formData[currentStep.field];
        if (currentStep.type === 'multiselect') {
            return Array.isArray(value) && value.length > 0;
        }
        return value && value.toString().trim().length > 0;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] overflow-y-auto bg-black/50">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl relative">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">AI Site Generator</h2>
                                <p className="text-sm text-gray-600">Let's create your perfect website together</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="px-6 pt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Question {step} of {conversationSteps.length}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(step / conversationSteps.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {isGenerating ? (
                            <div className="text-center py-12">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Creating Your Website...
                                </h3>
                                <p className="text-gray-600">
                                    Our AI is designing the perfect site for {formData.businessName}
                                </p>
                                <div className="mt-6 space-y-2 text-sm text-gray-500">
                                    <p>✓ Analyzing your business needs</p>
                                    <p>✓ Selecting optimal template</p>
                                    <p>✓ Generating custom content</p>
                                    <p>✓ Designing color scheme</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                    {currentStep.question}
                                </h3>

                                {currentStep.type === 'text' && (
                                    <input
                                        type="text"
                                        value={formData[currentStep.field]}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        placeholder={currentStep.placeholder}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                                        autoFocus
                                    />
                                )}

                                {currentStep.type === 'textarea' && (
                                    <textarea
                                        value={formData[currentStep.field]}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        placeholder={currentStep.placeholder}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg resize-none"
                                        autoFocus
                                    />
                                )}

                                {currentStep.type === 'select' && currentStep.options && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {currentStep.options.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => handleInputChange(option.toLowerCase())}
                                                className={`px-4 py-3 rounded-lg border-2 transition-all ${formData[currentStep.field] === option.toLowerCase()
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {currentStep.type === 'multiselect' && currentStep.options && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {currentStep.options.map((option) => {
                                            const isSelected = formData.goals.includes(option);
                                            return (
                                                <button
                                                    key={option}
                                                    onClick={() => {
                                                        const newGoals = isSelected
                                                            ? formData.goals.filter((g: string) => g !== option)
                                                            : [...formData.goals, option];
                                                        handleInputChange(newGoals);
                                                    }}
                                                    className={`px-4 py-3 rounded-lg border-2 transition-all ${isSelected
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    {!isGenerating && (
                        <div className="p-6 border-t border-gray-200 flex justify-between">
                            <button
                                onClick={step === 1 ? onClose : handleBack}
                                className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {step === 1 ? 'Cancel' : 'Back'}
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                            >
                                {step === conversationSteps.length ? 'Generate Site' : 'Next'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
