import { axiosInstance } from './axios';

export interface CommissionResponse {
    sellerId: string;
    rate: number;
}

/** GET taux du vendeur */
export const getCommissionBySeller = async (sellerId: string) => {
    // Mock response for now as backend is not fully connected in this environment
    // In real implementation this would be:
    // const { data } = await axiosInstance.get<CommissionResponse>(`/api/commissions/${sellerId}`);
    // return data;

    // Return mock data for UI demo
    return new Promise<CommissionResponse>((resolve) => {
        setTimeout(() => {
            resolve({
                sellerId,
                rate: sellerId === '3' ? 0.12 : 0.15 // Example logic: specific rate for id '3', else default
            });
        }, 500);
    });
};

/** POST création/édition d’une règle */
export const createCommissionRule = async (payload: {
    sellerId?: string;
    rate: number;
    validFrom: string; // ISO‑8601
    validTo?: string;
}) => {
    // In real implementation:
    // const { data } = await axiosInstance.post('/api/commissions', payload);
    // return data;

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Mock API: Updating commission rule", payload);
            resolve({ success: true, ...payload });
        }, 800);
    });
};
