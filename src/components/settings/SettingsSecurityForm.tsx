import { SettingsState } from "@/types/settings";
import { ShieldAlert } from "lucide-react";

interface Props {
    settings: SettingsState;
    update: <K extends keyof SettingsState>(k: K, v: SettingsState[K]) => void;
}

export default function SettingsSecurityForm({ settings, update }: Props) {
    return (
        <section className="space-y-6 animate-fade-in">
            <div className="border-b pb-4 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sécurité</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configurez les options de sécurité de votre compte.</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3 text-blue-800 dark:text-blue-300 mb-6">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte. Nous recommandons vivement de l'activer.</p>
            </div>

            <label className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => update("twoFactorAuth", e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <div className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100 block">Activer la double authentification (2FA)</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Nécessite un code de vérification à chaque connexion.</span>
                </div>
            </label>
        </section>
    );
}
