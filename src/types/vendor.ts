export interface VendorStats {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    balance: number;
}

export interface VendorOrder {
    id: number;
    customer: string;
    total: number;
    status: "pending" | "completed" | "cancelled";
    date: string;
}
