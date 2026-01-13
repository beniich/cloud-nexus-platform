import { SettingsState } from "@/types/settings";

interface Props {
    settings: SettingsState;
    update: <K extends keyof SettingsState>(k: K, v: SettingsState[K]) => void;
}

export default function SettingsPaymentsForm({ settings, update }: Props) {
    return (
        <section className="space-y-6 animate-fade-in">
            <div className="border-b pb-4 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Paiements</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez vos moyens de paiement et votre historique.</p>
            </div>
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <p>Le module de paiements est en cours de développement.</p>
            </div>
        </section>
    );
}
