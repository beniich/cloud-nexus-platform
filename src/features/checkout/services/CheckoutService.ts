import { Order, OrderItem } from '@/types/order.types';
import { PaymentMethod, PaymentResult, BillingDetails } from '@/types/payment.types';
import { CheckoutData, OrderSummary, PromoCode } from '../types/checkout.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class CheckoutService {
    /**
     * Calcule le résumé de la commande avec taxes et réductions
     */
    static calculateOrderSummary(items: OrderItem[], promoCode?: string): OrderSummary {
        const subtotal = items.reduce((sum, item) => {
            const itemPrice = item.unitPrice * item.quantity;
            const itemDiscount = item.discount
                ? item.discount.type === 'percentage'
                    ? itemPrice * (item.discount.value / 100)
                    : item.discount.value
                : 0;
            return sum + itemPrice - itemDiscount;
        }, 0);

        const setupFeesTotal = items.reduce((sum, item) => sum + (item.setupFee || 0), 0);

        // Appliquer le code promo si valide
        let discount = 0;
        // TODO: Valider le code promo via API

        const taxRate = 0.20; // 20% TVA (à ajuster selon le pays)
        const tax = (subtotal - discount + setupFeesTotal) * taxRate;
        const total = subtotal - discount + setupFeesTotal + tax;

        // Calculer le total récurrent (sans frais d'installation)
        const recurringTotal = subtotal - discount + tax;

        return {
            items,
            subtotal,
            discount,
            tax,
            taxRate,
            total,
            currency: 'EUR',
            recurringTotal,
            setupFeesTotal,
        };
    }

    /**
     * Valide un code promo
     */
    static async validatePromoCode(code: string, items: OrderItem[]): Promise<PromoCode | null> {
        try {
            const response = await fetch(`${API_URL}/checkout/promo-code/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, items }),
            });

            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error('Erreur validation code promo:', error);
            return null;
        }
    }

    /**
     * Crée une commande
     */
    static async createOrder(checkoutData: CheckoutData): Promise<Order> {
        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(checkoutData),
            });

            if (!response.ok) {
                throw new Error('Échec de création de la commande');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur création commande:', error);
            throw error;
        }
    }

    /**
     * Traite le paiement d'une commande
     */
    static async processPayment(
        orderId: string,
        paymentMethodId: string,
        billingDetails: BillingDetails
    ): Promise<PaymentResult> {
        try {
            const response = await fetch(`${API_URL}/checkout/process-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    orderId,
                    paymentMethodId,
                    billingDetails,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    status: 'failed',
                    error: result.message || 'Erreur lors du paiement',
                };
            }

            return result;
        } catch (error) {
            console.error('Erreur traitement paiement:', error);
            return {
                success: false,
                status: 'failed',
                error: 'Une erreur est survenue lors du paiement',
            };
        }
    }

    /**
     * Récupère les détails d'une commande
     */
    static async getOrder(orderId: string): Promise<Order> {
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Commande introuvable');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur récupération commande:', error);
            throw error;
        }
    }

    /**
     * Annule une commande
     */
    static async cancelOrder(orderId: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            return response.ok;
        } catch (error) {
            console.error('Erreur annulation commande:', error);
            return false;
        }
    }

    /**
     * Calcule les taxes selon le pays
     */
    static calculateTax(amount: number, country: string): number {
        // Taux de TVA par pays (exemples)
        const taxRates: Record<string, number> = {
            FR: 0.20,
            BE: 0.21,
            DE: 0.19,
            ES: 0.21,
            IT: 0.22,
            UK: 0.20,
            US: 0,
            CA: 0.05,
        };

        const rate = taxRates[country] || 0;
        return amount * rate;
    }
}
