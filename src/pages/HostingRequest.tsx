import React, { useState, useMemo } from 'react';
import {
    Server,
    Database,
    Shield,
    Zap,
    Check,
    ArrowRight,
    ArrowLeft,
    Globe,
    HardDrive,
    Cpu,
    MemoryStick as Memory,
    Network,
    X,
    CreditCard,
    Lock,
} from 'lucide-react';

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
type HostingType = 'shared' | 'vps' | 'dedicated' | 'cloud';

interface HostingOption {
    id: HostingType;
    name: string;
    icon: React.ElementType;
    basePrice: number;
    configurable?: boolean;
}

interface FormData {
    hostingType: HostingType | '';
    cpu: number;
    ram: number;
    storage: number;
    bandwidth: number;
    backups: boolean;
    monitoring: boolean;
    ssl: boolean;
    cdn: boolean;
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    billingCycle: 'monthly' | 'yearly';
    paymentMethod: 'card' | 'paypal' | 'transfer';
}

const HOSTING_TYPES: HostingOption[] = [
    { id: 'shared', name: 'Hébergement Partagé', icon: Globe, basePrice: 4.99 },
    { id: 'vps', name: 'VPS', icon: Server, basePrice: 19.99, configurable: true },
    { id: 'dedicated', name: 'Serveur Dédié', icon: Database, basePrice: 99.99, configurable: true },
    { id: 'cloud', name: 'Cloud Hosting', icon: Zap, basePrice: 14.99 },
];

const STEPS = [
    { number: 1, title: 'Type', icon: Server },
    { number: 2, title: 'Configuration', icon: Cpu },
    { number: 3, title: 'Options', icon: Shield },
    { number: 4, title: 'Coordonnées', icon: Globe },
    { number: 5, title: 'Paiement', icon: Check },
] as const;

// ────────────────────────────────────────────────
// Composants réutilisables
// ────────────────────────────────────────────────
const SliderField = ({
    label,
    icon: Icon,
    value,
    onChange,
    min,
    max,
    step,
    unit,
}: {
    label: string;
    icon: React.ElementType;
    value: number;
    onChange: (v: number) => void;
    min: number;
    max: number;
    step: number;
    unit: string;
}) => (
    <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            {label} : <strong>{value} {unit}</strong>
        </label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:bg-gray-700 dark:accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            <span>{min} {unit}</span>
            <span>{max} {unit}</span>
        </div>
    </div>
);

const OptionCheckbox = ({
    label,
    price,
    checked,
    onChange,
}: {
    label: string;
    price: number;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) => (
    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-200 transition-colors">
        <div className="flex items-center gap-3">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900 dark:text-white">{label}</span>
        </div>
        <span className="text-blue-600 dark:text-blue-400 font-semibold">+€{price}/mois</span>
    </label>
);

// ────────────────────────────────────────────────
// Page principale
// ────────────────────────────────────────────────
export default function HostingRequestForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        hostingType: '',
        cpu: 2,
        ram: 4,
        storage: 80,
        bandwidth: 2,
        backups: false,
        monitoring: false,
        ssl: false,
        cdn: false,
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        billingCycle: 'monthly',
        paymentMethod: 'card',
    });

    const selectedType = useMemo(
        () => HOSTING_TYPES.find((t) => t.id === formData.hostingType),
        [formData.hostingType]
    );

    const isConfigurable = selectedType?.configurable ?? false;

    const calculatePrice = useMemo(() => {
        if (!selectedType) return 0;

        let base = selectedType.basePrice;

        if (isConfigurable) {
            base +=
                (formData.cpu - 2) * 5 +
                (formData.ram - 4) * 3 +
                Math.floor((formData.storage - 80) / 20) * 2 +
                (formData.bandwidth - 2) * 1;
        }

        if (formData.backups) base += 5;
        if (formData.monitoring) base += 3;
        if (formData.ssl) base += 10;
        if (formData.cdn) base += 8;

        if (formData.billingCycle === 'yearly') {
            base = base * 12 * 0.85; // -15%
        }

        return base.toFixed(2);
    }, [formData, selectedType, isConfigurable]);

    const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const canGoNext = () => {
        if (currentStep === 1) return !!formData.hostingType;
        if (currentStep === 4) {
            return formData.companyName.trim() && formData.contactName.trim() && formData.email.includes('@');
        }
        return true;
    };

    const nextStep = () => {
        if (canGoNext() && currentStep < 5) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Configurez votre hébergement
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                        Choisissez la formule adaptée à vos besoins en quelques clics
                    </p>
                </div>

                {/* Barre de progression */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 p-6 mb-8">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, idx) => {
                            const StepIcon = step.icon;
                            const isActive = currentStep === step.number;
                            const isCompleted = currentStep > step.number;

                            return (
                                <React.Fragment key={step.number}>
                                    <div className="flex flex-col items-center flex-1">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-sm transition-all ${isCompleted
                                                ? 'bg-green-500 text-white'
                                                : isActive
                                                    ? 'bg-blue-600 text-white ring-2 ring-blue-300 dark:ring-blue-700'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                                }`}
                                        >
                                            {isCompleted ? <Check className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                                        </div>
                                        <span
                                            className={`text-xs md:text-sm font-medium ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'
                                                }`}
                                        >
                                            {step.title}
                                        </span>
                                    </div>

                                    {idx < STEPS.length - 1 && (
                                        <div
                                            className={`hidden sm:block flex-1 h-1 mx-3 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                                                }`}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Contenu de l'étape */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 p-6 md:p-10">
                    {/* Étape 1 - Type */}
                    {currentStep === 1 && (
                        <>
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Choisissez votre type d'hébergement</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                                {HOSTING_TYPES.map((type) => {
                                    const Icon = type.icon;
                                    const selected = formData.hostingType === type.id;
                                    return (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => update('hostingType', type.id)}
                                            className={`group relative rounded-2xl border-2 p-6 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${selected
                                                ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 shadow-blue-200/50 dark:shadow-blue-900/30'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                                                    <Icon className="w-7 h-7 text-white" />
                                                </div>
                                                {selected && (
                                                    <div className="bg-green-500 text-white rounded-full p-1">
                                                        <Check className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold mb-1">{type.name}</h3>
                                            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                                                €{type.basePrice}
                                                <span className="text-base font-normal">/mois</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Étape 2 - Configuration (seulement si configurable) */}
                    {currentStep === 2 && (
                        isConfigurable ? (
                            <>
                                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Personnalisez votre serveur</h2>
                                <div className="space-y-8 max-w-3xl mx-auto">
                                    <SliderField
                                        label="vCPU"
                                        icon={Cpu}
                                        value={formData.cpu}
                                        onChange={(v) => update('cpu', v)}
                                        min={2}
                                        max={16}
                                        step={2}
                                        unit="vCPU"
                                    />
                                    <SliderField
                                        label="RAM"
                                        icon={Memory}
                                        value={formData.ram}
                                        onChange={(v) => update('ram', v)}
                                        min={4}
                                        max={64}
                                        step={4}
                                        unit="Go"
                                    />
                                    <SliderField
                                        label="Stockage SSD"
                                        icon={HardDrive}
                                        value={formData.storage}
                                        onChange={(v) => update('storage', v)}
                                        min={80}
                                        max={1000}
                                        step={20}
                                        unit="Go"
                                    />
                                    <SliderField
                                        label="Bande passante"
                                        icon={Network}
                                        value={formData.bandwidth}
                                        onChange={(v) => update('bandwidth', v)}
                                        min={2}
                                        max={20}
                                        step={2}
                                        unit="To/mois"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <h3 className="text-2xl font-bold mb-4">Aucune configuration supplémentaire</h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                    L'offre {selectedType?.name} est optimisée avec des ressources déjà adaptées.
                                </p>
                            </div>
                        )
                    )}

                    {/* Étape 3 - Options */}
                    {currentStep === 3 && (
                        <>
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Options supplémentaires</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                                <OptionCheckbox
                                    label="Sauvegardes automatiques (J+7)"
                                    price={5}
                                    checked={formData.backups}
                                    onChange={(v) => update('backups', v)}
                                />
                                <OptionCheckbox
                                    label="Monitoring Pro 24/7"
                                    price={3}
                                    checked={formData.monitoring}
                                    onChange={(v) => update('monitoring', v)}
                                />
                                <OptionCheckbox
                                    label="Certificat SSL Wildcard"
                                    price={10}
                                    checked={formData.ssl}
                                    onChange={(v) => update('ssl', v)}
                                />
                                <OptionCheckbox
                                    label="CDN Global"
                                    price={8}
                                    checked={formData.cdn}
                                    onChange={(v) => update('cdn', v)}
                                />
                            </div>
                        </>
                    )}

                    {/* Étape 4 - Coordonnées */}
                    {currentStep === 4 && (
                        <>
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Vos informations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Nom de l'entreprise</label>
                                    <input
                                        type="text"
                                        placeholder="Votre entreprise"
                                        value={formData.companyName}
                                        onChange={(e) => update('companyName', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Nom du contact</label>
                                    <input
                                        type="text"
                                        placeholder="Votre nom"
                                        value={formData.contactName}
                                        onChange={(e) => update('contactName', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email professionnel</label>
                                    <input
                                        type="email"
                                        placeholder="contact@entreprise.com"
                                        value={formData.email}
                                        onChange={(e) => update('email', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Téléphone</label>
                                    <input
                                        type="tel"
                                        placeholder="+33 6 12 34 56 78"
                                        value={formData.phone}
                                        onChange={(e) => update('phone', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Étape 5 - Paiement et Récap */}
                    {currentStep === 5 && (
                        <>
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Récapitulatif & Paiement</h2>
                            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-12">
                                    {/* Colonne de gauche : Options & Paiement */}
                                    <div className="md:col-span-7 p-6 md:p-8 space-y-8">
                                        <div>
                                            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">1. Cycle de facturation</h3>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => update('billingCycle', 'monthly')}
                                                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${formData.billingCycle === 'monthly'
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                        }`}
                                                >
                                                    Mensuel
                                                </button>
                                                <button
                                                    onClick={() => update('billingCycle', 'yearly')}
                                                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all relative overflow-hidden ${formData.billingCycle === 'yearly'
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                        }`}
                                                >
                                                    Annuel <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1">-15%</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">2. Moyen de paiement</h3>
                                            <div className="space-y-3">
                                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500 shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}>
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        value="card"
                                                        checked={formData.paymentMethod === 'card'}
                                                        onChange={() => update('paymentMethod', 'card')}
                                                        className="hidden"
                                                    />
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4 shrink-0">
                                                        <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                                            Carte Bancaire
                                                            <div className="flex gap-1 ml-2">
                                                                <div className="h-4 w-6 bg-gray-200 rounded"></div>
                                                                <div className="h-4 w-6 bg-gray-200 rounded"></div>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-gray-500">Paiement sécurisé par Stripe (SSL 256-bit)</div>
                                                    </div>
                                                    {formData.paymentMethod === 'card' && <div className="bg-blue-500 text-white p-1 rounded-full"><Check className="w-4 h-4" /></div>}
                                                </label>

                                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500 shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}>
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        value="paypal"
                                                        checked={formData.paymentMethod === 'paypal'}
                                                        onChange={() => update('paymentMethod', 'paypal')}
                                                        className="hidden"
                                                    />
                                                    <div className="w-10 h-10 rounded-full bg-[#003087]/10 flex items-center justify-center mr-4 shrink-0">
                                                        <Globe className="w-5 h-5 text-[#003087]" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-gray-900 dark:text-gray-100">PayPal</div>
                                                        <div className="text-sm text-gray-500">Simple, rapide et sécurisé</div>
                                                    </div>
                                                    {formData.paymentMethod === 'paypal' && <div className="bg-blue-500 text-white p-1 rounded-full"><Check className="w-4 h-4" /></div>}
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Colonne de droite : Résumé de la commande */}
                                    <div className="md:col-span-5 bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
                                        <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                                            <Server className="w-5 h-5 text-blue-500" />
                                            Résumé de la commande
                                        </h3>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white">{selectedType?.name}</div>
                                                    <div className="text-sm text-gray-500">{isConfigurable ? 'Configuration personnalisée' : 'Pack Standard'}</div>
                                                </div>
                                                <div className="font-semibold text-gray-900 dark:text-white">€{selectedType?.basePrice}</div>
                                            </div>

                                            <div className="space-y-3 mb-6 text-sm text-gray-600 dark:text-gray-400">
                                                {isConfigurable && (
                                                    <>
                                                        <div className="flex justify-between"><span>CPU ({formData.cpu} vCPU)</span><span>Inclus</span></div>
                                                        <div className="flex justify-between"><span>RAM ({formData.ram} Go)</span><span>Inclus</span></div>
                                                        <div className="flex justify-between"><span>SSD ({formData.storage} Go)</span><span>Inclus</span></div>
                                                    </>
                                                )}
                                                {formData.backups && <div className="flex justify-between"><span>Sauvegardes J+7</span><span>€5.00</span></div>}
                                                {formData.monitoring && <div className="flex justify-between"><span>Monitoring Pro</span><span>€3.00</span></div>}
                                                {formData.ssl && <div className="flex justify-between"><span>Certificat SSL</span><span>€10.00</span></div>}
                                                {formData.cdn && <div className="flex justify-between"><span>CDN Global</span><span>€8.00</span></div>}

                                                {formData.billingCycle === 'yearly' && (
                                                    <div className="flex justify-between text-green-600 font-medium pt-2">
                                                        <span>Remise Annuelle (-15%)</span>
                                                        <span>-€{((Number(calculatePrice) / 0.85) * 0.15).toFixed(2)} /mois</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-500">Sous-total (HT)</span>
                                                <span className="font-medium">€{(Number(calculatePrice) * 0.833).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-gray-500">TVA (20%)</span>
                                                <span className="font-medium">€{(Number(calculatePrice) * 0.167).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-6">
                                                <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                                                <div className="text-right">
                                                    <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">€{calculatePrice}</div>
                                                    <div className="text-xs text-gray-500">/{formData.billingCycle === 'yearly' ? 'an' : 'mois'}</div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="flex items-start gap-3 cursor-pointer">
                                                    <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300" />
                                                    <span className="text-xs text-gray-500 leading-tight">
                                                        J'accepte les <a href="#" className="text-blue-600 underline">conditions générales de vente</a> et la politique de confidentialité.
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Navigation */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-medium transition-colors min-w-[140px] ${currentStep === 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Précédent
                        </button>

                        {currentStep < 5 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                disabled={!canGoNext()}
                                className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-medium text-white transition-colors min-w-[140px] ${!canGoNext()
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20'
                                    }`}
                            >
                                Suivant
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => alert(`Redirection vers ${formData.paymentMethod === 'card' ? 'Stripe' : 'PayPal'}... (Simulation)`)}
                                className="flex items-center justify-center gap-2 px-10 py-3.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-lg shadow-green-500/20 min-w-[180px]"
                            >
                                <Lock className="w-4 h-4" />
                                Payer €{calculatePrice} avec {formData.paymentMethod === 'card' ? 'Stripe' : 'PayPal'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Prix en direct (fixe en bas sur mobile) */}
                {formData.hostingType && (
                    <div className="fixed bottom-6 left-4 right-4 sm:static sm:mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-2xl sm:shadow-xl text-center z-20">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Estimation {formData.billingCycle === 'yearly' ? '(annuel -15%)' : '(mensuel)'}
                        </div>
                        <div className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                            €{calculatePrice}
                            <span className="text-xl font-normal"> /mois</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
