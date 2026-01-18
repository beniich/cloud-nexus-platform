import { useState, useEffect, useCallback } from 'react';
import { PaymentMethod } from '@/types/payment.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface UsePaymentMethodsReturn {
    paymentMethods: PaymentMethod[];
    isLoading: boolean;
    error: string | null;
    defaultMethod: PaymentMethod | null;

    // Actions
    addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<PaymentMethod>;
    removePaymentMethod: (id: string) => Promise<boolean>;
    setDefaultPaymentMethod: (id: string) => Promise<boolean>;
    refreshPaymentMethods: () => Promise<void>;
}

export const usePaymentMethods = (): UsePaymentMethodsReturn => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const defaultMethod = paymentMethods.find(m => m.isDefault) || null;

    const fetchPaymentMethods = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/payment-methods`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors du chargement des méthodes de paiement');
            }

            const data = await response.json();
            setPaymentMethods(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(errorMessage);
            console.error('Erreur fetch payment methods:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    const addPaymentMethod = useCallback(async (
        method: Omit<PaymentMethod, 'id'>
    ): Promise<PaymentMethod> => {
        try {
            const response = await fetch(`${API_URL}/payment-methods`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(method),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de la méthode de paiement');
            }

            const newMethod = await response.json();
            setPaymentMethods(prev => [...prev, newMethod]);
            return newMethod;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(errorMessage);
            throw err;
        }
    }, []);

    const removePaymentMethod = useCallback(async (id: string): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/payment-methods/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression');
            }

            setPaymentMethods(prev => prev.filter(m => m.id !== id));
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(errorMessage);
            return false;
        }
    }, []);

    const setDefaultPaymentMethod = useCallback(async (id: string): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/payment-methods/${id}/set-default`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour');
            }

            // Mettre à jour localement
            setPaymentMethods(prev => prev.map(m => ({
                ...m,
                isDefault: m.id === id,
            })));

            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(errorMessage);
            return false;
        }
    }, []);

    return {
        paymentMethods,
        isLoading,
        error,
        defaultMethod,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        refreshPaymentMethods: fetchPaymentMethods,
    };
};
