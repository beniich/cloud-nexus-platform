import React, { useState } from 'react';
import { Languages } from 'lucide-react';
import { TranslatorWidget } from '../components/ui/TranslatorWidget';

export default function TranslatorDemoPage() {
    const [showTranslator, setShowTranslator] = useState(false);
    const [selectedText, setSelectedText] = useState('');

    const handleTextSelection = () => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();
        if (text) {
            setSelectedText(text);
            setShowTranslator(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Mon Application
                    </h1>
                    <p className="text-gray-600">
                        Exemple d'intégration du composant de traduction
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Content Card */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Contenu Principal
                            </h2>
                            <div onMouseUp={handleTextSelection} className="space-y-3 text-gray-700">
                                <p>
                                    Bienvenue dans cette application de démonstration. Vous pouvez sélectionner
                                    n'importe quel texte sur cette page pour le traduire automatiquement.
                                </p>
                                <p>
                                    This is an example of multilingual content. Select this text to translate
                                    it into your preferred language using the translation widget.
                                </p>
                                <p>
                                    Este es un ejemplo de contenido multilingüe. El componente de traducción
                                    se puede integrar fácilmente en cualquier aplicación React.
                                </p>
                            </div>
                        </div>

                        {/* Toggle Button */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Actions
                            </h3>
                            <button
                                onClick={() => setShowTranslator(!showTranslator)}
                                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Languages className="w-5 h-5" />
                                {showTranslator ? 'Masquer' : 'Afficher'} le traducteur
                            </button>
                        </div>
                    </div>

                    {/* Sidebar with Translator */}
                    <div className="lg:col-span-1">
                        {showTranslator ? (
                            <div className="sticky top-8">
                                <TranslatorWidget
                                    onClose={() => setShowTranslator(false)}
                                    defaultText={selectedText}
                                    compact={false}
                                />
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-orange-50 to-purple-50 rounded-xl shadow-md p-6 border-2 border-dashed border-orange-200">
                                <Languages className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                                <p className="text-center text-gray-600 text-sm">
                                    Le traducteur apparaîtra ici. Cliquez sur le bouton "Afficher le traducteur"
                                    ou sélectionnez du texte pour l'activer.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Usage Instructions */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Instructions d'intégration</h4>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>Importez le composant <code className="bg-blue-100 px-1 rounded">TranslatorWidget</code> dans votre application</li>
                        <li>Utilisez-le avec ou sans la prop <code className="bg-blue-100 px-1 rounded">onClose</code> pour un mode modal ou permanent</li>
                        <li>Passez du texte par défaut avec <code className="bg-blue-100 px-1 rounded">defaultText</code></li>
                        <li>Ajustez la taille avec <code className="bg-blue-100 px-1 rounded">compact=true/false</code></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
