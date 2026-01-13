export function calculateCommission(
    total: number,
    globalRate: number,
    vendorRate?: number
) {
    const rate = vendorRate ?? globalRate;
    const commission = (total * rate) / 100;

    return {
        commission,
        vendorEarning: total - commission,
    };
}
