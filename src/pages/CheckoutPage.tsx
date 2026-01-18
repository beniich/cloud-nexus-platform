import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { CheckoutStepper } from '../features/checkout/components/CheckoutStepper';
import { OrderSummary } from '../features/checkout/components/OrderSummary';
import { BillingInfoForm } from '../features/checkout/components/BillingInfoForm';
import { PaymentMethodSelector } from '../features/checkout/components/PaymentMethodSelector';
import { OrderConfirmation } from '../features/checkout/components/OrderConfirmation';
import { useCheckout } from '../features/checkout/hooks/useCheckout';
import { OrderItem } from '@/types/order.types';

export const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialItems = (location.state?.items as OrderItem[]) || [];

    const {
        state,
        checkoutData,
        orderSummary,
        order,
        setBillingDetails,
        setPaymentMethod,
        setAgreeToTerms,
        nextStep,
        previousStep,
        processPayment,
    } = useCheckout(initialItems);

    // Rediriger si pas d'items
    useEffect(() => {
        if (initialItems.length === 0 && state.currentStep === 'cart') {
            navigate('/');
        }
    }, [initialItems, state.currentStep, navigate]);

    const handlePaymentProcess = async () => {
        const result = await processPayment();
        if (!result.success) {
            alert(result.error || 'Erreur lors du paiement');
        }
    };

    const renderStepContent = () => {
        switch (state.currentStep) {
            case 'cart':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Votre panier
                            </h2>
                            <div className="space-y-4">
                                {checkoutData.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center 
                                            p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                            {item.description && (
                                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                            )}
                                            <p className="text-sm text-gray-500 mt-2">
                                                Quantité: {item.quantity} | Cycle: {item.billingCycle}
                                            </p>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-lg font-bold text-gray-900">
                                                {(item.unitPrice * item.quantity).toFixed(2)} €
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'billing':
                return (
                    <BillingInfoForm
                        initialData={checkoutData.billingDetails}
                        onSubmit={(details) => {
                            setBillingDetails(details);
                            nextStep();
                        }}
                        onCancel={previousStep}
                    />
                );

            case 'payment':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <PaymentMethodSelector
                                selectedMethod={checkoutData.paymentMethod}
                                onSelect={(method) => {
                                    setPaymentMethod(method);
                                }}
                            />
                        </div>
                    </div>
                );

            case 'review':
                return (
                    <div className="space-y-6">
                        {/* Billing Info Review */}
                        {checkoutData.billingDetails && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Informations de facturation
                                    </h3>
                                    <button
                                        onClick={() => {
                                            // Go back to billing step
                                            previousStep();
                                            previousStep();
                                        }}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Modifier
                                    </button>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p className="text-gray-900">
                                        {checkoutData.billingDetails.firstName}{' '}
                                        {checkoutData.billingDetails.lastName}
                                    </p>
                                    {checkoutData.billingDetails.company && (
                                        <p className="text-gray-600">{checkoutData.billingDetails.company}</p>
                                    )}
                                    <p className="text-gray-600">{checkoutData.billingDetails.email}</p>
                                    <p className="text-gray-600">
                                        {checkoutData.billingDetails.address.street}<br />
                                        {checkoutData.billingDetails.address.postalCode}{' '}
                                        {checkoutData.billingDetails.address.city}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Payment Method Review */}
                        {checkoutData.paymentMethod && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Méthode de paiement
                                    </h3>
                                    <button
                                        onClick={previousStep}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Modifier
                                    </button>
                                </div>
                                <p className="text-gray-900">{checkoutData.paymentMethod.name}</p>
                                {checkoutData.paymentMethod.last4 && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        •••• {checkoutData.paymentMethod.last4}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Terms & Conditions */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={checkoutData.agreeToTerms}
                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 
                           focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                    J'accepte les{' '}
                                    <a href="/terms" className="text-blue-600 hover:underline">
                                        conditions générales de vente
                                    </a>{' '}
                                    et la{' '}
                                    <a href="/privacy" className="text-blue-600 hover:underline">
                                        politique de confidentialité
                                    </a>
                                </span>
                            </label>
                        </div>

                        {/* Security Badge */}
                        <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-green-600" />
                            <div>
                                <p className="font-medium text-green-900">Paiement sécurisé</p>
                                <p className="text-sm text-green-700 mt-1">
                                    Vos informations sont cryptées et sécurisées
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'confirmation':
                return order ? (
                    <OrderConfirmation
                        order={order}
                        onDownloadInvoice={() => {
                            // Implement invoice download
                            console.log('Download invoice');
                        }}
                        onViewOrder={() => {
                            navigate(`/orders/${order.id}`);
                        }}
                        onContinueShopping={() => {
                            navigate('/');
                        }}
                    />
                ) : null;

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                {state.currentStep !== 'confirmation' && (
                    <div className="mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 
                       transition-colors mb-6"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Finaliser votre commande
                        </h1>
                    </div>
                )}

                {/* Stepper */}
                {state.currentStep !== 'confirmation' && (
                    <CheckoutStepper
                        currentStep={state.currentStep}
                        steps={state.steps}
                    />
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Left Column - Form Content */}
                    <div className="lg:col-span-2">
                        {state.error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800">{state.error}</p>
                            </div>
                        )}

                        {renderStepContent()}

                        {/* Navigation Buttons */}
                        {state.currentStep !== 'cart' &&
                            state.currentStep !== 'billing' &&
                            state.currentStep !== 'confirmation' && (
                                <div className="flex gap-4 mt-6">
                                    <button
                                        onClick={previousStep}
                                        disabled={state.isProcessing}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 
                           rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        <ArrowLeft className="w-5 h-5 inline mr-2" />
                                        Retour
                                    </button>

                                    {state.currentStep === 'review' ? (
                                        <button
                                            onClick={handlePaymentProcess}
                                            disabled={!state.canProceed || state.isProcessing}
                                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg 
                             hover:bg-green-700 transition-colors font-medium 
                             shadow-lg shadow-green-600/30 disabled:opacity-50 
                             disabled:cursor-not-allowed"
                                        >
                                            {state.isProcessing ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                                                    Traitement en cours...
                                                </>
                                            ) : (
                                                <>
                                                    Confirmer le paiement
                                                    <ShieldCheck className="w-5 h-5 inline ml-2" />
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={nextStep}
                                            disabled={!state.canProceed || state.isProcessing}
                                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg 
                             hover:bg-blue-700 transition-colors font-medium 
                             shadow-lg shadow-blue-600/30 disabled:opacity-50 
                             disabled:cursor-not-allowed"
                                        >
                                            Continuer
                                            <ArrowRight className="w-5 h-5 inline ml-2" />
                                        </button>
                                    )}
                                </div>
                            )}

                        {state.currentStep === 'cart' && (
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={nextStep}
                                    disabled={!state.canProceed}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg 
                           hover:bg-blue-700 transition-colors font-medium 
                           shadow-lg shadow-blue-600/30 disabled:opacity-50"
                                >
                                    Continuer
                                    <ArrowRight className="w-5 h-5 inline ml-2" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Order Summary */}
                    {state.currentStep !== 'confirmation' && (
                        <div className="lg:col-span-1">
                            <div className="sticky top-6">
                                <OrderSummary
                                    summary={orderSummary}
                                    showRecurring={true}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
