import React, { useState } from 'react';
import { CreditCard, Wallet, Building2, Check, Plus } from 'lucide-react';
import { PaymentMethod, PaymentProvider } from '@/types/payment.types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';

interface PaymentMethodSelectorProps {
    selectedMethod?: PaymentMethod;
    onSelect: (method: PaymentMethod) => void;
    onAddNew?: () => void;
}

const PROVIDER_INFO: Record<PaymentProvider, { icon: React.ReactNode; label: string; color: string }> = {
    card: {
        icon: <CreditCard className="w-5 h-5" />,
        label: 'Carte bancaire',
        color: 'blue',
    },
    stripe: {
        icon: <CreditCard className="w-5 h-5" />,
        label: 'Stripe',
        color: 'purple',
    },
    paypal: {
        icon: <Wallet className="w-5 h-5" />,
        label: 'PayPal',
        color: 'yellow',
    },
    bank_transfer: {
        icon: <Building2 className="w-5 h-5" />,
        label: 'Virement bancaire',
        color: 'green',
    },
};

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
    selectedMethod,
    onSelect,
    onAddNew,
}) => {
    const { paymentMethods, isLoading } = usePaymentMethods();
    const [showAddNew, setShowAddNew] = useState(false);

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Méthode de paiement
                </h3>
                {onAddNew && (
                    <button
                        onClick={() => {
                            setShowAddNew(true);
                            onAddNew();
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 
                     hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter
                    </button>
                )}
            </div>

            {/* Saved Payment Methods */}
            <div className="space-y-3">
                {paymentMethods.map(method => {
                    const info = PROVIDER_INFO[method.type];
                    const isSelected = selectedMethod?.id === method.id;

                    return (
                        <button
                            key={method.id}
                            onClick={() => onSelect(method)}
                            className={`
                w-full p-4 rounded-xl border-2 transition-all duration-300
                ${isSelected
                                    ? `border-${info.color}-500 bg-${info.color}-50 shadow-lg shadow-${info.color}-500/20`
                                    : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                                }
              `}
                        >
                            <div className="flex items-center gap-4">
                                {/* Icon */}
                                <div className={`
                  p-3 rounded-lg transition-colors
                  ${isSelected
                                        ? `bg-${info.color}-100 text-${info.color}-600`
                                        : 'bg-gray-100 text-gray-600'
                                    }
                `}>
                                    {info.icon}
                                </div>

                                {/* Details */}
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">
                                            {method.name}
                                        </span>
                                        {method.isDefault && (
                                            <span className="px-2 py-0.5 text-xs font-medium text-blue-600 
                                     bg-blue-100 rounded-full">
                                                Par défaut
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                        <span>{info.label}</span>
                                        {method.last4 && (
                                            <>
                                                <span>•</span>
                                                <span>•••• {method.last4}</span>
                                            </>
                                        )}
                                        {method.expiryMonth && method.expiryYear && (
                                            <>
                                                <span>•</span>
                                                <span>
                                                    Exp. {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Selection Indicator */}
                                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  transition-all duration-300
                  ${isSelected
                                        ? `border-${info.color}-500 bg-${info.color}-500`
                                        : 'border-gray-300'
                                    }
                `}>
                                    {isSelected && <Check className="w-4 h-4 text-white" />}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* No Payment Methods */}
            {paymentMethods.length === 0 && !showAddNew && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">
                        Aucune méthode de paiement enregistrée
                    </p>
                    {onAddNew && (
                        <button
                            onClick={() => {
                                setShowAddNew(true);
                                onAddNew();
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition-colors"
                        >
                            Ajouter une méthode de paiement
                        </button>
                    )}
                </div>
            )}

            {/* Quick Payment Options (without saving) */}
            <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Ou payer directement avec :</p>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => onSelect({
                            id: 'stripe-new',
                            type: 'stripe',
                            name: 'Carte bancaire',
                            isDefault: false,
                        })}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 
                     hover:bg-blue-50 transition-all group"
                    >
                        <CreditCard className="w-6 h-6 text-gray-600 group-hover:text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Carte</p>
                    </button>

                    <button
                        onClick={() => onSelect({
                            id: 'paypal-new',
                            type: 'paypal',
                            name: 'PayPal',
                            isDefault: false,
                        })}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 
                     hover:bg-yellow-50 transition-all group"
                    >
                        <Wallet className="w-6 h-6 text-gray-600 group-hover:text-yellow-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">PayPal</p>
                    </button>
                </div>
            </div>
        </div>
    );
};
