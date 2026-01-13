import { SettingsState } from "@/types/settings";

interface Props {
    settings: SettingsState;
    update: <K extends keyof SettingsState>(k: K, v: SettingsState[K]) => void;
}

export default function SettingsNotificationsForm({ settings, update }: Props) {
    return (
        <section className="space-y-6 animate-fade-in">
            <div className="border-b pb-4 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez vos préférences de communication.</p>
            </div>

            <label className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => update("emailNotifications", e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <div className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100 block">Notifications par email</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Recevoir les mises à jour importantes et les alertes de sécurité.</span>
                </div>
            </label>
        </section>
    );
}
