import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface PlatformSettings {
    site_name: string;
    site_description?: string;
    site_icon_url: string;
    site_logo_url: string;
    primary_color?: string;
}

interface PlatformConfigContextType {
    settings: PlatformSettings;
    isLoading: boolean;
    error: string | null;
    updateSettings: (newSettings: Partial<PlatformSettings>) => Promise<void>;
}

const DEFAULT_SETTINGS: PlatformSettings = {
    site_name: 'Cloud Nexus Platform',
    site_icon_url: '/favicon.ico',
    site_logo_url: '/logo.png',
};

const PlatformConfigContext = createContext<PlatformConfigContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const PlatformConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Charger la configuration au montage
    useEffect(() => {
        loadSettings();
    }, []);

    // Appliquer les changements globaux (Titre, Favicon)
    useEffect(() => {
        if (settings.site_name) {
            document.title = settings.site_name;
        }

        if (settings.site_icon_url) {
            // Mettre à jour le favicon
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = settings.site_icon_url;
        }
    }, [settings]);

    const loadSettings = async () => {
        try {
            const response = await fetch(`${API_URL}/platform`);
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (err) {
            console.error('Error loading platform settings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateSettings = async (newSettings: Partial<PlatformSettings>) => {
        if (user?.role !== 'admin' && user?.role !== 'owner') {
            throw new Error('Permission refusée : Admin requis');
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/platform`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newSettings),
            });

            if (!response.ok) throw new Error('Échec de la mise à jour');

            const updated = await response.json();
            setSettings(updated);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PlatformConfigContext.Provider value={{ settings, isLoading, error, updateSettings }}>
            {children}
        </PlatformConfigContext.Provider>
    );
};

export const usePlatformConfig = () => {
    const context = useContext(PlatformConfigContext);
    if (!context) {
        throw new Error('usePlatformConfig must be used within PlatformConfigProvider');
    }
    return context;
};
