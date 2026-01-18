import { PaymentResult, CardDetails, PaymentIntent } from '@/types/payment.types';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Service pour l'intégration avec Stripe
 * Nécessite: npm install @stripe/stripe-js
 */
export class StripeService {
    private static stripe: any = null;

    /**
     * Initialise Stripe
     */
    static async initialize() {
        if (this.stripe) return this.stripe;

        try {
            // Import dynamique pour éviter les erreurs si @stripe/stripe-js n'est pas installé
            const { loadStripe } = await import('@stripe/stripe-js');
            this.stripe = await loadStripe(STRIPE_PUBLIC_KEY);
            return this.stripe;
        } catch (error) {
            console.error('Erreur initialisation Stripe:', error);
            throw new Error('Impossible de charger Stripe');
        }
    }

    /**
     * Crée un Payment Intent
     */
    static async createPaymentIntent(
        amount: number,
        currency: string = 'eur',
        orderId: string
    ): Promise<PaymentIntent> {
        try {
            const response = await fetch(`${API_URL}/payments/stripe/create-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    amount: Math.round(amount * 100), // Convertir en centimes
                    currency,
                    orderId,
                }),
            });

            if (!response.ok) {
                throw new Error('Échec création Payment Intent');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur création Payment Intent:', error);
            throw error;
        }
    }

    /**
     * Confirme un paiement avec Stripe Elements
     */
    static async confirmPayment(
        clientSecret: string,
        cardElement: any
    ): Promise<PaymentResult> {
        try {
            const stripe = await this.initialize();

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                return {
                    success: false,
                    status: 'failed',
                    error: error.message,
                };
            }

            return {
                success: true,
                status: 'completed',
                paymentId: paymentIntent.id,
                transactionId: paymentIntent.id,
            };
        } catch (error) {
            console.error('Erreur confirmation paiement:', error);
            return {
                success: false,
                status: 'failed',
                error: 'Une erreur est survenue',
            };
        }
    }

    /**
     * Traite un paiement avec les détails de carte
     */
    static async processCardPayment(
        amount: number,
        cardDetails: CardDetails,
        orderId: string
    ): Promise<PaymentResult> {
        try {
            const stripe = await this.initialize();

            // Créer un Payment Intent
            const paymentIntent = await this.createPaymentIntent(amount, 'eur', orderId);

            // Créer un PaymentMethod
            const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: {
                    number: cardDetails.number,
                    exp_month: cardDetails.expiryMonth,
                    exp_year: cardDetails.expiryYear,
                    cvc: cardDetails.cvc,
                },
                billing_details: {
                    name: cardDetails.holderName,
                },
            });

            if (pmError) {
                return {
                    success: false,
                    status: 'failed',
                    error: pmError.message,
                };
            }

            // Confirmer le paiement
            const { error: confirmError, paymentIntent: confirmedIntent } =
                await stripe.confirmCardPayment(paymentIntent.clientSecret, {
                    payment_method: paymentMethod.id,
                });

            if (confirmError) {
                return {
                    success: false,
                    status: 'failed',
                    error: confirmError.message,
                };
            }

            return {
                success: true,
                status: 'completed',
                paymentId: confirmedIntent.id,
                transactionId: confirmedIntent.id,
            };
        } catch (error) {
            console.error('Erreur traitement paiement carte:', error);
            return {
                success: false,
                status: 'failed',
                error: 'Une erreur est survenue lors du paiement',
            };
        }
    }

    /**
     * Récupère les méthodes de paiement sauvegardées
     */
    static async getSavedPaymentMethods() {
        try {
            const response = await fetch(`${API_URL}/payments/stripe/payment-methods`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Échec récupération méthodes de paiement');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur récupération méthodes:', error);
            return [];
        }
    }

    /**
     * Supprime une méthode de paiement
     */
    static async deletePaymentMethod(paymentMethodId: string): Promise<boolean> {
        try {
            const response = await fetch(
                `${API_URL}/payments/stripe/payment-methods/${paymentMethodId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            return response.ok;
        } catch (error) {
            console.error('Erreur suppression méthode:', error);
            return false;
        }
    }
}
