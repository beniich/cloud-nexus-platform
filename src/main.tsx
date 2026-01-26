import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import i18n from "./lib/i18n"; // Assuming i18n instance is exported
import React from 'react'; // For React.StrictMode
import { I18nextProvider } from 'react-i18next'; // For I18nextProvider

// ✅ NOUVEAU : Imports de sécurité
// Note: AIProvider et MockModeBanner sont dans App.tsx pour accès au contexte Auth si besoin, ou ici si global.
// Le guide les place ici, mais nous les avons dans App.tsx pour l'instant. Nous gardons App.tsx propre et faisons les checks ici.

// ✅ NOUVEAU : Vérification du mode mock en production
if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_MOCK === 'true') {
    throw new Error(
        '🚨 ERREUR CRITIQUE : Le mode mock ne peut pas être activé en production ! ' +
        'Vérifiez votre fichier .env'
    );
}

// ✅ NOUVEAU : Validation des variables d'environnement requises
const validateEnv = () => {
    // Liste des vars requises (adapter selon besoin)
    const required = ['VITE_API_URL'];
    const missing = required.filter(key => !import.meta.env[key]);

    if (missing.length > 0) {
        console.warn(
            `Variables d'environnement manquantes : ${missing.join(', ')}\n` +
            'Copiez .env.example vers .env et configurez les valeurs.'
        );
        // throw new Error(...) // On peut throw si on veut bloquer le démarrage
    }
};

validateEnv();

// Minimal Error Boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
                    <h1 style={{ color: '#ef4444' }}>Something went wrong.</h1>
                    <pre style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
                        {this.state.error?.toString()}
                    </pre>
                    <p>Check the console for more details.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

createRoot(document.getElementById("root")!).render(
    // Temporarily disabled StrictMode to diagnose hook error
    // <React.StrictMode>
    <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
            <App />
        </I18nextProvider>
    </ErrorBoundary>
    // </React.StrictMode>
);
