import React from 'react';
import { ShoppingCart, Tag, TrendingUp, Calendar } from 'lucide-react';
import { OrderSummary as OrderSummaryType } from '../types/checkout.types';

interface OrderSummaryProps {
    summary: OrderSummaryType;
    showRecurring?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    summary,
    showRecurring = false
}) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: summary.currency,
        }).format(price);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                    Résumé de la commande
                </h3>
            </div>

            {/* Items */}
            <div className="space-y-3">
                {summary.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start py-2">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Quantité: {item.quantity} × {formatPrice(item.unitPrice)}
                            </p>
                            {item.billingCycle !== 'one-time' && (
                                <div className="flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                        {item.billingCycle === 'monthly' && 'Mensuel'}
                                        {item.billingCycle === 'quarterly' && 'Trimestriel'}
                                        {item.billingCycle === 'semi-annually' && 'Semestriel'}
                                        {item.billingCycle === 'annually' && 'Annuel'}
                                        {item.billingCycle === 'biennially' && 'Bisannuel'}
                                    </span>
                                </div>
                            )}
                            {item.discount && (
                                <div className="flex items-center gap-1 mt-1">
                                    <Tag className="w-3 h-3 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">
                                        -{item.discount.type === 'percentage'
                                            ? `${item.discount.value}%`
                                            : formatPrice(item.discount.value)
                                        }
                                        {item.discount.code && ` (${item.discount.code})`}
                                    </span>
                                </div>
                            )}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 ml-4">
                            {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-medium text-gray-900">{formatPrice(summary.subtotal)}</span>
                </div>

                {/* Setup Fees */}
                {summary.setupFeesTotal > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Frais d'installation</span>
                        <span className="font-medium text-gray-900">
                            {formatPrice(summary.setupFeesTotal)}
                        </span>
                    </div>
                )}

                {/* Discount */}
                {summary.discount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-green-600 flex items-center gap-1">
                            <Tag className="w-4 h-4" />
                            Réduction
                        </span>
                        <span className="font-medium text-green-600">
                            -{formatPrice(summary.discount)}
                        </span>
                    </div>
                )}

                {/* Tax */}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                        TVA ({(summary.taxRate * 100).toFixed(0)}%)
                    </span>
                    <span className="font-medium text-gray-900">{formatPrice(summary.tax)}</span>
                </div>
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-300 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(summary.total)}
                    </span>
                </div>

                {/* Recurring Total */}
                {showRecurring && summary.recurringTotal && summary.setupFeesTotal > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs text-blue-900 font-medium">
                                    Paiements récurrents
                                </p>
                                <p className="text-sm text-blue-700 mt-1">
                                    {formatPrice(summary.recurringTotal)}/période
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Les frais d'installation sont facturés une seule fois
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Items Count */}
            <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                {summary.items.length} article{summary.items.length > 1 ? 's' : ''} dans votre panier
            </div>
        </div>
    );
};
