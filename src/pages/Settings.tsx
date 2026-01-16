import { useState } from "react";
import { TabId, UserRole, Settings } from "@/types/settings";
import { useSettings } from "@/hooks/useSettings";

import SettingsSidebar from "@/components/settings/SettingsSidebar";
import SettingsStoreForm from "@/components/settings/SettingsStoreForm";
import SettingsSecurityForm from "@/components/settings/SettingsSecurityForm";
import SettingsAppearanceForm from "@/components/settings/SettingsAppearanceForm";
import SettingsNotificationsForm from "@/components/settings/SettingsNotificationsForm";
import SettingsPaymentsForm from "@/components/settings/SettingsPaymentsForm";
import SettingsAdminForm from "@/components/settings/SettingsAdminForm";

export default function SettingsPage() {
    // \ud83d\udc49 TODO: Injecter le rôle depuis le contexte d'authentification réel
    const role: UserRole = "admin"; // Force admin pour la démo, sinon "vendor"

    const { settings, update, loading } = useSettings();
    const [activeTab, setActiveTab] = useState<TabId>("store");

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">

                <SettingsSidebar
                    role={role}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />

                <main className="md:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 min-h-[500px]">
                    {activeTab === "store" && (
                        <SettingsStoreForm settings={settings} update={update} />
                    )}

                    {activeTab === "appearance" && (
                        <SettingsAppearanceForm settings={settings} update={update} />
                    )}

                    {activeTab === "notifications" && (
                        <SettingsNotificationsForm settings={settings} update={update} />
                    )}

                    {/* ADMIN ONLY ROUTES */}
                    {activeTab === "security" && role === "admin" && (
                        <SettingsSecurityForm settings={settings} update={update} />
                    )}

                    {activeTab === "payments" && role === "admin" && (
                        <SettingsPaymentsForm settings={settings} update={update} />
                    )}

                    {activeTab === "admin" && role === "admin" && (
                        <SettingsAdminForm
                            settings={settings as Settings}
                            update={async (section, data) => {
                                // Wrapper pour compatibilité async
                                await Promise.resolve(update(section as any, data));
                            }}
                        />
                    )}

                    {/* Fallback for unauthorized access */}
                    {((activeTab === "security" || activeTab === "payments" || activeTab === "admin") && role !== "admin") && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <span className="text-4xl mb-4">🚫</span>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Accès non autorisé</h3>
                            <p className="text-gray-500 dark:text-gray-400">Vous n'avez pas les permissions nécessaires pour accéder à cette section.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
