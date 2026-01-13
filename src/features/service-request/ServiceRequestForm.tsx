import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ChevronRight, ChevronLeft, Check, Server, Globe, Database,
    Cpu, Settings, CheckCircle, User
} from 'lucide-react';

interface PricingMatrix {
    server: { [key: string]: { monthly: number; name: string } };
    storage: { baseIncluded: number; extraSSD: number; extraHDD: number };
    setupFees: { [key: string]: number };
    addons: {
        controlPanel: { [key: string]: number };
        ssl: { [key: string]: number };
        backup: { [key: string]: number };
        security: { [key: string]: number };
        support: { [key: string]: number };
        domain: number;
    };
}

const ServiceRequestForm = () => {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<any>({
        fullName: '',
        company: '',
        email: '',
        phone: '',
        country: '',
        serviceType: [],
        otherService: '',
        ram: '4',
        cpu: '2',
        storageType: 'SSD',
        storageSize: '100',
        os: 'Linux',
        controlPanel: 'cPanel',
        ssl: 'letsencrypt',
        backup: 'daily',
        security: [],
        support: '24/7',
        includeDomain: false,
        monthlyBudget: '',
        startDate: '',
        additionalInfo: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [pricing, setPricing] = useState({
        server: 0,
        setupFee: 0,
        addons: 0,
        totalMonthly: 0
    });

    const steps = [
        { id: 1, title: t('serviceRequestPage.steps.info'), icon: Globe },
        { id: 2, title: t('serviceRequestPage.steps.serviceType'), icon: Server },
        { id: 3, title: t('serviceRequestPage.steps.details'), icon: Cpu },
        { id: 4, title: t('serviceRequestPage.steps.summary'), icon: CheckCircle },
    ];

    const serviceOptions = [
        { id: 'web-hosting', label: 'Web Hosting', icon: Globe, price: 10 },
        { id: 'vps', label: 'VPS Cloud', icon: Server, price: 50 },
        { id: 'dedicated-server', label: 'Serveur Dédié', icon: Database, price: 120 },
        { id: 'cloud-server', label: 'Cloud Server', icon: Database, price: 80 },
        { id: 'migration', label: 'Migration', icon: Settings, price: 180 },
        { id: 'other', label: 'Autre', icon: Settings, price: 50 },
    ];

    const totalSteps = 6;

    // Tarifs de référence (inspiré DigitalOcean / OVH / Hetzner 2025-2026)
    const pricingMatrix: PricingMatrix = {
        server: {
            '2-1': { monthly: 12, name: 'Basic' },
            '2-2': { monthly: 18, name: 'Basic +' },
            '4-2': { monthly: 24, name: 'Standard' },
            '4-4': { monthly: 48, name: 'Standard +' },
            '8-2': { monthly: 48, name: 'General Purpose' },
            '8-4': { monthly: 72, name: 'CPU-Optimisé' },
            '16-4': { monthly: 96, name: 'Mémoire Optimisée' },
            '16-8': { monthly: 144, name: 'High Memory' },
            '32-8': { monthly: 192, name: 'High Memory +' }
        },
        storage: {
            baseIncluded: 100,
            extraSSD: 0.10,   // €/GB/mois
            extraHDD: 0.04
        },
        setupFees: {
            'web-hosting': 0,
            'vps': 25,
            'dedicated-server': 150,
            'cloud-server': 80,
            'migration': 180,
            'other': 50
        },
        addons: {
            controlPanel: { cPanel: 15, Plesk: 12, DirectAdmin: 8, Webmin: 0, none: 0 },
            ssl: { letsencrypt: 0, commercial: 45, none: 0 },
            backup: { daily: 18, weekly: 9, monthly: 4, none: 0 },
            security: { Firewall: 8, 'Anti-DDoS': 45, WAF: 25, 'IDS/IPS': 35 },
            support: { '24/7': 45, 'business-hours': 20, 'email-only': 0 },
            domain: 12  // approximation mensuelle (144€/an)
        }
    };

    const calculatePricing = () => {
        const serverPrice = pricingMatrix.server[`${formData.ram}-${formData.cpu}`]?.monthly || 0;
        let setupFee = 0;
        let addonsPrice = 0;

        // Frais d'installation (le plus élevé)
        formData.serviceType.forEach((s: string) => {
            const fee = pricingMatrix.setupFees[s] || 0;
            setupFee = Math.max(setupFee, fee);
        });

        // Stockage supplémentaire
        const storageGB = parseInt(formData.storageSize) || 0;
        if (storageGB > pricingMatrix.storage.baseIncluded) {
            const extra = storageGB - pricingMatrix.storage.baseIncluded;
            addonsPrice += extra * (
                formData.storageType === 'SSD'
                    ? pricingMatrix.storage.extraSSD
                    : pricingMatrix.storage.extraHDD
            );
        }

        // Addons
        addonsPrice += pricingMatrix.addons.controlPanel[formData.controlPanel] || 0;
        addonsPrice += pricingMatrix.addons.ssl[formData.ssl] || 0;
        addonsPrice += pricingMatrix.addons.backup[formData.backup] || 0;
        formData.security.forEach((s: string) => addonsPrice += pricingMatrix.addons.security[s] || 0);
        addonsPrice += pricingMatrix.addons.support[formData.support] || 0;
        if (formData.includeDomain) addonsPrice += pricingMatrix.addons.domain / 12;

        setPricing({
            server: serverPrice,
            setupFee,
            addons: Math.round(addonsPrice * 100) / 100,
            totalMonthly: Math.round((serverPrice + addonsPrice) * 100) / 100
        });
    };

    useEffect(() => {
        calculatePricing();
    }, [formData]);

    const update = (field: string, value: any) => setFormData((prev: any) => ({ ...prev, [field]: value }));

    const toggleArray = (field: string, value: any) => {
        setFormData((prev: any) => {
            const arr = prev[field] || [];
            return {
                ...prev,
                [field]: arr.includes(value)
                    ? arr.filter((v: any) => v !== value)
                    : [...arr, value]
            };
        });
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1: return formData.fullName.trim() && formData.email.trim() && formData.phone.trim();
            case 2: return formData.serviceType.length > 0;
            case 6: return formData.monthlyBudget.trim() && formData.startDate.trim();
            default: return true;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isStepValid()) return;
        console.log('Soumission:', { formData, pricing });
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-3xl w-full">
                    <div className="text-center mb-10">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-14 h-14 text-green-600" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {t('serviceRequestPage.success.title')}
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Merci <strong>{formData.fullName}</strong> !<br />
                            {t('serviceRequestPage.success.message')}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
                        <h3 className="text-xl font-semibold text-center mb-6">{t('serviceRequestPage.summary.title')}</h3>
                        <div className="space-y-4 text-gray-700">
                            <div className="flex justify-between py-2 border-b">
                                <span>{t('serviceRequestPage.summary.server')}</span>
                                <span className="font-medium">{pricing.server} {t('serviceRequestPage.estimation.monthly')}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span>{t('serviceRequestPage.summary.options')}</span>
                                <span className="font-medium">{pricing.addons.toFixed(2)} {t('serviceRequestPage.estimation.monthly')}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-blue-700 pt-4">
                                <span>{t('serviceRequestPage.summary.total')}</span>
                                <span>{pricing.totalMonthly} {t('serviceRequestPage.estimation.monthly')}</span>
                            </div>
                            {pricing.setupFee > 0 && (
                                <p className="text-sm text-center text-red-600 mt-2">
                                    + {pricing.setupFee} € {t('serviceRequestPage.summary.setupOneTime')}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => { setSubmitted(false); setCurrentStep(1); }}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:brightness-110 transition"
                    >
                        {t('serviceRequestPage.success.button')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl mb-6 shadow-lg">
                        <Server className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                        {t('serviceRequestPage.title')}
                    </h1>
                    <p className="text-xl text-gray-600">{t('serviceRequestPage.subtitle')}</p>
                </div>

                {/* Barre de progression */}
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    <div className="flex justify-between items-center gap-2">
                        {Array.from({ length: totalSteps }).map((_, i) => {
                            const step = i + 1;
                            return (
                                <React.Fragment key={step}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep > step ? 'bg-green-500 text-white' :
                                        currentStep === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                                            'bg-gray-200 text-gray-500'
                                        }`}>
                                        {currentStep > step ? <Check size={18} /> : step}
                                    </div>
                                    {step < totalSteps && (
                                        <div className={`flex-1 h-1 rounded-full ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                                            }`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-10">
                    {/* Étape 1 - Informations client */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <User className="w-8 h-8 text-blue-600" />
                                <h2 className="text-2xl font-bold">{t('serviceRequestPage.steps.info')}</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('serviceRequestPage.fields.fullName')} *</label>
                                    <input type="text" value={formData.fullName} onChange={e => update('fullName', e.target.value)} className="w-full p-3 border rounded-lg" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('serviceRequestPage.fields.email')} *</label>
                                    <input type="email" value={formData.email} onChange={e => update('email', e.target.value)} className="w-full p-3 border rounded-lg" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('serviceRequestPage.fields.phone')} *</label>
                                    <input type="tel" value={formData.phone} onChange={e => update('phone', e.target.value)} className="w-full p-3 border rounded-lg" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('serviceRequestPage.fields.country')}</label>
                                    <input type="text" value={formData.country} onChange={e => update('country', e.target.value)} className="w-full p-3 border rounded-lg" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Étape 2 - Type de service */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Globe className="w-8 h-8 text-blue-600" />
                                <h2 className="text-2xl font-bold">{t('serviceRequestPage.fields.serviceType')}</h2>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { id: 'web-hosting', label: 'Hébergement Web', icon: Globe },
                                    { id: 'vps', label: 'VPS', icon: Cpu },
                                    { id: 'dedicated-server', label: 'Serveur Dédié', icon: Server },
                                    { id: 'cloud-server', label: 'Cloud Server', icon: Database },
                                    { id: 'migration', label: 'Migration', icon: Settings },
                                    { id: 'other', label: 'Autre', icon: Settings }
                                ].map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleArray('serviceType', item.id)}
                                        className={`p-5 rounded-xl border-2 transition-all text-left ${formData.serviceType.includes(item.id)
                                            ? 'border-blue-600 bg-blue-50 shadow-sm'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-6 h-6 text-blue-600" />
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between pt-8 border-t">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(p => p - 1)}
                                className="px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 flex items-center gap-2"
                            >
                                <ChevronLeft size={20} /> {t('common.back')}
                            </button>
                        )}

                        {currentStep < totalSteps ? (
                            <button
                                type="button"
                                onClick={() => isStepValid() && setCurrentStep(p => p + 1)}
                                disabled={!isStepValid()}
                                className={`px-8 py-3 rounded-xl font-medium flex items-center gap-2 ml-auto ${isStepValid()
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {t('common.next')} <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold ml-auto hover:brightness-110"
                            >
                                {t('common.submit')}
                            </button>
                        )}
                    </div>

                    {/* Estimation rapide */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        {t('serviceRequestPage.estimation.current')} <strong className="text-blue-700">{pricing.totalMonthly} {t('serviceRequestPage.estimation.monthly')}</strong>
                        {pricing.setupFee > 0 && <span> + {pricing.setupFee}€ {t('serviceRequestPage.estimation.setup')}</span>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceRequestForm;
