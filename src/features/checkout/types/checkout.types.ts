import { BillingDetails, PaymentMethod } from '@/types/payment.types';
import { Order, OrderItem } from '@/types/order.types';

export type CheckoutStep =
    | 'cart'           // Révision du panier
    | 'billing'        // Informations de facturation
    | 'payment'        // Méthode de paiement
    | 'review'         // Révision finale
    | 'confirmation';  // Confirmation

export interface CheckoutState {
    currentStep: CheckoutStep;
    steps: CheckoutStep[];
    canProceed: boolean;
    isProcessing: boolean;
    error?: string;
}

export interface CheckoutData {
    items: OrderItem[];
    billingDetails?: BillingDetails;
    paymentMethod?: PaymentMethod;
    savePaymentMethod?: boolean;
    agreeToTerms: boolean;
    promoCode?: string;
}

export interface OrderSummary {
    items: OrderItem[];
    subtotal: number;
    discount: number;
    tax: number;
    taxRate: number;
    total: number;
    currency: string;
    recurringTotal?: number; // Pour les abonnements
    setupFeesTotal?: number;
}

export interface PromoCode {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    validUntil?: Date;
    minAmount?: number;
    applicableTypes?: string[];
}
