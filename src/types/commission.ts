export interface CommissionRule {
    globalRate: number; // %
}

export interface VendorCommission {
    vendorId: number;
    rate?: number; // % personnalisé
}

export interface CommissionResult {
    orderId: number;
    gross: number;
    commission: number;
    vendorEarning: number;
}
