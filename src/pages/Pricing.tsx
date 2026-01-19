import React, { useState } from 'react';
import { Check, X, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PricingPage = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const plans = [
        {
            name: "Starter",
            description: "Perfect for personal projects and prototypes",
            price: billingCycle === 'monthly' ? "0" : "0",
            features: [
                "1 vCPU",
                "1 GB RAM",
                "25 GB SSD Storage",
                "1 TB Transfer",
                "Community Support",
                "1 Project"
            ],
            notIncluded: [
                "Automated Backups",
                "load Balancer",
                "VPC Peering"
            ],
            cta: "Start Free",
            highlight: false
        },
        {
            name: "Pro",
            description: "For growing production applications",
            price: billingCycle === 'monthly' ? "29" : "24",
            features: [
                "2 vCPU",
                "4 GB RAM",
                "80 GB NVMe Storage",
                "4 TB Transfer",
                "Email Support",
                "Unlimited Projects",
                "Automated Backups",
                "Free SSL Certificates"
            ],
            notIncluded: [
                "Dedicated Account Manager"
            ],
            cta: "Get Started",
            highlight: true
        },
        {
            name: "Business",
            description: "High performance for demanding workloads",
            price: billingCycle === 'monthly' ? "99" : "89",
            features: [
                "4 vCPU",
                "16 GB RAM",
                "320 GB NVMe Storage",
                "8 TB Transfer",
                "Priority Support 24/7",
                "Unlimited Projects",
                "Automated Backups",
                "Load Balancer Included",
                "VPC Peering",
                "Team Management"
            ],
            notIncluded: [],
            cta: "Contact Sales",
            highlight: false
        }
    ];

    const faqs = [
        {
            question: "Can I change plans at any time?",
            answer: "Yes, you can upgrade or downgrade your resources at any time. Changes are applied instantly and billing is prorated to the second."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and SEPA bank transfers for business accounts."
        },
        {
            question: "Is there a commitment period?",
            answer: "No, our services are non-binding. You can cancel your resources at any time and you will only pay for what you have used."
        },
        {
            question: "Do you offer discounts for startups / students?",
            answer: "Yes! We offer €1000credits for eligible startups and special discounts for students. Contact us for more details."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            <Navbar />

            {/* Hero */}
            <section className="py-20 px-6 text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Simple Pricing,</span>
                    <br />
                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">No Surprises</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                    Transparent pricing. Pay only for what you verify. No setup fees, no hidden costs.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 mb-16">
                    <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-800' : 'text-slate-500'}`}>Monthly</span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className="w-16 h-8 bg-orange-100 rounded-full p-1 relative transition-colors duration-300"
                    >
                        <div className={`w-6 h-6 bg-orange-500 rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-8' : ''}`}></div>
                    </button>
                    <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-800' : 'text-slate-500'}`}>
                        Yearly <span className="text-orange-600 text-xs ml-1">(-20%)</span>
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
                    <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Frequently Asked Questions</h2>
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
