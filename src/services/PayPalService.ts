import { PaymentResult } from '@/types/payment.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';

/**
 * Service pour l'intégration avec PayPal
 * Nécessite: npm install @paypal/react-paypal-js
 */
export class PayPalService {
    /**
     * Crée une commande PayPal
     */
    static async createOrder(amount: number, orderId: string): Promise<string> {
        try {
            const response = await fetch(`${API_URL}/payments/paypal/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    amount,
                    currency: 'EUR',
                    orderId,
                }),
            });

            if (!response.ok) {
                throw new Error('Échec création commande PayPal');
            }

            const data = await response.json();
            return data.paypalOrderId;
        } catch (error) {
            console.error('Erreur création commande PayPal:', error);
            throw error;
        }
    }

    /**
     * Capture le paiement PayPal après approbation
     */
    static async capturePayment(paypalOrderId: string): Promise<PaymentResult> {
        try {
            const response = await fetch(`${API_URL}/payments/paypal/capture`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ paypalOrderId }),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    status: 'failed',
                    error: result.message || 'Erreur capture paiement PayPal',
                };
            }

            return {
                success: true,
                status: 'completed',
                paymentId: result.paymentId,
                transactionId: result.transactionId,
            };
        } catch (error) {
            console.error('Erreur capture paiement PayPal:', error);
            return {
                success: false,
                status: 'failed',
                error: 'Une erreur est survenue',
            };
        }
    }

    /**
     * Récupère la configuration PayPal pour le SDK
     */
    static getPayPalOptions() {
        return {
            'client-id': PAYPAL_CLIENT_ID,
            currency: 'EUR',
            intent: 'capture',
        };
    }

    /**
     * Crée un abonnement PayPal (pour les paiements récurrents)
     */
    static async createSubscription(planId: string, orderId: string): Promise<string> {
        try {
            const response = await fetch(`${API_URL}/payments/paypal/create-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    planId,
                    orderId,
                }),
            });

            if (!response.ok) {
                throw new Error('Échec création abonnement PayPal');
            }

            const data = await response.json();
            return data.subscriptionId;
        } catch (error) {
            console.error('Erreur création abonnement PayPal:', error);
            throw error;
        }
    }

    /**
     * Annule un abonnement PayPal
     */
    static async cancelSubscription(subscriptionId: string): Promise<boolean> {
        try {
            const response = await fetch(
                `${API_URL}/payments/paypal/cancel-subscription`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ subscriptionId }),
                }
            );

            return response.ok;
        } catch (error) {
            console.error('Erreur annulation abonnement PayPal:', error);
            return false;
        }
    }
}
