// Types pour le système de commande

export type OrderStatus =
    | 'draft'
    | 'pending_payment'
    | 'processing'
    | 'active'
    | 'completed'
    | 'cancelled'
    | 'refunded';

export type OrderType = 'hosting' | 'subscription' | 'service' | 'domain' | 'ssl';

export type BillingCycle = 'monthly' | 'quarterly' | 'semi-annually' | 'annually' | 'biennially' | 'one-time';

export interface OrderItem {
    id: string;
    type: OrderType;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    billingCycle: BillingCycle;
    setupFee?: number;
    discount?: {
        type: 'percentage' | 'fixed';
        value: number;
        code?: string;
    };
    metadata?: Record<string, any>; // Données spécifiques (ex: specs hébergement)
}

export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    status: OrderStatus;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    currency: string;
    billingCycle?: BillingCycle; // Cycle principal si tous les items ont le même
    paymentMethodId?: string;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    metadata?: Record<string, any>;
}

// Configuration spécifique pour chaque type de produit
export interface HostingPlanConfig {
    planId: string;
    planName: string;
    storage: string;
    bandwidth: string;
    domains: number;
    databases: number;
    emails: number;
    ssl: boolean;
    backups: boolean;
    support: string;
}

export interface SubscriptionConfig {
    planId: string;
    planName: string;
    features: string[];
    userLimit?: number;
    storageLimit?: string;
}

export interface ServiceConfig {
    serviceId: string;
    serviceName: string;
    deliveryTime?: string;
    revisions?: number;
    includes: string[];
}

// Pour le panier
export interface CartItem extends OrderItem {
    selected: boolean;
}

export interface Cart {
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    promoCode?: string;
    promoDiscount?: number;
}
