import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getCommissionBySeller,
    createCommissionRule,
    CommissionResponse,
} from '@/api/commissions.api';

/** Récupère le taux d’un vendeur (mise en cache 10 min) */
export const useCommission = (sellerId: string) => {
    return useQuery({
        queryKey: ['commission', sellerId],
        queryFn: () => getCommissionBySeller(sellerId),
        enabled: !!sellerId,
        staleTime: 1000 * 60 * 10, // 10 min
    });
};

/** Crée / met à jour une règle (invalidate le cache du vendeur) */
export const useUpdateCommission = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createCommissionRule,
        onSuccess: (_, variables) => {
            if (variables.sellerId) {
                qc.invalidateQueries({ queryKey: ['commission', variables.sellerId] });
            }
        },
    });
};
