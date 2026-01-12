import React, { useState, useEffect } from 'react';
import {
    Server, Database, Shield, Zap, Check, ArrowRight, ArrowLeft,
    Globe, HardDrive, Cpu, MemoryStick, Network
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

const HostingRequestForm = () => {
    const { emitNewRequest } = useNotifications();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1
        hostingType: 'shared',
        // Step 2 - seulement pertinent pour VPS / Dédié
        cpu: 2,
        ram: 4,
        storage: 80,
        bandwidth: 2,
        // Step 3
        os: 'ubuntu',
        backups: false,
        monitoring: false,
        ssl: false,
        cdn: false,
        // Step 4
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        // Step 5
        billingCycle: 'monthly',
        paymentMethod: 'card'
    });

    const [calculatedPrice, setCalculatedPrice] = useState(0);
    const [displayPrice, setDisplayPrice] = useState(0); // prix affiché selon cycle

    const hostingTypes = [
        { id: 'shared', name: 'Hébergement Partagé', description: 'Idéal pour les sites web simples', icon: Globe, basePrice: 4.99, features: ['1-5 sites web', '10-50 GB SSD', 'Support 24/7', 'SSL gratuit'] },
        { id: 'vps', name: 'VPS', description: 'Serveur virtuel dédié', icon: Server, basePrice: 19.99, features: ['Ressources dédiées', 'Root access', 'IP dédiée', 'Snapshots'] },
        { id: 'dedicated', name: 'Serveur Dédié', description: 'Performance maximale', icon: Database, basePrice: 99.99, features: ['Matériel dédié', 'Gestion complète', 'RAID', 'DDoS protection'] },
        { id: 'cloud', name: 'Cloud Hosting', description: 'Infrastructure scalable', icon: Zap, basePrice: 14.99, features: ['Auto-scaling', 'Load balancing', 'CDN inclus', 'Haute disponibilité'] }
    ];

    const operatingSystems = [
        { id: 'ubuntu', name: 'Ubuntu 22.04 LTS', logo: '🐧' },
        { id: 'debian', name: 'Debian 11', logo: '🌀' },
        { id: 'centos', name: 'CentOS 8', logo: '💜' },
        { id: 'windows', name: 'Windows Server 2022', logo: '🪟', extraCost: 15 }
    ];

    const steps = [
        { number: 1, title: 'Type', icon: Server },
        { number: 2, title: 'Config', icon: Cpu },
        { number: 3, title: 'Options', icon: Shield },
        { number: 4, title: 'Infos', icon: Globe },
        { number: 5, title: 'Paiement', icon: Check }
    ];

    // Calcul du prix mensuel de base
    useEffect(() => {
        let price = 0;
        const selectedType = hostingTypes.find(t => t.id === formData.hostingType);

        if (selectedType) {
            price = selectedType.basePrice;

            // Suppléments ressources → uniquement VPS et Dedicated
            if (['vps', 'dedicated'].includes(formData.hostingType)) {
                price += (formData.cpu - 2) * 5;
                price += (formData.ram - 4) * 3;
                price += (formData.storage - 80) / 20 * 2;
                price += (formData.bandwidth - 2) * 1;
            }

            // Options
            if (formData.backups) price += 5;
            if (formData.monitoring) price += 3;
            if (formData.ssl) price += 10;
            if (formData.cdn) price += 8;

            // OS Windows
            const selectedOS = operatingSystems.find(os => os.id === formData.os);
            if (selectedOS?.extraCost) price += selectedOS.extraCost;

            setCalculatedPrice(price); // prix mensuel de base
        } else {
            setCalculatedPrice(0);
        }
    }, [formData]);

    // Prix affiché (mensuel ou annuel avec remise)
    useEffect(() => {
        if (formData.billingCycle === 'yearly') {
            setDisplayPrice(calculatedPrice * 12 * 0.85);
        } else {
            setDisplayPrice(calculatedPrice);
        }
    }, [calculatedPrice, formData.billingCycle]);

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const canGoNext = () => {
        if (currentStep === 1) return !!formData.hostingType;
        if (currentStep === 4) {
            return formData.companyName.trim() &&
                formData.contactName.trim() &&
                formData.email.includes('@') &&
                formData.phone.trim().length > 8;
        }
        return true;
    };

    const nextStep = () => {
        if (currentStep < 5 && canGoNext()) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = () => {
        const request = { ...formData, price: displayPrice, submittedAt: new Date().toISOString() };
        console.log('Soumission finale :', request);
        emitNewRequest(request);
        alert('Demande d\'hébergement envoyée avec succès !\nPrix : ' + displayPrice.toFixed(2) + ' €');
        // → ici tu peux appeler une API, envoyer un email, etc.
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Demande d'Hébergement
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Configurez votre solution en quelques étapes
                    </p>
                </div>

                {/* Barre de progression */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, idx) => {
                            const StepIcon = step.icon;
                            const isActive = currentStep === step.number;
                            const isCompleted = currentStep > step.number;

                            return (
                                <React.Fragment key={step.number}>
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${isCompleted ? 'bg-green-500 text-white' :
                                                isActive ? 'bg-blue-600 text-white ring-2 ring-blue-300' :
                                                    'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                            }`}>
                                            {isCompleted ? <Check className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                                        </div>
                                        <span className={`text-xs sm:text-sm font-medium ${isActive || isCompleted ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div className={`hidden sm:block flex-1 h-1 mx-2 rounded-full ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                                            }`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">

                    {/* ── Étape 1 ── */}
                    {currentStep === 1 && (
                        <>
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Type d'hébergement</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {hostingTypes.map(type => {
                                    const TypeIcon = type.icon;
                                    const selected = formData.hostingType === type.id;
                                    return (
                                        <div
                                            key={type.id}
                                            onClick={() => updateFormData('hostingType', type.id)}
                                            className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-md ${selected
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-blue-200/50'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                                    <TypeIcon className="w-7 h-7 text-white" />
                                                </div>
                                                {selected && <Check className="w-7 h-7 text-blue-600" />}
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{type.name}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">{type.description}</p>
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                                                Dès {type.basePrice.toFixed(2)} €<span className="text-base">/mois</span>
                                            </div>
                                            <ul className="space-y-2 text-sm">
                                                {type.features.map((f, i) => (
                                                    <li key={i} className="flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-500" /> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* ── Étape 2 ── Configuration */}
                    {currentStep === 2 && (
                        <>
                            {['vps', 'dedicated'].includes(formData.hostingType) ? (
                                <>
                                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Configuration serveur</h2>
                                    <div className="space-y-8">
                                        {[
                                            { key: 'cpu', icon: Cpu, label: 'vCPU', min: 2, max: 16, step: 2, unit: '' },
                                            { key: 'ram', icon: MemoryStick, label: 'GB RAM', min: 4, max: 64, step: 4, unit: '' },
                                            { key: 'storage', icon: HardDrive, label: 'GB SSD', min: 80, max: 2000, step: 20, unit: '' },
                                            { key: 'bandwidth', icon: Network, label: 'TB/mois', min: 2, max: 20, step: 2, unit: '' }
                                        ].map(item => (
                                            <div key={item.key}>
                                                <label className="flex items-center gap-3 text-base font-medium mb-4 text-gray-800 dark:text-gray-200">
                                                    <item.icon className="w-6 h-6 text-blue-600" />
                                                    {item.label}: {formData[item.key as keyof typeof formData]}{item.unit}
                                                </label>
                                                <input
                                                    type="range"
                                                    min={item.min}
                                                    max={item.max}
                                                    step={item.step}
                                                    value={formData[item.key as keyof typeof formData] as number}
                                                    onChange={e => updateFormData(item.key, parseInt(e.target.value))}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:bg-gray-700"
                                                />
                                                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                                                    <span>{item.min}{item.unit}</span>
                                                    <span>{item.max}{item.unit}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <h3 className="text-xl font-semibold mb-4">Pas de configuration personnalisée</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Les offres {hostingTypes.find(t => t.id === formData.hostingType)?.name} ont des ressources prédéfinies.
                                    </p>
                                    <div className="mt-8">
                                        {/* Placeholder for visuals or info */}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* ── Étape 3 ── Options */}
                    {currentStep === 3 && (
                        <>
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Options & Logiciels</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Système d'exploitation</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {operatingSystems.map(os => (
                                            <div
                                                key={os.id}
                                                onClick={() => updateFormData('os', os.id)}
                                                className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center gap-2 transition-all ${formData.os === os.id
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                        : 'border-gray-200 dark:border-gray-700'
                                                    }`}
                                            >
                                                <span className="text-2xl">{os.logo}</span>
                                                <span className="font-medium text-sm text-center">{os.name}</span>
                                                {os.extraCost && (
                                                    <span className="text-xs text-orange-500">+{os.extraCost}€/mois</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Options supplémentaires</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { id: 'backups', label: 'Sauvegardes auto.', price: 5, icon: Database },
                                            { id: 'monitoring', label: 'Monitoring avancé', price: 3, icon: Zap },
                                            { id: 'ssl', label: 'Certificat SSL Premium', price: 10, icon: Shield },
                                            { id: 'cdn', label: 'CDN Global', price: 8, icon: Globe },
                                        ].map(opt => (
                                            <div
                                                key={opt.id}
                                                onClick={() => updateFormData(opt.id, !formData[opt.id as keyof typeof formData])}
                                                className={`cursor-pointer rounded-lg border p-4 flex items-center justify-between transition-all ${formData[opt.id as keyof typeof formData]
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                        : 'border-gray-200 dark:border-gray-700'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <opt.icon className={`w-5 h-5 ${formData[opt.id as keyof typeof formData] ? 'text-blue-500' : 'text-gray-400'
                                                        }`} />
                                                    <span className="font-medium">{opt.label}</span>
                                                </div>
                                                <div className="text-sm font-semibold">
                                                    +{opt.price}€/mois
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Étape 4 ── Infos */}
                    {currentStep === 4 && (
                        <>
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Vos informations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2">Nom de l'entreprise</label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={e => updateFormData('companyName', e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                        placeholder="Votre entreprise"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nom du contact</label>
                                    <input
                                        type="text"
                                        value={formData.contactName}
                                        onChange={e => updateFormData('contactName', e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => updateFormData('email', e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => updateFormData('phone', e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                        placeholder="+33 6 12 34 56 78"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Étape 5 ── Paiement */}
                    {currentStep === 5 && (
                        <>
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Récapitulatif & Paiement</h2>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl mb-6">
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
                                    <div>
                                        <h3 className="font-bold text-lg">Hébergement {formData.hostingType.toUpperCase()}</h3>
                                        <p className="text-sm text-gray-500">{formData.os.toUpperCase()} • {formData.cpu}CPU • {formData.ram}GB RAM</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">{displayPrice.toFixed(2)}€</div>
                                        <div className="text-sm text-gray-500">/{formData.billingCycle === 'yearly' ? 'an' : 'mois'}</div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mb-6">
                                    <div
                                        onClick={() => updateFormData('billingCycle', 'monthly')}
                                        className={`flex-1 p-4 rounded-lg border cursor-pointer text-center ${formData.billingCycle === 'monthly'
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-200 dark:border-gray-600'
                                            }`}
                                    >
                                        <div className="font-bold">Mensuel</div>
                                        <div className="text-sm text-gray-500">Pas d'engagement</div>
                                    </div>
                                    <div
                                        onClick={() => updateFormData('billingCycle', 'yearly')}
                                        className={`flex-1 p-4 rounded-lg border cursor-pointer text-center ${formData.billingCycle === 'yearly'
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-200 dark:border-gray-600'
                                            }`}
                                    >
                                        <div className="font-bold">Annuel</div>
                                        <div className="text-sm text-green-500">-15% de réduction</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={formData.paymentMethod === 'card'}
                                            onChange={() => updateFormData('paymentMethod', 'card')}
                                            className="w-5 h-5 text-blue-600"
                                        />
                                        <span>Carte Bancaire</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={formData.paymentMethod === 'paypal'}
                                            onChange={() => updateFormData('paymentMethod', 'paypal')}
                                            className="w-5 h-5 text-blue-600"
                                        />
                                        <span>PayPal</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={formData.paymentMethod === 'crypto'}
                                            onChange={() => updateFormData('paymentMethod', 'crypto')}
                                            className="w-5 h-5 text-blue-600"
                                        />
                                        <span>Crypto (BTC/ETH/USDT)</span>
                                    </label>
                                </div>
                            </div>
                        </>
                    )}


                    {/* Navigation */}
                    <div className="flex justify-between mt-10">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${currentStep === 1
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" /> Précédent
                        </button>

                        {currentStep < 5 ? (
                            <button
                                onClick={nextStep}
                                disabled={!canGoNext()}
                                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition text-white ${canGoNext()
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'bg-blue-400 cursor-not-allowed'
                                    }`}
                            >
                                Suivant <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 px-10 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                            >
                                Valider la demande <Check className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostingRequestForm;
