import React, { useState } from 'react';
import { Check, X, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PricingPage = () => {
    const { t } = useTranslation();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const plans = [
        {
            name: t('pricing.plans.starter.name', "Starter"),
            description: t('pricing.plans.starter.desc', "Perfect for personal projects and prototypes"),
            price: billingCycle === 'monthly' ? "0" : "0",
            features: [
                "1 " + t('pricing.features.vcpu', 'vCPU'),
                "1 GB " + t('pricing.features.ram', 'RAM'),
                "25 GB SSD " + t('pricing.features.storage', 'Storage'),
                "1 TB " + t('pricing.features.transfer', 'Transfer'),
                t('pricing.features.support_community', 'Community Support'),
                t('pricing.features.projects_1', '1 Project')
            ],
            notIncluded: [
                t('pricing.features.backups', 'Automated Backups'),
                t('pricing.features.load_balancer', 'Load Balancer'),
                t('pricing.features.vpc', 'VPC Peering')
            ],
            cta: t('pricing.plans.starter.cta', "Start Free"),
            highlight: false
        },
        {
            name: t('pricing.plans.pro.name', "Pro"),
            description: t('pricing.plans.pro.desc', "For growing production applications"),
            price: billingCycle === 'monthly' ? "29" : "24",
            features: [
                "2 " + t('pricing.features.vcpu', 'vCPU'),
                "4 GB " + t('pricing.features.ram', 'RAM'),
                "80 GB NVMe " + t('pricing.features.storage', 'Storage'),
                "4 TB " + t('pricing.features.transfer', 'Transfer'),
                t('pricing.features.support_email', 'Email Support'),
                t('pricing.features.projects_unlimited', 'Unlimited Projects'),
                t('pricing.features.backups', 'Automated Backups'),
                t('pricing.features.ssl', 'Free SSL Certificates')
            ],
            notIncluded: [
                t('pricing.features.account_manager', 'Dedicated Account Manager')
            ],
            cta: t('pricing.plans.pro.cta', "Get Started"),
            highlight: true
        },
        {
            name: t('pricing.plans.business.name', "Business"),
            description: t('pricing.plans.business.desc', "High performance for demanding workloads"),
            price: billingCycle === 'monthly' ? "99" : "89",
            features: [
                "4 " + t('pricing.features.vcpu', 'vCPU'),
                "16 GB " + t('pricing.features.ram', 'RAM'),
                "320 GB NVMe " + t('pricing.features.storage', 'Storage'),
                "8 TB " + t('pricing.features.transfer', 'Transfer'),
                t('pricing.features.support_priority', 'Priority Support 24/7'),
                t('pricing.features.projects_unlimited', 'Unlimited Projects'),
                t('pricing.features.backups', 'Automated Backups'),
                t('pricing.features.load_balancer', 'Load Balancer Included'),
                t('pricing.features.vpc', 'VPC Peering'),
                t('pricing.features.team', 'Team Management')
            ],
            notIncluded: [],
            cta: t('pricing.plans.business.cta', "Contact Sales"),
            highlight: false
        }
    ];

    const faqs = [
        {
            question: t('pricing.faq.q1', "Can I change plans at any time?"),
            answer: t('pricing.faq.a1', "Yes, you can upgrade or downgrade your resources at any time. Changes are applied instantly and billing is prorated to the second.")
        },
        {
            question: t('pricing.faq.q2', "What payment methods do you accept?"),
            answer: t('pricing.faq.a2', "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and SEPA bank transfers for business accounts.")
        },
        {
            question: t('pricing.faq.q3', "Is there a commitment period?"),
            answer: t('pricing.faq.a3', "No, our services are non-binding. You can cancel your resources at any time and you will only pay for what you have used.")
        },
        {
            question: t('pricing.faq.q4', "Do you offer discounts for startups / students?"),
            answer: t('pricing.faq.a4', "Yes! We offer €1000 credits for eligible startups and special discounts for students. Contact us for more details.")
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            <Navbar />

            {/* Hero */}
            <section className="py-20 px-6 text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        {t('pricing.hero.title_1', 'Simple Pricing,')}
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                        {t('pricing.hero.title_2', 'No Surprises')}
                    </span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                    {t('pricing.hero.subtitle', 'Transparent pricing. Pay only for what you verify. No setup fees, no hidden costs.')}
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 mb-16">
                    <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-800' : 'text-slate-500'}`}>
                        {t('pricing.billing.monthly', 'Monthly')}
                    </span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className="w-16 h-8 bg-orange-100 rounded-full p-1 relative transition-colors duration-300"
                    >
                        <div className={`w-6 h-6 bg-orange-500 rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-8' : ''}`}></div>
                    </button>
                    <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-800' : 'text-slate-500'}`}>
                        {t('pricing.billing.yearly', 'Yearly')} <span className="text-orange-600 text-xs ml-1">(-20%)</span>
                    </span>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`relative rounded-3xl p-8 ${plan.highlight ? 'bg-white shadow-2xl border-2 border-orange-500 scale-105 z-10' : 'bg-white/60 backdrop-blur border border-orange-200'}`}>
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                            <p className="text-slate-500 text-sm mb-6">{plan.description}</p>

                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-bold text-slate-900">€{plan.price}</span>
                                <span className="text-slate-500">/mo</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                                {plan.notIncluded.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                                        <X className="w-5 h-5 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.highlight
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:shadow-orange-400/50'
                                : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                }`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="px-6 pb-20">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">{t('pricing.faq.title', 'Frequently Asked Questions')}</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white border border-orange-200 rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-orange-50/50 transition-colors"
                                >
                                    <span className="font-bold text-slate-800">{faq.question}</span>
                                    {openFaq === idx ? <ChevronUp className="w-5 h-5 text-orange-500" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                </button>
                                {openFaq === idx && (
                                    <div className="px-6 pb-4 text-slate-600 leading-relaxed border-t border-orange-100 pt-4 bg-orange-50/30">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PricingPage;
