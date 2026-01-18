import { useState, useCallback, useEffect } from 'react';
import { CheckoutStep, CheckoutState, CheckoutData, OrderSummary } from '../types/checkout.types';
import { Order, OrderItem } from '@/types/order.types';
import { BillingDetails, PaymentMethod, PaymentResult } from '@/types/payment.types';
import { CheckoutService } from '../services/CheckoutService';
import { StripeService } from '@/services/StripeService';
import { PayPalService } from '@/services/PayPalService';

const CHECKOUT_STEPS: CheckoutStep[] = ['cart', 'billing', 'payment', 'review', 'confirmation'];

interface UseCheckoutReturn {
    state: CheckoutState;
    checkoutData: CheckoutData;
    orderSummary: OrderSummary;
    order?: Order;

    // Actions
    setItems: (items: OrderItem[]) => void;
    setBillingDetails: (details: BillingDetails) => void;
    setPaymentMethod: (method: PaymentMethod) => void;
    setPromoCode: (code: string) => void;
    setAgreeToTerms: (agree: boolean) => void;

    // Navigation
    nextStep: () => void;
    previousStep: () => void;
    goToStep: (step: CheckoutStep) => void;

    // Paiement
    processPayment: () => Promise<PaymentResult>;

    // Reset
    reset: () => void;
}

export const useCheckout = (initialItems: OrderItem[] = []): UseCheckoutReturn => {
    const [state, setState] = useState<CheckoutState>({
        currentStep: 'cart',
        steps: CHECKOUT_STEPS,
        canProceed: initialItems.length > 0,
        isProcessing: false,
    });

    const [checkoutData, setCheckoutData] = useState<CheckoutData>({
        items: initialItems,
        agreeToTerms: false,
    });

    const [order, setOrder] = useState<Order>();
    const [orderSummary, setOrderSummary] = useState<OrderSummary>(() =>
        CheckoutService.calculateOrderSummary(initialItems)
    );

    // Recalculer le résumé quand les items ou le code promo changent
    useEffect(() => {
        const summary = CheckoutService.calculateOrderSummary(
            checkoutData.items,
            checkoutData.promoCode
        );
        setOrderSummary(summary);
    }, [checkoutData.items, checkoutData.promoCode]);

    // Vérifier si on peut avancer
    useEffect(() => {
        const canProceed = validateCurrentStep();
        setState(prev => ({ ...prev, canProceed }));
    }, [state.currentStep, checkoutData]);

    const validateCurrentStep = (): boolean => {
        switch (state.currentStep) {
            case 'cart':
                return checkoutData.items.length > 0;
            case 'billing':
                return !!checkoutData.billingDetails;
            case 'payment':
                return !!checkoutData.paymentMethod;
            case 'review':
                return checkoutData.agreeToTerms;
            default:
                return true;
        }
    };

    const setItems = useCallback((items: OrderItem[]) => {
        setCheckoutData(prev => ({ ...prev, items }));
    }, []);

    const setBillingDetails = useCallback((billingDetails: BillingDetails) => {
        setCheckoutData(prev => ({ ...prev, billingDetails }));
    }, []);

    const setPaymentMethod = useCallback((paymentMethod: PaymentMethod) => {
        setCheckoutData(prev => ({ ...prev, paymentMethod }));
    }, []);

    const setPromoCode = useCallback(async (code: string) => {
        // Valider le code promo
        const validPromo = await CheckoutService.validatePromoCode(code, checkoutData.items);
        if (validPromo) {
            setCheckoutData(prev => ({ ...prev, promoCode: code }));
        }
    }, [checkoutData.items]);

    const setAgreeToTerms = useCallback((agreeToTerms: boolean) => {
        setCheckoutData(prev => ({ ...prev, agreeToTerms }));
    }, []);

    const nextStep = useCallback(() => {
        const currentIndex = CHECKOUT_STEPS.indexOf(state.currentStep);
        if (currentIndex < CHECKOUT_STEPS.length - 1 && state.canProceed) {
            const nextStep = CHECKOUT_STEPS[currentIndex + 1];
            setState(prev => ({ ...prev, currentStep: nextStep }));
        }
    }, [state.currentStep, state.canProceed]);

    const previousStep = useCallback(() => {
        const currentIndex = CHECKOUT_STEPS.indexOf(state.currentStep);
        if (currentIndex > 0) {
            const prevStep = CHECKOUT_STEPS[currentIndex - 1];
            setState(prev => ({ ...prev, currentStep: prevStep }));
        }
    }, [state.currentStep]);

    const goToStep = useCallback((step: CheckoutStep) => {
        setState(prev => ({ ...prev, currentStep: step }));
    }, []);

    const processPayment = useCallback(async (): Promise<PaymentResult> => {
        setState(prev => ({ ...prev, isProcessing: true, error: undefined }));

        try {
            // 1. Créer la commande
            const createdOrder = await CheckoutService.createOrder(checkoutData);
            setOrder(createdOrder);

            // 2. Traiter le paiement selon la méthode
            let paymentResult: PaymentResult;

            if (!checkoutData.paymentMethod) {
                throw new Error('Aucune méthode de paiement sélectionnée');
            }

            switch (checkoutData.paymentMethod.type) {
                case 'stripe':
                case 'card':
                    // Utiliser Stripe
                    paymentResult = await CheckoutService.processPayment(
                        createdOrder.id,
                        checkoutData.paymentMethod.id,
                        checkoutData.billingDetails!
                    );
                    break;

                case 'paypal':
                    // PayPal sera géré via leur SDK dans le composant
                    paymentResult = {
                        success: true,
                        status: 'processing',
                        paymentId: 'paypal-pending',
                    };
                    break;

                default:
                    throw new Error('Méthode de paiement non supportée');
            }

            if (paymentResult.success) {
                setState(prev => ({
                    ...prev,
                    isProcessing: false,
                    currentStep: 'confirmation'
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    isProcessing: false,
                    error: paymentResult.error
                }));
            }

            return paymentResult;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            setState(prev => ({
                ...prev,
                isProcessing: false,
                error: errorMessage
            }));

            return {
                success: false,
                status: 'failed',
                error: errorMessage,
            };
        }
    }, [checkoutData]);

    const reset = useCallback(() => {
        setState({
            currentStep: 'cart',
            steps: CHECKOUT_STEPS,
            canProceed: false,
            isProcessing: false,
        });
        setCheckoutData({
            items: [],
            agreeToTerms: false,
        });
        setOrder(undefined);
    }, []);

    return {
        state,
        checkoutData,
        orderSummary,
        order,
        setItems,
        setBillingDetails,
        setPaymentMethod,
        setPromoCode,
        setAgreeToTerms,
        nextStep,
        previousStep,
        goToStep,
        processPayment,
        reset,
    };
};
