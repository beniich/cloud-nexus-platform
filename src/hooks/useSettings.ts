import { useEffect, useState } from "react";
import { SettingsState } from "@/types/settings";
import { SettingsAPI } from "@/services/settingsApi";

const DEFAULT_SETTINGS: SettingsState = {
    storeName: "Ma Boutique",
    storeDescription: "",
    theme: "light",
    twoFactorAuth: false,
    emailNotifications: true,
};

export function useSettings() {
    const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        SettingsAPI.load().then((data) => {
            if (data) setSettings(data);
            setLoading(false);
        });
    }, []);

    const update = <K extends keyof SettingsState>(
        key: K,
        value: SettingsState[K]
    ) => {
        const updated = { ...settings, [key]: value };
        setSettings(updated);
        SettingsAPI.save(updated);
    };

    return { settings, update, loading };
}
