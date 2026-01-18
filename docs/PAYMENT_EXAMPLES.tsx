/**
 * EXEMPLES D'INTÉGRATION DU SYSTÈME DE PAIEMENT
 * 
 * Ce fichier contient des exemples pratiques d'utilisation
 * du système de paiement pour différents cas d'usage.
 */

import { useNavigate } from 'react-router-dom';
import { OrderItem } from '@/types/order.types';

// ============================================
// EXEMPLE 1: Page de Plans d'Hébergement
// ============================================

export function HostingPlansExample() {
    const navigate = useNavigate();

    const handleSelectPlan = (planId: string) => {
        // Données des plans
        const plans = {
            starter: {
                id: 'hosting-starter',
                name: 'Hébergement Starter',
                description: 'Parfait pour les petits sites',
                price: 9.99,
                setupFee: 0,
                specs: {
                    storage: '10GB SSD',
                    bandwidth: '100GB',
                    domains: 1,
                    databases: 1,
                    emails: 5,
                    ssl: true,
                    backups: false,
                }
            },
            premium: {
                id: 'hosting-premium',
                name: 'Hébergement Premium',
                description: 'Pour les sites professionnels',
                price: 29.99,
                setupFee: 9.99,
                specs: {
                    storage: '100GB SSD',
                    bandwidth: 'Illimité',
                    domains: 10,
                    databases: 10,
                    emails: 50,
                    ssl: true,
                    backups: true,
                }
            }
        };

        const selectedPlan = plans[planId as keyof typeof plans];

        const orderItem: OrderItem = {
            id: selectedPlan.id,
            type: 'hosting',
            name: selectedPlan.name,
            description: selectedPlan.description,
            quantity: 1,
            unitPrice: selectedPlan.price,
            billingCycle: 'monthly', // Peut être changé par l'utilisateur
            setupFee: selectedPlan.setupFee,
            metadata: {
                specs: selectedPlan.specs,
            }
        };

        // Rediriger vers le checkout
        navigate('/checkout', {
            state: { items: [orderItem] }
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold">Starter</h3>
                <p className="text-3xl font-bold mt-4">9,99€<span className="text-sm">/mois</span></p>
                <button
                    onClick={() => handleSelectPlan('starter')}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
                >
                    Choisir
                </button>
            </div>

            <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold">Premium</h3>
                <p className="text-3xl font-bold mt-4">29,99€<span className="text-sm">/mois</span></p>
                <button
                    onClick={() => handleSelectPlan('premium')}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
                >
                    Choisir
                </button>
            </div>
        </div>
    );
}

// ============================================
// EXEMPLE 2: Panier Multi-Produits
// ============================================

import { useState } from 'react';

export function ShoppingCartExample() {
    const [cartItems, setCartItems] = useState<OrderItem[]>([]);
    const navigate = useNavigate();

    const addHostingToCart = () => {
        const item: OrderItem = {
            id: 'hosting-premium',
            type: 'hosting',
            name: 'Hébergement Premium',
            quantity: 1,
            unitPrice: 29.99,
            billingCycle: 'monthly',
            setupFee: 9.99,
        };
        setCartItems([...cartItems, item]);
    };

    const addDomainToCart = () => {
        const item: OrderItem = {
            id: 'domain-com',
            type: 'domain',
            name: 'Nom de domaine .com',
            description: 'monsite.com',
            quantity: 1,
            unitPrice: 12.99,
            billingCycle: 'annually',
        };
        setCartItems([...cartItems, item]);
    };

    const addSSLToCart = () => {
        const item: OrderItem = {
            id: 'ssl-standard',
            type: 'ssl',
            name: 'Certificat SSL Standard',
            quantity: 1,
            unitPrice: 49.99,
            billingCycle: 'annually',
        };
        setCartItems([...cartItems, item]);
    };

    const removeFromCart = (index: number) => {
        setCartItems(cartItems.filter((_, i) => i !== index));
    };

    const proceedToCheckout = () => {
        if (cartItems.length === 0) {
            alert('Votre panier est vide');
            return;
        }

        navigate('/checkout', {
            state: { items: cartItems }
        });
    };

    const total = cartItems.reduce((sum, item) =>
        sum + (item.unitPrice * item.quantity) + (item.setupFee || 0),
        0
    );

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Panier</h2>

            {/* Liste des items */}
            {cartItems.length === 0 ? (
                <p className="text-gray-500">Votre panier est vide</p>
            ) : (
                <div className="space-y-4 mb-6">
                    {cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border p-4 rounded">
                            <div>
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-gray-600">{item.description}</p>
                                <p className="text-sm text-gray-500">{item.billingCycle}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">{item.unitPrice.toFixed(2)}€</p>
                                {item.setupFee && (
                                    <p className="text-sm text-gray-600">+{item.setupFee.toFixed(2)}€ (setup)</p>
                                )}
                                <button
                                    onClick={() => removeFromCart(index)}
                                    className="text-red-600 text-sm mt-2"
                                >
                                    Retirer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions rapides */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                    onClick={addHostingToCart}
                    className="border p-4 rounded hover:bg-gray-50"
                >
                    + Hébergement
                </button>
                <button
                    onClick={addDomainToCart}
                    className="border p-4 rounded hover:bg-gray-50"
                >
                    + Domaine
                </button>
                <button
                    onClick={addSSLToCart}
                    className="border p-4 rounded hover:bg-gray-50"
                >
                    + SSL
                </button>
            </div>

            {/* Total et Checkout */}
            <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                        {total.toFixed(2)}€
                    </span>
                </div>
                <button
                    onClick={proceedToCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                   hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Passer la commande ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
                </button>
            </div>
        </div>
    );
}

// ============================================
// EXEMPLE 3: Service avec Options
// ============================================

export function ServiceOrderExample() {
    const navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState({
        revisions: 2,
        urgency: false,
        seo: false,
    });

    const basePrice = 499;
    const calculatePrice = () => {
        let price = basePrice;
        if (selectedOptions.revisions > 2) {
            price += (selectedOptions.revisions - 2) * 50;
        }
        if (selectedOptions.urgency) price += 200;
        if (selectedOptions.seo) price += 150;
        return price;
    };

    const handleOrder = () => {
        const item: OrderItem = {
            id: 'website-design',
            type: 'service',
            name: 'Design de site web',
            description: `Avec ${selectedOptions.revisions} révisions${selectedOptions.urgency ? ', Livraison urgente' : ''
                }${selectedOptions.seo ? ', SEO inclus' : ''}`,
            quantity: 1,
            unitPrice: calculatePrice(),
            billingCycle: 'one-time',
            metadata: {
                revisions: selectedOptions.revisions,
                urgency: selectedOptions.urgency,
                seo: selectedOptions.seo,
                deliveryDays: selectedOptions.urgency ? 7 : 14,
            }
        };

        navigate('/checkout', {
            state: { items: [item] }
        });
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Design de site web sur mesure</h2>

            <div className="space-y-6">
                {/* Options */}
                <div>
                    <label className="block mb-2 font-medium">Nombre de révisions</label>
                    <select
                        value={selectedOptions.revisions}
                        onChange={e => setSelectedOptions({
                            ...selectedOptions,
                            revisions: parseInt(e.target.value)
                        })}
                        className="w-full border p-2 rounded"
                    >
                        <option value="1">1 révision</option>
                        <option value="2">2 révisions (inclus)</option>
                        <option value="3">3 révisions (+50€)</option>
                        <option value="4">4 révisions (+100€)</option>
                    </select>
                </div>

                <div>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={selectedOptions.urgency}
                            onChange={e => setSelectedOptions({
                                ...selectedOptions,
                                urgency: e.target.checked
                            })}
                            className="w-4 h-4"
                        />
                        <span>Livraison urgente (7 jours) - +200€</span>
                    </label>
                </div>

                <div>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={selectedOptions.seo}
                            onChange={e => setSelectedOptions({
                                ...selectedOptions,
                                seo: e.target.checked
                            })}
                            className="w-4 h-4"
                        />
                        <span>Optimisation SEO - +150€</span>
                    </label>
                </div>

                {/* Prix */}
                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg">Prix total</span>
                        <span className="text-3xl font-bold text-blue-600">
                            {calculatePrice()}€
                        </span>
                    </div>
                    <button
                        onClick={handleOrder}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                     hover:bg-blue-700"
                    >
                        Commander maintenant
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================
// EXEMPLE 4: Abonnement avec Période
// ============================================

export function SubscriptionExample() {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

    const plans = {
        monthly: {
            price: 49.99,
            label: 'Mensuel',
            savings: 0,
        },
        annually: {
            price: 39.99, // Prix mensuel si payé annuellement
            totalPrice: 479.88, // 39.99 * 12
            label: 'Annuel',
            savings: 20, // % économisé
        }
    };

    const handleSubscribe = () => {
        const item: OrderItem = {
            id: 'saas-pro',
            type: 'subscription',
            name: 'Abonnement Pro',
            description: 'Accès complet à toutes les fonctionnalités',
            quantity: 1,
            unitPrice: billingCycle === 'monthly'
                ? plans.monthly.price
                : plans.annually.totalPrice,
            billingCycle: billingCycle,
            discount: billingCycle === 'annually' ? {
                type: 'percentage',
                value: plans.annually.savings,
            } : undefined,
            metadata: {
                users: 10,
                storage: '1TB',
                support: '24/7',
            }
        };

        navigate('/checkout', {
            state: { items: [item] }
        });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Abonnement Professionnel</h2>

            {/* Toggle Billing Cycle */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${billingCycle === 'monthly'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                >
                    Mensuel
                </button>
                <button
                    onClick={() => setBillingCycle('annually')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition relative ${billingCycle === 'annually'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                >
                    Annuel
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        -20%
                    </span>
                </button>
            </div>

            {/* Prix */}
            <div className="text-center mb-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                    {billingCycle === 'monthly'
                        ? `${plans.monthly.price}€`
                        : `${plans.annually.price}€`
                    }
                </div>
                <div className="text-gray-600">
                    par mois
                    {billingCycle === 'annually' && (
                        <span className="block text-sm mt-1">
                            Facturé {plans.annually.totalPrice}€ annuellement
                        </span>
                    )}
                </div>
                {billingCycle === 'annually' && (
                    <div className="mt-2 text-green-600 font-semibold">
                        Économisez {plans.annually.savings}% !
                    </div>
                )}
            </div>

            {/* Fonctionnalités */}
            <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>10 utilisateurs</span>
                </li>
                <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>1TB de stockage</span>
                </li>
                <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Support 24/7</span>
                </li>
            </ul>

            <button
                onClick={handleSubscribe}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg
                 hover:bg-blue-700 transition"
            >
                S'abonner maintenant
            </button>
        </div>
    );
}

// ============================================
// EXEMPLE 5: Application de Code Promo
// ============================================

import { useState as usePromoState } from 'react';

export function PromoCodeExample() {
    const navigate = useNavigate();
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<any>(null);

    const baseItem: OrderItem = {
        id: 'hosting-premium',
        type: 'hosting',
        name: 'Hébergement Premium',
        quantity: 1,
        unitPrice: 29.99,
        billingCycle: 'monthly',
    };

    const applyPromoCode = () => {
        // Simulation de codes promo
        const promoCodes: Record<string, any> = {
            'WELCOME10': { type: 'percentage', value: 10 },
            'SAVE5': { type: 'fixed', value: 5 },
            'ANNUAL20': { type: 'percentage', value: 20 },
        };

        const promo = promoCodes[promoCode.toUpperCase()];
        if (promo) {
            setAppliedPromo(promo);
        } else {
            alert('Code promo invalide');
        }
    };

    const handleCheckout = () => {
        const item = {
            ...baseItem,
            discount: appliedPromo ? {
                type: appliedPromo.type,
                value: appliedPromo.value,
                code: promoCode.toUpperCase(),
            } : undefined
        };

        navigate('/checkout', {
            state: { items: [item] }
        });
    };

    const calculateDiscount = () => {
        if (!appliedPromo) return 0;
        if (appliedPromo.type === 'percentage') {
            return baseItem.unitPrice * (appliedPromo.value / 100);
        }
        return appliedPromo.value;
    };

    const finalPrice = baseItem.unitPrice - calculateDiscount();

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">{baseItem.name}</h3>

            <div className="mb-4">
                <div className="flex justify-between mb-2">
                    <span>Prix</span>
                    <span className={appliedPromo ? 'line-through text-gray-500' : ''}>
                        {baseItem.unitPrice}€
                    </span>
                </div>

                {appliedPromo && (
                    <>
                        <div className="flex justify-between text-green-600 mb-2">
                            <span>Réduction ({promoCode})</span>
                            <span>-{calculateDiscount().toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-blue-600">{finalPrice.toFixed(2)}€</span>
                        </div>
                    </>
                )}
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">Code promo</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        placeholder="WELCOME10"
                        className="flex-1 border p-2 rounded"
                    />
                    <button
                        onClick={applyPromoCode}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Appliquer
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Codes disponibles: WELCOME10, SAVE5, ANNUAL20
                </p>
            </div>

            <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
            >
                Procéder au paiement
            </button>
        </div>
    );
}
