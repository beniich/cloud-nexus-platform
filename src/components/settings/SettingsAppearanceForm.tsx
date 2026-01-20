import { SettingsState } from "@/types/settings";
import { Monitor, Moon, Sun, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
    settings: SettingsState;
    update: <K extends keyof SettingsState>(k: K, v: SettingsState[K]) => void;
}

export default function SettingsAppearanceForm({ settings, update }: Props) {
    const themes = [
        { id: "light", label: "Clair", icon: Sun },
        { id: "dark", label: "Sombre", icon: Moon },
        { id: "system", label: "Système", icon: Monitor },
    ] as const;

    return (
        <section className="space-y-6 animate-fade-in">
            <div className="border-b pb-4 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Apparence</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Personnalisez l'apparence de l'application.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {themes.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => update("theme", id)}
                        className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-200 gap-3 ${settings.theme === id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                            }`}
                    >
                        <Icon className="w-8 h-8" />
                        <span className="font-medium">{label}</span>
                    </button>
                ))}
            </div>
            <div className="pt-6 border-t dark:border-gray-700">
                <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Personnalisation de la marque</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Modifiez le logo affiché sur le dashboard.</p>
                </div>

                <div className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="logo">URL du Logo</Label>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                id="logo"
                                placeholder="https://exemple.com/logo.png"
                                value={settings.logoUrl || ""}
                                onChange={(e) => update("logoUrl", e.target.value)}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">Entrez l'URL de votre logo (PNG, SVG, JPG).</p>
                    </div>

                    {settings.logoUrl && (
                        <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                            <p className="text-sm font-medium mb-2">Aperçu :</p>
                            <img src={settings.logoUrl} alt="Logo Preview" className="h-10 object-contain" />
                        </div>
                    )}
                </div>
            </div>
        </section >
    );
}
