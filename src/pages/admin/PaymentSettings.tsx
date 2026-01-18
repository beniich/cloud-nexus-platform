import React, { useState } from 'react';
import { Save, CreditCard, Wallet, Settings, DollarSign, FileText, Bell, RefreshCw } from 'lucide-react';
import { usePaymentConfig } from '@/contexts/PaymentConfigContext';
import { AdminGuard } from '@/components/shared/RoleGuard';
import { PaymentConfiguration } from '@/types/payment-config.types';
import { toast } from 'sonner';

/**
 * Page de configuration du système de paiement (Admin seulement)
 */
const PaymentSettings: React.FC = () => {
    const { config, isLoading, updateConfig, refreshConfig } = usePaymentConfig();
    const [activeTab, setActiveTab] = useState<'stripe' | 'paypal' | 'commissions' | 'taxes' | 'invoicing' | 'notifications'>('stripe');
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState<PaymentConfiguration | null>(config);

    React.useEffect(() => {
        if (config) {
            setFormData(config);
        }
    }, [config]);

    const handleSave = async () => {
        if (!formData) return;

        setIsSaving(true);
        try {
            await updateConfig(formData);
            toast.success('Configuration enregistrée avec succès');
        } catch (error) {
            toast.error('Erreur lors de l\'enregistrement');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRefresh = async () => {
        await refreshConfig();
        toast.success('Configuration rechargée');
    };

    if (isLoading || !formData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    const tabs = [
        { id: 'stripe', label: 'Stripe', icon: CreditCard },
        { id: 'paypal', label: 'PayPal', icon: Wallet },
        { id: 'commissions', label: 'Commissions', icon: DollarSign },
        { id: 'taxes', label: 'Taxes', icon: Settings },
        { id: 'invoicing', label: 'Facturation', icon: FileText },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Configuration du système de paiement
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Gérez les paramètres de paiement de votre plateforme
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleRefresh}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                         hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Recharger
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="border-b border-gray-200">
                            <div className="flex overflow-x-auto">
                                {tabs.map(tab => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`
                        px-6 py-4 flex items-center gap-2 whitespace-nowrap transition-colors
                        ${activeTab === tab.id
                                                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }
                      `}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {/* Stripe Tab */}
                            {activeTab === 'stripe' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <CreditCard className="w-8 h-8 text-blue-600" />
                                        <div>
                                            <h2 className="text-xl font-semibold">Configuration Stripe</h2>
                                            <p className="text-sm text-gray-600">
                                                Configurez votre compte Stripe pour accepter les paiements par carte
                                            </p>
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.stripe.enabled}
                                            onChange={e => setFormData({
                                                ...formData,
                                                stripe: { ...formData.stripe, enabled: e.target.checked }
                                            })}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="font-medium">Activer Stripe</span>
                                    </label>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Clé publique Stripe <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.stripe.publicKey}
                                            onChange={e => setFormData({
                                                ...formData,
                                                stripe: { ...formData.stripe, publicKey: e.target.value }
                                            })}
                                            placeholder="pk_test_..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Trouvez cette clé dans votre tableau de bord Stripe
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Devises supportées
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {['EUR', 'USD', 'GBP', 'CAD', 'CHF'].map(currency => (
                                                <label key={currency} className="flex items-center gap-2 px-4 py-2 
                                                         border border-gray-300 rounded-lg cursor-pointer
                                                         hover:bg-gray-50">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.stripe.supportedCurrencies.includes(currency)}
                                                        onChange={e => {
                                                            const currencies = e.target.checked
                                                                ? [...formData.stripe.supportedCurrencies, currency]
                                                                : formData.stripe.supportedCurrencies.filter(c => c !== currency);
                                                            setFormData({
                                                                ...formData,
                                                                stripe: { ...formData.stripe, supportedCurrencies: currencies }
                                                            });
                                                        }}
                                                        className="w-4 h-4 text-blue-600"
                                                    />
                                                    <span className="text font-medium">{currency}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-900">
                                            <strong>Note:</strong> La clé secrète Stripe doit être configurée
                                            dans les variables d'environnement du serveur backend pour des raisons de sécurité.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* PayPal Tab */}
                            {activeTab === 'paypal' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Wallet className="w-8 h-8 text-yellow-600" />
                                        <div>
                                            <h2 className="text-xl font-semibold">Configuration PayPal</h2>
                                            <p className="text-sm text-gray-600">
                                                Configurez votre compte PayPal pour accepter les paiements
                                            </p>
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.paypal.enabled}
                                            onChange={e => setFormData({
                                                ...formData,
                                                paypal: { ...formData.paypal, enabled: e.target.checked }
                                            })}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="font-medium">Activer PayPal</span>
                                    </label>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Client ID PayPal <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.paypal.clientId}
                                            onChange={e => setFormData({
                                                ...formData,
                                                paypal: { ...formData.paypal, clientId: e.target.value }
                                            })}
                                            placeholder="AXxxxxxxxxxxxxxx"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mode
                                        </label>
                                        <select
                                            value={formData.paypal.mode}
                                            onChange={e => setFormData({
                                                ...formData,
                                                paypal: { ...formData.paypal, mode: e.target.value as 'sandbox' | 'live' }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="sandbox">Sandbox (Test)</option>
                                            <option value="live">Live (Production)</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Utilisez le mode sandbox pour les tests
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Devises supportées
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {['EUR', 'USD', 'GBP', 'CAD', 'CHF'].map(currency => (
                                                <label key={currency} className="flex items-center gap-2 px-4 py-2 
                                                         border border-gray-300 rounded-lg cursor-pointer
                                                         hover:bg-gray-50">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.paypal.supportedCurrencies.includes(currency)}
                                                        onChange={e => {
                                                            const currencies = e.target.checked
                                                                ? [...formData.paypal.supportedCurrencies, currency]
                                                                : formData.paypal.supportedCurrencies.filter(c => c !== currency);
                                                            setFormData({
                                                                ...formData,
                                                                paypal: { ...formData.paypal, supportedCurrencies: currencies }
                                                            });
                                                        }}
                                                        className="w-4 h-4 text-blue-600"
                                                    />
                                                    <span className="text-sm font-medium">{currency}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Je vais créer les autres onglets dans un message séparé pour ne pas dépasser la limite */}

                            {/* Commissions Tab */}
                            {activeTab === 'commissions' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <DollarSign className="w-8 h-8 text-green-600" />
                                        <div>
                                            <h2 className="text-xl font-semibold">Commissions des vendeurs</h2>
                                            <p className="text-sm text-gray-600">
                                                Définissez les taux de commission pour vos vendeurs
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Taux de commission par défaut (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={formData.commissions.defaultVendorRate}
                                            onChange={e => setFormData({
                                                ...formData,
                                                commissions: { ...formData.commissions, defaultVendorRate: parseFloat(e.target.value) }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Pourcentage que reçoivent les vendeurs sur chaque vente
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Frais de plateforme (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={formData.commissions.adminFee}
                                            onChange={e => setFormData({
                                                ...formData,
                                                commissions: { ...formData.commissions, adminFee: parseFloat(e.target.value) }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Frais retenus par la plateforme
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Frais de traitement (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={formData.commissions.paymentProcessingFee}
                                            onChange={e => setFormData({
                                                ...formData,
                                                commissions: { ...formData.commissions, paymentProcessingFee: parseFloat(e.target.value) }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Frais Stripe/PayPal (généralement 2.9% + 0.30€)
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Montant minimum pour retrait (€)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={formData.commissions.minimumPayout}
                                            onChange={e => setFormData({
                                                ...formData,
                                                commissions: { ...formData.commissions, minimumPayout: parseFloat(e.target.value) }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Exemple de calcul */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <h3 className="font-semibold mb-3">Exemple de calcul</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>Prix de vente:</span>
                                                <span className="font-medium">100.00€</span>
                                            </div>
                                            <div className="flex justify-between text-green-600">
                                                <span>Commission vendeur ({formData.commissions.defaultVendorRate}%):</span>
                                                <span className="font-medium">
                                                    {(100 * formData.commissions.defaultVendorRate / 100).toFixed(2)}€
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-blue-600">
                                                <span>Frais plateforme ({formData.commissions.adminFee}%):</span>
                                                <span className="font-medium">
                                                    {(100 * formData.commissions.adminFee / 100).toFixed(2)}€
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-orange-600">
                                                <span>Frais traitement ({formData.commissions.paymentProcessingFee}%):</span>
                                                <span className="font-medium">
                                                    {(100 * formData.commissions.paymentProcessingFee / 100).toFixed(2)}€
                                                </span>
                                            </div>
                                            <div className="border-t pt-2 flex justify-between font-bold">
                                                <span>Net vendeur:</span>
                                                <span className="text-green-600">
                                                    {(100 * formData.commissions.defaultVendorRate / 100 -
                                                        100 * formData.commissions.paymentProcessingFee / 100).toFixed(2)}€
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Taxes Tab - à compléter... */}
                            {activeTab === 'taxes' && (
                                <div>Onglet Taxes (à implémenter)</div>
                            )}

                            {/* Invoicing Tab - à compléter... */}
                            {activeTab === 'invoicing' && (
                                <div>Onglet Facturation (à implémenter)</div>
                            )}

                            {/* Notifications Tab - à compléter... */}
                            {activeTab === 'notifications' && (
                                <div>Onglet Notifications (à implémenter)</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
};

export default PaymentSettings;
