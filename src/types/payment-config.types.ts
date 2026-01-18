// Types pour la configuration du système de paiement (Admin)

export interface StripeConfig {
    enabled: boolean;
    publicKey: string;
    secretKey?: string; // Stocké côté backend seulement
    webhookSecret?: string;
    supportedCurrencies: string[];
}

export interface PayPalConfig {
    enabled: boolean;
    clientId: string;
    clientSecret?: string; // Stocké côté backend seulement
    mode: 'sandbox' | 'live';
    supportedCurrencies: string[];
}

export interface CommissionConfig {
    defaultVendorRate: number; // % commission pour les vendeurs
    adminFee: number; // % frais de la plateforme
    paymentProcessingFee: number; // % frais de traitement paiement
    minimumPayout: number; // Montant minimum pour retrait
}

export interface TaxConfig {
    enabled: boolean;
    defaultRate: number;
    ratesByCountry: Record<string, number>;
    includedInPrice: boolean; // Prix TTC ou HT
}

export interface InvoicingConfig {
    autoGenerate: boolean;
    prefix: string; // Préfixe des factures (ex: CN-2026-)
    startingNumber: number;
    companyInfo: {
        name: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        taxId: string; // Numéro de TVA
        email: string;
        phone: string;
        website?: string;
    };
    footerText?: string;
}

export interface NotificationConfig {
    email: {
        onPurchase: boolean; // Client
        onCommission: boolean; // Vendeur
        onPayout: boolean; // Vendeur
        onRefund: boolean; // Client
    };
    sms: {
        enabled: boolean;
        onPurchase: boolean;
    };
    push: {
        enabled: boolean;
        onPurchase: boolean;
        onCommission: boolean;
    };
}

export interface PaymentConfiguration {
    id: string;
    stripe: StripeConfig;
    paypal: PayPalConfig;
    commissions: CommissionConfig;
    taxes: TaxConfig;
    invoicing: InvoicingConfig;
    notifications: NotificationConfig;
    updatedAt: Date;
    updatedBy: string; // ID de l'admin
}

// Config spécifique vendeur
export interface VendorPaymentConfig {
    vendorId: string;
    customCommissionRate?: number; // Override du taux par défaut
    payoutSchedule: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
    payoutMethod: 'bank_transfer' | 'paypal' | 'stripe';
    bankDetails?: {
        accountHolder: string;
        iban: string;
        bic: string;
    };
    paypalEmail?: string;
    stripeAccountId?: string;
    autoPayoutEnabled: boolean;
    minimumPayout?: number; // Override du minimum global
}

// Historique des commissions
export interface Commission {
    id: string;
    vendorId: string;
    orderId: string;
    orderAmount: number;
    commissionRate: number;
    commissionAmount: number;
    platformFee: number;
    processingFee: number;
    netAmount: number; // Ce que le vendeur reçoit réellement
    status: 'pending' | 'approved' | 'paid' | 'cancelled';
    paidAt?: Date;
    createdAt: Date;
}

// Paiement aux vendeurs
export interface VendorPayout {
    id: string;
    vendorId: string;
    amount: number;
    commissions: string[]; // IDs des commissions incluses
    method: 'bank_transfer' | 'paypal' | 'stripe';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    transactionId?: string;
    initiatedBy: string; // ID admin
    initiatedAt: Date;
    completedAt?: Date;
    failureReason?: string;
}

// Statistiques vendeur
export interface VendorStats {
    vendorId: string;
    period: {
        start: Date;
        end: Date;
    };
    totalSales: number;
    totalOrders: number;
    totalCommissions: number;
    pendingCommissions: number;
    paidCommissions: number;
    averageOrderValue: number;
    topProducts: Array<{
        productId: string;
        productName: string;
        sales: number;
        revenue: number;
    }>;
}
