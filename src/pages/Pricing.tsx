import React, { useState } from 'react';
import { Cloud, Check, X, Zap, Shield, Star, ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

const Pricing = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [showFAQ, setShowFAQ] = useState<number | null>(null);

    const plans = [
        {
            name: "Starter",
            price: { monthly: 9, yearly: 90 },
            description: "Pour les petits projets et sites personnels",
            icon: <Zap className="w-8 h-8" />,
            color: "from-orange-400 to-amber-500",
            features: [
                { text: "1 site web", included: true },
                { text: "10 GB de stockage", included: true },
                { text: "100 GB de bande passante", included: true },
                { text: "SSL gratuit", included: true },
                { text: "Support par email", included: true },
                { text: "Backup hebdomadaire", included: true },
                { text: "CDN de base", included: false },
                { text: "Domaine personnalisé", included: false },
                { text: "Support prioritaire", included: false }
            ],
            cta: "Commencer"
        },
        {
            name: "Professional",
            price: { monthly: 29, yearly: 290 },
            description: "Pour les entreprises en croissance",
            icon: <Star className="w-8 h-8" />,
            color: "from-orange-500 to-amber-600",
            popular: true,
            features: [
                { text: "5 sites web", included: true },
                { text: "50 GB de stockage", included: true },
                { text: "500 GB de bande passante", included: true },
                { text: "SSL gratuit", included: true },
                { text: "Support par email & chat", included: true },
                { text: "Backup quotidien", included: true },
                { text: "CDN global", included: true },
                { text: "3 domaines personnalisés", included: true },
                { text: "Support prioritaire", included: false },
                { text: "Staging environment", included: true },
                { text: "Analytics avancés", included: true }
            ],
            cta: "Essai gratuit 14 jours"
        },
        {
            name: "Enterprise",
            price: { monthly: 99, yearly: 990 },
            description: "Pour les grandes organisations",
            icon: <Shield className="w-8 h-8" />,
            color: "from-orange-600 to-red-600",
            features: [
                { text: "Sites illimités", included: true },
                { text: "500 GB de stockage", included: true },
                { text: "Bande passante illimitée", included: true },
                { text: "SSL gratuit", included: true },
                { text: "Support 24/7 prioritaire", included: true },
                { text: "Backup en temps réel", included: true },
                { text: "CDN premium", included: true },
                { text: "Domaines illimités", included: true },
                { text: "Account manager dédié", included: true },
                { text: "Environnements multiples", included: true },
                { text: "Analytics entreprise", included: true },
                { text: "SLA 99.99%", included: true },
                { text: "White label", included: true }
            ],
            cta: "Contactez-nous"
        }
    ];

    const addons = [
        { name: "Domaine .com", price: "12€/an", icon: "🌐" },
        { name: "Stockage additionnel", price: "5€/50GB", icon: "💾" },
        { name: "Email professionnel", price: "4€/boîte/mois", icon: "📧" },
        { name: "DDoS Protection", price: "25€/mois", icon: "🛡️" },
        { name: "Backup premium", price: "15€/mois", icon: "☁️" },
        { name: "Monitoring avancé", price: "19€/mois", icon: "📊" }
    ];

    const faqs = [
        {
            question: "Puis-je changer de plan à tout moment ?",
            answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et nous calculons le prorata."
        },
        {
            question: "Offrez-vous une garantie satisfait ou remboursé ?",
            answer: "Absolument ! Nous offrons une garantie de remboursement de 30 jours sur tous nos plans. Si vous n'êtes pas satisfait, nous vous remboursons intégralement."
        },
        {
            question: "Quels moyens de paiement acceptez-vous ?",
            answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, Amex), PayPal, et les virements bancaires pour les forfaits Enterprise."
        },
        {
            question: "Y a-t-il des frais cachés ?",
            answer: "Non, nos prix sont transparents. Le seul coût additionnel possible serait les add-ons optionnels que vous choisissez d'ajouter."
        },
        {
            question: "Que se passe-t-il si je dépasse mes limites ?",
            answer: "Nous vous prévenons par email avant d'atteindre vos limites. Vous pouvez alors upgrader votre plan ou acheter des ressources supplémentaires."
        },
        {
            question: "Proposez-vous des réductions pour les associations ?",
            answer: "Oui ! Nous offrons des réductions de 50% pour les associations à but non lucratif et les projets open source. Contactez-nous pour plus d'informations."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            {/* Navigation */}


            <nav className="border-b border-orange-200 backdrop-blur-xl bg-white/80 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3">
                            <Logo size="md" />
                        </Link>
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Accueil</Link>
                            <Link to="/services" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Services</Link>
                            <Link to="/pricing" className="text-orange-600 font-semibold">Tarifs</Link>
                            <Link to="/contact" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Contact</Link>
                            <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-400/50 transition-all transform hover:scale-105 font-medium">
                                Démarrer
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Tarifs Simples
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                            et Transparents
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
                        Choisissez le plan qui correspond à vos besoins. Changez ou annulez à tout moment.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-4 p-2 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-xl shadow-lg">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${billingCycle === 'monthly'
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-orange-50'
                                }`}
                        >
                            Mensuel
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${billingCycle === 'yearly'
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                                : 'text-slate-700 hover:bg-orange-50'
                                }`}
                        >
                            Annuel
                            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-bold">
                                -17%
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan, idx) => (
                            <div
                                key={idx}
                                className={`relative p-8 bg-white/80 backdrop-blur-sm border-2 rounded-3xl transition-all hover:shadow-2xl ${plan.popular
                                    ? 'border-orange-400 shadow-xl scale-105'
                                    : 'border-orange-200 hover:border-orange-300'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-full shadow-lg">
                                        ⭐ Le plus populaire
                                    </div>
                                )}

                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-6 shadow-lg text-white`}>
                                    {plan.icon}
                                </div>

                                <h3 className="text-3xl font-bold mb-2 text-slate-800">{plan.name}</h3>
                                <p className="text-slate-600 mb-6">{plan.description}</p>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-orange-600">
                                            {billingCycle === 'monthly' ? plan.price.monthly : Math.round(plan.price.yearly / 12)}€
                                        </span>
                                        <span className="text-slate-600">/mois</span>
                                    </div>
                                    {billingCycle === 'yearly' && (
                                        <p className="text-sm text-green-600 font-medium mt-2">
                                            Soit {plan.price.yearly}€/an • Économisez {Math.round(plan.price.monthly * 12 - plan.price.yearly)}€
                                        </p>
                                    )}
                                </div>

                                <Link
                                    to={`/hosting-request?type=shared&plan=${plan.name.toLowerCase()}`}
                                    className={`block w-full text-center py-4 rounded-xl font-semibold text-lg mb-8 transition-all ${plan.popular
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:shadow-orange-400/50'
                                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>

                                <ul className="space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            {feature.included ? (
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <X className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                                            )}
                                            <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>
                                                {feature.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Add-ons Section */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-slate-800">Options Supplémentaires</h2>
                        <p className="text-slate-600 text-lg">Personnalisez votre plan avec nos add-ons</p>
                    </div>

                    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {addons.map((addon, idx) => (
                            <div key={idx} className="p-6 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl hover:shadow-lg transition-all text-center">
                                <div className="text-4xl mb-3">{addon.icon}</div>
                                <h4 className="font-bold text-slate-800 mb-2">{addon.name}</h4>
                                <p className="text-orange-600 font-semibold">{addon.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="px-6 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-slate-800">Questions Fréquentes</h2>
                        <p className="text-slate-600 text-lg">Tout ce que vous devez savoir sur nos tarifs</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setShowFAQ(showFAQ === idx ? null : idx)}
                                    className="w-full p-6 text-left flex items-center justify-between hover:bg-orange-50 transition-colors"
                                >
                                    <span className="font-bold text-slate-800 text-lg">{faq.question}</span>
                                    <HelpCircle className={`w-6 h-6 text-orange-500 transition-transform ${showFAQ === idx ? 'rotate-180' : ''}`} />
                                </button>
                                {showFAQ === idx && (
                                    <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 py-20">
                <div className="max-w-5xl mx-auto">
                    <div className="relative overflow-hidden p-12 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl shadow-2xl text-center">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Besoin d'un plan personnalisé ?
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Contactez notre équipe commerciale pour une offre sur mesure adaptée à vos besoins spécifiques
                        </p>
                        <button className="group px-8 py-4 bg-white text-orange-600 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold text-lg flex items-center gap-2 mx-auto">
                            Discuter avec un expert
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-orange-200 py-12 px-6 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto text-center text-slate-600">
                    <p>© 2025 Cloud Nexus Platform. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
};

export default Pricing;
