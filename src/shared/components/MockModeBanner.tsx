import React from 'react';

export const MockModeBanner: React.FC = () => {
    const isMockEnabled = import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK === 'true';

    // Fallback: Si pas explicitement désactivé en DEV, on affiche si on détecte qu'on est en dev
    const shouldShow = isMockEnabled || (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK !== 'false');

    if (!shouldShow) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-destructive text-destructive-foreground px-4 py-1 text-center text-xs font-bold uppercase tracking-wider shadow-md pointer-events-none">
            ⚠️ MODE DÉVELOPPEMENT / MOCK ACTIVÉ ⚠️
        </div>
    );
};
