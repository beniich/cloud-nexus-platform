import React from 'react';
import { CheckCircle, Download, ArrowRight, Package, CreditCard } from 'lucide-react';
import { Order } from '@/types/order.types';

interface OrderConfirmationProps {
    order: Order;
    onDownloadInvoice?: () => void;
    onViewOrder?: () => void;
    onContinueShopping?: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
    order,
    onDownloadInvoice,
    onViewOrder,
    onContinueShopping,
}) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: order.currency,
        }).format(price);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('fr-FR', {
            dateStyle: 'long',
            timeStyle: 'short',
        }).format(new Date(date));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Success Animation */}
            <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full 
                      bg-green-100 mb-6 animate-bounce">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Commande confirmée !
                </h1>
                <p className="text-lg text-gray-600">
                    Merci pour votre commande
                </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                {/* Order Number */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div>
                        <p className="text-sm text-gray-500">Numéro de commande</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">
                            #{order.orderNumber}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                            {formatDate(order.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Order Items */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Articles commandés
                    </h3>
                    <div className="space-y-3">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 
                                        bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {item.quantity} × {formatPrice(item.unitPrice)}
                                    </p>
                                </div>
                                <p className="font-semibold text-gray-900">
                                    {formatPrice(item.quantity * item.unitPrice)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sous-total</span>
                        <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
                    </div>
                    {order.discount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-green-600">Réduction</span>
                            <span className="text-green-600">-{formatPrice(order.discount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">TVA</span>
                        <span className="text-gray-900">{formatPrice(order.tax)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-blue-600">
                            {formatPrice(order.total)}
                        </span>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium text-green-900">Paiement réussi</p>
                            <p className="text-sm text-green-700 mt-1">
                                Votre paiement a été traité avec succès
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* What's Next */}
            <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    Et maintenant ?
                </h3>
                <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" />
                        <span>Vous recevrez un email de confirmation à l'adresse indiquée</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" />
                        <span>Vos services seront activés dans les prochaines minutes</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" />
                        <span>Une facture sera disponible dans votre espace client</span>
                    </li>
                </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                {onDownloadInvoice && (
                    <button
                        onClick={onDownloadInvoice}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 
                     border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 
                     transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        Télécharger la facture
                    </button>
                )}

                {onViewOrder && (
                    <button
                        onClick={onViewOrder}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 
                     bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     transition-colors font-medium shadow-lg shadow-blue-600/30"
                    >
                        Voir ma commande
                        <ArrowRight className="w-5 h-5" />
                    </button>
                )}
            </div>

            {onContinueShopping && (
                <div className="text-center pt-4">
                    <button
                        onClick={onContinueShopping}
                        className="text-blue-600 hover:text-blue-700 font-medium 
                     transition-colors underline"
                    >
                        Continuer mes achats
                    </button>
                </div>
            )}
        </div>
    );
};
