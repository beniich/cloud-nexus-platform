import { SettingsState } from "@/types/settings";

// Use environment variable for API URL or default to localhost
const API_URL = import.meta.env.VITE_API_ORIGIN || 'http://localhost:3006/api';

export const SettingsAPI = {
    async load(): Promise<SettingsState | null> {
        try {
            const response = await fetch(`${API_URL}/settings`);
            if (!response.ok) {
                console.warn("API Error loading settings, falling back to local storage");
                const raw = localStorage.getItem("marketplace_settings");
                return raw ? JSON.parse(raw) : null;
            }
            return await response.json();
        } catch (error) {
            console.error("Network error loading settings:", error);
            const raw = localStorage.getItem("marketplace_settings");
            return raw ? JSON.parse(raw) : null;
        }
    },

    async save(settings: SettingsState): Promise<void> {
        try {
            await fetch(`${API_URL}/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            // Keep local storage for backup/offline sync
            localStorage.setItem("marketplace_settings", JSON.stringify(settings));
        } catch (error) {
            console.error("Network error saving settings:", error);
            localStorage.setItem("marketplace_settings", JSON.stringify(settings));
        }
    },
};
