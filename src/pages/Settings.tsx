import React, { useState, useCallback } from 'react';
import {
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    CreditCard,
    Database,
    Save,
    Upload,
    Trash2,
    Check,
    Eye,
    EyeOff,
    Mail,
    Smartphone,
    FileText,
    Sun,
    Moon,
    Monitor,
    Languages,
    Zap,
    HelpCircle,
    Sliders,
    Download,
    Lock,
    X,
} from 'lucide-react';

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
interface Settings {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    role: 'Admin' | 'Manager' | 'User';
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    securityAlerts: boolean;
    weeklyReports: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    dateFormat: string;
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    sessionTimeout: '15' | '30' | '60' | '120';
    autoSave: boolean;
    compactMode: boolean;
    showTutorials: boolean;
    analyticsTracking: boolean;
}

type TabId =
    | 'profile'
    | 'notifications'
    | 'security'
    | 'appearance'
    | 'preferences'
    | 'billing'
    | 'data';

interface Tab {
    id: TabId;
    label: string;
    icon: React.ElementType;
}

// ────────────────────────────────────────────────
// Données statiques
// ────────────────────────────────────────────────
const TABS: Tab[] = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'preferences', label: 'Préférences', icon: Sliders },
    { id: 'billing', label: 'Facturation', icon: CreditCard },
    { id: 'data', label: 'Données', icon: Database },
];

const THEME_OPTIONS = [
    { value: 'light', label: 'Clair', icon: Sun },
    { value: 'dark', label: 'Sombre', icon: Moon },
    { value: 'system', label: 'Système', icon: Monitor },
] as const;

const LANGUAGE_OPTIONS = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
] as const;

// ────────────────────────────────────────────────
// Composants réutilisables
// ────────────────────────────────────────────────
const Toggle = ({ checked, onChange, id }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    id: string;
}) => (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
        <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
        />
        <div className={`
      w-11 h-6 bg-gray-200 rounded-full peer 
      peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
      dark:peer-focus:ring-blue-800 dark:bg-gray-700
      peer-checked:after:translate-x-full peer-checked:after:border-white
      after:content-[''] after:absolute after:top-[2px] after:left-[2px]
      after:bg-white after:border-gray-300 after:border after:rounded-full
      after:h-5 after:w-5 after:transition-all dark:border-gray-600
      peer-checked:bg-blue-600
    `} />
    </label>
);

const SettingToggle = ({
    icon: Icon,
    label,
    description,
    checked,
    onChange,
    color = 'blue',
}: {
    icon: React.ElementType;
    label: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg bg-${color}-100/70 dark:bg-${color}-950/40`}>
                <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
            </div>
            <div>
                <div className="font-medium text-gray-900 dark:text-white">{label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</div>
            </div>
        </div>
        <Toggle checked={checked} onChange={onChange} id={`toggle-${label.toLowerCase().replace(/\s/g, '-')}`} />
    </div>
);

// ────────────────────────────────────────────────
// Page principale
// ────────────────────────────────────────────────
export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>('profile');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [settings, setSettings] = useState<Settings>({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+33 6 12 34 56 78',
        company: 'TechCorp SA',
        role: 'Admin',
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        marketingEmails: true,
        securityAlerts: true,
        weeklyReports: true,
        theme: 'system',
        language: 'fr',
        timezone: 'Europe/Paris',
        dateFormat: 'DD/MM/YYYY',
        twoFactorAuth: false,
        loginAlerts: true,
        sessionTimeout: '30',
        autoSave: true,
        compactMode: false,
        showTutorials: true,
        analyticsTracking: true,
    });

    const [saveSuccess, setSaveSuccess] = useState(false);

    const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaveSuccess(false);
    }, []);

    const handleSave = () => {
        // Ici : appel API / localStorage / etc.
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Personnalisation du compte et de l’interface</p>
                    </div>

                    <button
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                    >
                        <Save size={18} />
                        Enregistrer
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {saveSuccess && (
                    <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-green-800 dark:text-green-300">
                            Modifications enregistrées avec succès
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3 xl:col-span-2">
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-2 sticky top-24">
                            {TABS.map(tab => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                      ${isActive
                                                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                                            }
                    `}
                                    >
                                        <Icon size={18} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Contenu principal */}
                    <section className="lg:col-span-9 xl:col-span-10">
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 md:p-8">

                            {activeTab === 'profile' && (
                                <>
                                    <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
                                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-md">
                                            {settings.firstName[0] || '?'}{settings.lastName[0] || ''}
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                                                <Upload size={16} /> Changer la photo
                                            </button>
                                            <button className="px-5 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2 transition-colors">
                                                <Trash2 size={16} /> Supprimer
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { key: 'firstName', label: 'Prénom', type: 'text' },
                                            { key: 'lastName', label: 'Nom', type: 'text' },
                                            { key: 'email', label: 'Adresse email', type: 'email' },
                                            { key: 'phone', label: 'Téléphone', type: 'tel' },
                                            { key: 'company', label: 'Entreprise', type: 'text' },
                                        ].map(field => (
                                            <div key={field.key}>
                                                <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                    {field.label}
                                                </label>
                                                <input
                                                    id={field.key}
                                                    type={field.type}
                                                    value={settings[field.key as keyof Settings]}
                                                    onChange={e => update(field.key as any, e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                                />
                                            </div>
                                        ))}

                                        <div>
                                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                Rôle
                                            </label>
                                            <select
                                                id="role"
                                                value={settings.role}
                                                onChange={e => update('role', e.target.value as Settings['role'])}
                                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                            >
                                                <option value="Admin">Administrateur</option>
                                                <option value="Manager">Manager</option>
                                                <option value="User">Utilisateur</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'notifications' && (
                                <>
                                    <h2 className="text-xl font-semibold mb-6">Notifications</h2>
                                    <div className="space-y-4">
                                        <SettingToggle
                                            icon={Mail}
                                            label="Emails de notification"
                                            description="Recevoir les mises à jour importantes par email"
                                            checked={settings.emailNotifications}
                                            onChange={v => update('emailNotifications', v)}
                                        />
                                        <SettingToggle
                                            icon={Bell}
                                            label="Notifications push"
                                            description="Alertes directement dans le navigateur"
                                            checked={settings.pushNotifications}
                                            onChange={v => update('pushNotifications', v)}
                                        />
                                        {/* ... autres toggles de la même façon */}
                                    </div>
                                </>
                            )}

                            {/* Autres onglets → même logique */}

                            {/* Exemple security */}
                            {activeTab === 'billing' && (
                                <>
                                    <h2 className="text-xl font-semibold mb-6">Abonnement & Facturation</h2>

                                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl mb-8">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">Plan Simulation</h3>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${localStorage.getItem('cnp_simulation_plan') === 'premium'
                                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                                                            : 'bg-gray-200 text-gray-700'
                                                        }`}>
                                                        {localStorage.getItem('cnp_simulation_plan') === 'premium' ? 'Premium' : 'Gratuit'}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300 max-w-lg mb-6">
                                                    Pour tester les permissions : le plan "Gratuit" donne accès au tableau de bord. Le plan "Premium" débloque la création de sites web.
                                                </p>

                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => {
                                                            localStorage.setItem('cnp_simulation_plan', 'free');
                                                            window.location.reload();
                                                        }}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${localStorage.getItem('cnp_simulation_plan') !== 'premium'
                                                                ? 'bg-white border-2 border-indigo-600 text-indigo-600 shadow-sm'
                                                                : 'bg-white/50 border border-indigo-200 text-gray-600 hover:bg-white'
                                                            }`}
                                                    >
                                                        Activer Plan Gratuit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            localStorage.setItem('cnp_simulation_plan', 'premium');
                                                            window.location.reload();
                                                        }}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${localStorage.getItem('cnp_simulation_plan') === 'premium'
                                                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                                                                : 'bg-white/50 border border-indigo-200 text-gray-600 hover:bg-white'
                                                            }`}
                                                    >
                                                        Activer Plan Premium
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                                <CreditCard className="w-8 h-8 text-indigo-600" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-medium mb-4">Historique de facturation</h3>
                                        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-200 rounded-xl">
                                            Aucune facture disponible pour le moment.
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'security' && (
                                <>
                                    <h2 className="text-xl font-semibold mb-6">Sécurité du compte</h2>

                                    <div className="mb-10">
                                        <h3 className="font-medium mb-4">Modifier le mot de passe</h3>
                                        <div className="space-y-4 max-w-md">
                                            <div>
                                                <label className="block text-sm font-medium mb-1.5">Mot de passe actuel</label>
                                                <div className="relative">
                                                    <input
                                                        type={showCurrentPassword ? 'text' : 'password'}
                                                        className="w-full px-4 py-2.5 pr-11 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(p => !p)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                        aria-label={showCurrentPassword ? 'Masquer' : 'Afficher'}
                                                    >
                                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Nouveau MDP + confirmation */}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <SettingToggle
                                            icon={Shield}
                                            label="Authentification à deux facteurs"
                                            description="Ajoute une couche de sécurité supplémentaire"
                                            checked={settings.twoFactorAuth}
                                            onChange={v => update('twoFactorAuth', v)}
                                            color="green"
                                        />
                                        {/* ... */}
                                    </div>
                                </>
                            )}

                            {/* Les autres onglets suivent la même logique */}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
