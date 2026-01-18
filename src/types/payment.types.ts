// Types pour le système de paiement

export type PaymentProvider = 'stripe' | 'paypal' | 'card' | 'bank_transfer';

export type PaymentStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'refunded';

export interface PaymentMethod {
    id: string;
    type: PaymentProvider;
    name: string;
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
    billingDetails?: BillingDetails;
}

export interface BillingDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    address: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    taxId?: string; // Numéro de TVA pour les entreprises
}

export interface CardDetails {
    number: string;
    expiryMonth: number;
    expiryYear: number;
    cvc: string;
    holderName: string;
}

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    clientSecret?: string; // Pour Stripe
    orderId: string;
    createdAt: Date;
}

export interface PaymentResult {
    success: boolean;
    paymentId?: string;
    transactionId?: string;
    status: PaymentStatus;
    error?: string;
    redirectUrl?: string; // Pour certaines méthodes (PayPal, 3D Secure)
}

export interface Invoice {
    id: string;
    orderId: string;
    invoiceNumber: string;
    date: Date;
    dueDate: Date;
    amount: number;
    tax: number;
    total: number;
    currency: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    billingDetails: BillingDetails;
    pdfUrl?: string;
}
