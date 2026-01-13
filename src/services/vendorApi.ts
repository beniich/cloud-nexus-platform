import { VendorStats, VendorOrder } from "@/types/vendor";

const API_URL = import.meta.env.VITE_API_ORIGIN || 'http://localhost:3006/api';

// Fallback mock data in case backend is not reachable during dev
const MOCK_STATS_FALLBACK: VendorStats = {
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    balance: 0,
};

export const VendorAPI = {
    async stats(token: string): Promise<VendorStats> {
        try {
            const response = await fetch(`${API_URL}/vendor/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("API Response not ok");
            return await response.json();
        } catch (e) {
            console.warn("Vendor API Error (stats), using fallback", e);
            return MOCK_STATS_FALLBACK;
        }
    },

    async orders(token: string): Promise<VendorOrder[]> {
        try {
            const response = await fetch(`${API_URL}/vendor/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("API Response not ok");
            return await response.json();
        } catch (e) {
            console.warn("Vendor API Error (orders), using fallback", e);
            return [];
        }
    },
};
