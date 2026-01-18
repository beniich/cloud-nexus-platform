import React from 'react';
import { Check } from 'lucide-react';
import { CheckoutStep } from '../types/checkout.types';

interface CheckoutStepperProps {
    currentStep: CheckoutStep;
    steps: CheckoutStep[];
    onStepClick?: (step: CheckoutStep) => void;
}

const STEP_LABELS: Record<CheckoutStep, string> = {
    cart: 'Panier',
    billing: 'Facturation',
    payment: 'Paiement',
    review: 'Révision',
    confirmation: 'Confirmation',
};

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({
    currentStep,
    steps,
    onStepClick,
}) => {
    const currentIndex = steps.indexOf(currentStep);

    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
                {steps.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isClickable = index < currentIndex && onStepClick;

                    return (
                        <React.Fragment key={step}>
                            {/* Step Circle */}
                            <div className="flex flex-col items-center flex-1">
                                <button
                                    onClick={() => isClickable && onStepClick(step)}
                                    disabled={!isClickable}
                                    className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-semibold
                    transition-all duration-300 relative
                    ${isCompleted
                                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                                            : isCurrent
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50 scale-110'
                                                : 'bg-gray-200 text-gray-500'
                                        }
                    ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                  `}
                                >
                                    {isCompleted ? (
                                        <Check className="w-6 h-6" />
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}

                                    {/* Pulsing effect for current step */}
                                    {isCurrent && (
                                        <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-75"></span>
                                    )}
                                </button>

                                {/* Step Label */}
                                <span className={`
                  mt-2 text-sm font-medium transition-colors duration-300
                  ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                `}>
                                    {STEP_LABELS[step]}
                                </span>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-1 mx-2 mb-8">
                                    <div className={`
                    h-full transition-all duration-500 rounded-full
                    ${index < currentIndex
                                            ? 'bg-gradient-to-r from-green-500 to-green-400'
                                            : 'bg-gray-200'
                                        }
                  `} />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
