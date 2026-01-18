import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PaymentConfiguration } from '@/types/payment-config.types';
import { useAuth } from './AuthContext';

interface PaymentConfigContextType {
    config: PaymentConfiguration | null;
    isLoading: boolean;
    error: string | null;

    // Actions (Admin seulement)
    updateConfig: (config: Partial<PaymentConfiguration>) => Promise<void>;
    refreshConfig: () => Promise<void>;

    // Helpers
    isStripeEnabled: () => boolean;
    isPayPalEnabled: () => boolean;
    getCommissionRate: (vendorId?: string) => number;
    getTaxRate: (country: string) => number;
}

const PaymentConfigContext = createContext<PaymentConfigContextContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configuration par défaut
const DEFAULT_CONFIG: PaymentConfiguration = {
    id: 'default',
    stripe: {
        enabled: false,
        publicKey: '',
        supportedCurrencies: ['EUR', 'USD'],
    },
    paypal: {
        enabled: false,
        clientId: '',
        mode: 'sandbox',
        supportedCurrencies: ['EUR', 'USD'],
    },
    commissions: {
        defaultVendorRate: 10, // 10%
        adminFee: 5, // 5%
        paymentProcessingFee: 2.9, // 2.9% (Stripe/PayPal standard)
        minimumPayout: 50, // 50€ minimum
    },
    taxes: {
        enabled: true,
        defaultRate: 0.20, // 20% TVA
        ratesByCountry: {
            FR: 0.20,
            BE: 0.21,
            DE: 0.19,
        },
        includedInPrice: false,
    },
    invoicing: {
        autoGenerate: true,
        prefix: 'CN-',
        startingNumber: 1000,
        companyInfo: {
            name: 'Cloud Nexus Platform',
            address: '123 Rue de la Paix',
            city: 'Paris',
            postalCode: '75001',
            country: 'France',
            taxId: 'FR12345678901',
            email: 'contact@cloudnexus.com',
            phone: '+33 1 23 45 67 89',
        },
    },
    notifications: {
        email: {
            onPurchase: true,
            onCommission: true,
            onPayout: true,
            onRefund: true,
        },
        sms: {
            enabled: false,
            onPurchase: false,
        },
        push: {
            enabled: true,
            onPurchase: true,
            onCommission: true,
        },
    },
    updatedAt: new Date(),
    updatedBy: 'system',
};

export const PaymentConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [config, setConfig] = useState<PaymentConfiguration | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Charger depuis l'API
            const response = await fetch(`${API_URL}/payment/config`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setConfig(data);
            } else {
                // Utiliser la config par défaut en cas d'erreur
                console.warn('Using default payment config');
                setConfig(DEFAULT_CONFIG);
            }
        } catch (err) {
            console.error('Error loading payment config:', err);
            setConfig(DEFAULT_CONFIG); // Fallback
            setError('Impossible de charger la configuration');
        } finally {
            setIsLoading(false);
        }
    };

    const updateConfig = async (updates: Partial<PaymentConfiguration>) => {
        if (user?.role !== 'admin' && user?.role !== 'owner') {
            throw new Error('Permission denied: Admin access required');
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/payment/config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    ...updates,
                    updatedBy: user.id,
                    updatedAt: new Date(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update configuration');
            }

            const updatedConfig = await response.json();
            setConfig(updatedConfig);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error updating config';
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshConfig = async () => {
        await loadConfig();
    };

    const isStripeEnabled = (): boolean => {
        return config?.stripe?.enabled ?? false;
    };

    const isPayPalEnabled = (): boolean => {
        return config?.paypal?.enabled ?? false;
    };

    const getCommissionRate = (vendorId?: string): number => {
        // TODO: Charger le taux personnalisé du vendeur si spécifié
        return config?.commissions?.defaultVendorRate ?? 10;
    };

    const getTaxRate = (country: string): number => {
        if (!config?.taxes?.enabled) return 0;

        return config.taxes.ratesByCountry[country] ?? config.taxes.defaultRate;
    };

    return (
        <PaymentConfigContext.Provider
            value={{
                config,
                isLoading,
                error,
                updateConfig,
                refreshConfig,
                isStripeEnabled,
                isPayPalEnabled,
                getCommissionRate,
                getTaxRate,
            }}
        >
            {children}
        </PaymentConfigContext.Provider>
    );
};

export const usePaymentConfig = () => {
    const context = useContext(PaymentConfigContext);
    if (!context) {
        throw new Error('usePaymentConfig must be used within PaymentConfigProvider');
    }
    return context;
};
