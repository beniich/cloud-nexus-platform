import React, { createContext, useContext, useEffect, useState } from 'react';

type FontSize = 'normal' | 'large' | 'xlarge';
type FontFamily = 'default' | 'serif' | 'dyslexic';
type ContrastMode = 'normal' | 'high-contrast' | 'dark-yellow';

interface AccessibilityContextType {
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
    fontFamily: FontFamily;
    setFontFamily: (font: FontFamily) => void;
    contrastMode: ContrastMode;
    setContrastMode: (mode: ContrastMode) => void;
    resetSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [fontSize, setFontSize] = useState<FontSize>('normal');
    const [fontFamily, setFontFamily] = useState<FontFamily>('default');
    const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');

    useEffect(() => {
        const root = document.documentElement;

        // Reset classes
        root.classList.remove('text-lg', 'text-xl', 'font-serif', 'font-dyslexic', 'high-contrast', 'theme-yellow');

        // Apply Font Size
        if (fontSize === 'large') root.classList.add('text-lg');
        if (fontSize === 'xlarge') root.classList.add('text-xl');

        // Apply Font Family
        if (fontFamily === 'serif') root.classList.add('font-serif');
        if (fontFamily === 'dyslexic') root.classList.add('font-dyslexic');

        // Apply Contrast
        if (contrastMode === 'high-contrast') root.classList.add('high-contrast');
        if (contrastMode === 'dark-yellow') root.classList.add('theme-yellow');

        // Persist settings (optional)
        localStorage.setItem('accessibility-settings', JSON.stringify({ fontSize, fontFamily, contrastMode }));

    }, [fontSize, fontFamily, contrastMode]);

    // Load settings on mount
    useEffect(() => {
        const saved = localStorage.getItem('accessibility-settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.fontSize) setFontSize(parsed.fontSize);
                if (parsed.fontFamily) setFontFamily(parsed.fontFamily);
                if (parsed.contrastMode) setContrastMode(parsed.contrastMode);
            } catch (e) {
                console.error('Failed to load accessibility settings', e);
            }
        }
    }, []);

    const resetSettings = () => {
        setFontSize('normal');
        setFontFamily('default');
        setContrastMode('normal');
    };

    return (
        <AccessibilityContext.Provider value={{
            fontSize, setFontSize,
            fontFamily, setFontFamily,
            contrastMode, setContrastMode,
            resetSettings
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};
