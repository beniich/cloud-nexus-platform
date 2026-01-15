import React, { useState } from 'react';
import { Server, Database, Shield, Zap, Check, ArrowRight, ArrowLeft, Globe, HardDrive, Cpu, MemoryStick, Network, LucideIcon } from 'lucide-react';

interface HostingType {
    id: string;
    name: string;
    icon: LucideIcon;
    basePrice: number;
}

interface Step {
    number: number;
    title: string;
    icon: LucideIcon;
}

interface FormData {
    hostingType: string;
    cpu: number;
    ram: number;
    storage: number;
    bandwidth: number;
    os: string;
    backups: boolean;
    monitoring: boolean;
    ssl: boolean;
    cdn: boolean;
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    billingCycle: 'monthly' | 'yearly';
    paymentMethod: string;
    [key: string]: string | number | boolean;
}

const HostingRequestForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        hostingType: '', cpu: 2, ram: 4, storage: 80, bandwidth: 2,
        os: 'ubuntu', backups: false, monitoring: false, ssl: false, cdn: false,
        companyName: '', contactName: '', email: '', phone: '',
        billingCycle: 'monthly', paymentMethod: 'card'
    });

    const hostingTypes: HostingType[] = [
        { id: 'shared', name: 'Hébergement Partagé', icon: Globe, basePrice: 4.99 },
        { id: 'vps', name: 'VPS', icon: Server, basePrice: 19.99 },
        { id: 'dedicated', name: 'Serveur Dédié', icon: Database, basePrice: 99.99 },
        { id: 'cloud', name: 'Cloud Hosting', icon: Zap, basePrice: 14.99 }
    ];

    const steps: Step[] = [
        { number: 1, title: 'Type', icon: Server },
        { number: 2, title: 'Config', icon: Cpu },
        { number: 3, title: 'Options', icon: Shield },
        { number: 4, title: 'Info', icon: Globe },
        { number: 5, title: 'Paiement', icon: Check }
    ];

    const calculatePrice = () => {
        let price = 0;
        const type = hostingTypes.find(t => t.id === formData.hostingType);
        if (type) {
            price = type.basePrice;
            if (formData.hostingType === 'vps' || formData.hostingType === 'dedicated') {
                price += (formData.cpu - 2) * 5 + (formData.ram - 4) * 3 +
                    (formData.storage - 80) / 20 * 2 + (formData.bandwidth - 2);
            }
            if (formData.backups) price += 5;
            if (formData.monitoring) price += 3;
            if (formData.ssl) price += 10;
            if (formData.cdn) price += 8;
            if (formData.billingCycle === 'yearly') price = price * 12 * 0.85;
        }
        return price.toFixed(2);
    };

    const updateFormData = (field: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Demande d'Hébergement</h1>
                    <p className="text-gray-600 dark:text-gray-400">Configurez votre solution en quelques étapes</p>
                </div>

                {/* Progress */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        {steps.map((step, idx) => {
                            const StepIcon = step.icon;
                            const isActive = currentStep === step.number;
                            const isCompleted = currentStep > step.number;
                            return (
                                <React.Fragment key={step.number}>
                                    <div className="flex flex-col items-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                                            } text-white`}>
                                            {isCompleted ? <Check className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                                        </div>
                                        <span className={`text-sm font-medium ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div className={`flex-1 h-1 mx-4 rounded ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
                    {/* Step 1 */}
                    {currentStep === 1 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Type d'hébergement</h2>
                            <div className="grid grid-cols-2 gap-6">
                                {hostingTypes.map(type => {
                                    const TypeIcon = type.icon;
                                    const isSelected = formData.hostingType === type.id;
                                    return (
                                        <div key={type.id} onClick={() => updateFormData('hostingType', type.id)}
                                            className={`cursor-pointer rounded-lg border-2 p-6 ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                                            <div className="flex justify-between mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                    <TypeIcon className="w-6 h-6 text-white" />
                                                </div>
                                                {isSelected && <Check className="w-6 h-6 text-blue-500" />}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{type.name}</h3>
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">€{type.basePrice}/mois</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 2 */}
                    {currentStep === 2 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Configuration</h2>
                            <div className="space-y-6">
                                {[
                                    { key: 'cpu', label: 'CPU', icon: Cpu, min: 2, max: 16, step: 2, unit: 'vCPU' },
                                    { key: 'ram', label: 'RAM', icon: MemoryStick, min: 4, max: 64, step: 4, unit: 'GB' },
                                    { key: 'storage', label: 'Stockage', icon: HardDrive, min: 80, max: 1000, step: 20, unit: 'GB SSD' },
                                    { key: 'bandwidth', label: 'Bande passante', icon: Network, min: 2, max: 20, step: 2, unit: 'TB' }
                                ].map(({ key, label, icon: Icon, min, max, step, unit }) => (
                                    <div key={key}>
                                        <label className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                                            <Icon className="w-5 h-5 text-blue-500" />
                                            {label}: {formData[key]} {unit}
                                        </label>
                                        <input type="range" min={min} max={max} step={step} value={formData[key] as number}
                                            onChange={(e) => updateFormData(key, parseInt(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            <span>{min} {unit}</span>
                                            <span>{max} {unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3 */}
                    {currentStep === 3 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Options</h2>
                            <div className="space-y-3">
                                {[
                                    { key: 'backups', label: 'Sauvegardes automatiques', price: 5 },
                                    { key: 'monitoring', label: 'Monitoring 24/7', price: 3 },
                                    { key: 'ssl', label: 'Certificat SSL premium', price: 10 },
                                    { key: 'cdn', label: 'CDN global', price: 8 }
                                ].map(({ key, label, price }) => (
                                    <label key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" checked={formData[key] as boolean}
                                                onChange={(e) => updateFormData(key, e.target.checked)}
                                                className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-900 dark:text-white">{label}</span>
                                        </div>
                                        <span className="text-blue-600 dark:text-blue-400 font-semibold">+€{price}/mois</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4 */}
                    {currentStep === 4 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Vos informations</h2>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { key: 'companyName', label: 'Entreprise', type: 'text' },
                                    { key: 'contactName', label: 'Contact', type: 'text' },
                                    { key: 'email', label: 'Email', type: 'email' },
                                    { key: 'phone', label: 'Téléphone', type: 'tel' }
                                ].map(({ key, label, type }) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
                                        <input type={type} value={formData[key] as string}
                                            onChange={(e) => updateFormData(key, e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 5 */}
                    {currentStep === 5 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Paiement</h2>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {[
                                    { id: 'monthly', label: 'Mensuel', discount: false },
                                    { id: 'yearly', label: 'Annuel', discount: true }
                                ].map(({ id, label, discount }) => (
                                    <div key={id} onClick={() => updateFormData('billingCycle', id)}
                                        className={`cursor-pointer rounded-lg border-2 p-4 relative ${formData.billingCycle === id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                                        {discount && <span className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">-15%</span>}
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-900 dark:text-white">{label}</span>
                                            {formData.billingCycle === id && <Check className="w-5 h-5 text-blue-500" />}
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">€{calculatePrice()}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Récapitulatif</h3>
                                <div className="flex justify-between items-center border-t border-gray-300 dark:border-gray-500 pt-4">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total:</span>
                                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">€{calculatePrice()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                    <button onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${currentStep === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'}`}>
                        <ArrowLeft className="w-5 h-5" />
                        Précédent
                    </button>
                    {currentStep < 5 ? (
                        <button onClick={() => setCurrentStep(currentStep + 1)}
                            disabled={currentStep === 1 && !formData.hostingType}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${currentStep === 1 && !formData.hostingType ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                            Suivant
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button onClick={() => alert('Demande envoyée !')}
                            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold">
                            <Check className="w-5 h-5" />
                            Envoyer la demande
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HostingRequestForm;
