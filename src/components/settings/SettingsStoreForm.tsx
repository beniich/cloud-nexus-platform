import { SettingsState } from "@/types/settings";

interface Props {
    settings: SettingsState;
    update: <K extends keyof SettingsState>(k: K, v: SettingsState[K]) => void;
}

export default function SettingsStoreForm({ settings, update }: Props) {
    return (
        <section className="space-y-6 animate-fade-in">
            <div className="border-b pb-4 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Paramètres de la Boutique</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez les informations principales de votre boutique.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de la boutique</label>
                    <input
                        value={settings.storeName}
                        onChange={(e) => update("storeName", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Ex: Ma Super Boutique"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                        value={settings.storeDescription}
                        onChange={(e) => update("storeDescription", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[120px]"
                        placeholder="Décrivez votre activité..."
                    />
                </div>
            </div>
        </section>
    );
}
