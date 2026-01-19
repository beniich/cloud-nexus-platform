import React, { useState } from 'react';
import { Cloud, Shield, FileText, Lock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const LegalPage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('privacy');

    const tabs = [
        { id: 'privacy', label: t('legal.tabs.privacy', 'Privacy'), icon: <Shield className="w-5 h-5" /> },
        { id: 'terms', label: t('legal.tabs.terms', 'Terms'), icon: <FileText className="w-5 h-5" /> },
        { id: 'security', label: t('legal.tabs.security', 'Security'), icon: <Lock className="w-5 h-5" /> },
        { id: 'gdpr', label: t('legal.tabs.gdpr', 'GDPR'), icon: <CheckCircle className="w-5 h-5" /> }
    ];

    const content: Record<string, { title: string; lastUpdate: string; sections: { title: string; content: string; list?: string[] }[] }> = {
        privacy: {
            title: t('legal.tabs.privacy', "Privacy Policy"),
            lastUpdate: `${t('legal.last_updated', 'Last updated:')} January 15, 2025`,
            sections: [
                {
                    title: "1. Introduction",
                    content: "At Cloud Nexus, protecting your personal data is our priority. This privacy policy explains how we collect, use, store, and protect your personal information when you use our cloud services."
                },
                {
                    title: "2. Collected Data",
                    content: "We collect the following information:",
                    list: [
                        "Identification information: name, email address, phone number",
                        "Billing data: address, payment information (via our secure processors)",
                        "Usage data: connection logs, IP address, browsing data",
                        "Technical data: system configuration, browser type, performance metrics"
                    ]
                },
                {
                    title: "3. Use of Data",
                    content: "Your data is used to:",
                    list: [
                        "Provide and improve our cloud services",
                        "Manage your account and subscriptions",
                        "Process payments and invoicing",
                        "Contact you regarding our services",
                        "Ensure security and prevent fraud",
                        "Comply with legal obligations"
                    ]
                },
                {
                    title: "4. Data Sharing",
                    content: "We never sell your personal data. We may share your information only with:",
                    list: [
                        "Our technical subcontractors (hosting, payment) under strict confidentiality agreements",
                        "Legal authorities if required by law",
                        "Our partners with your explicit consent"
                    ]
                },
                {
                    title: "5. Data Retention",
                    content: "We retain your personal data as long as necessary to provide our services and comply with our legal obligations. Active account data is kept for the duration of your subscription. After termination, your data is archived for 3 years in accordance with tax obligations, then permanently deleted."
                }
            ]
        },
        terms: {
            title: t('legal.tabs.terms', "Terms of Service"),
            lastUpdate: `${t('legal.last_updated', 'Last updated:')} January 15, 2025`,
            sections: [
                {
                    title: "1. Acceptance of Terms",
                    content: "By using Cloud Nexus services, you agree to be bound by these Terms of Service. If you do not accept these terms, please do not use our services."
                },
                {
                    title: "2. Service Description",
                    content: "Cloud Nexus provides cloud infrastructure services including:",
                    list: [
                        "Cloud hosting and dedicated servers",
                        "Managed database solutions",
                        "Development services (Site Builder, API Management)",
                        "Security and monitoring solutions",
                        "Technical support"
                    ]
                },
                {
                    title: "3. Account Creation",
                    content: "To use our services, you must create an account by providing accurate and up-to-date information. You are responsible for the confidentiality of your credentials and all activities under your account."
                },
                {
                    title: "4. Pricing and Billing",
                    content: "Service prices are listed on our website and may be changed with 30 days notice. Billing occurs according to the chosen period (monthly or yearly). Payment is due on the invoice date."
                },
                {
                    title: "5. Acceptable Use",
                    content: "You agree not to use our services to:",
                    list: [
                        "Violate applicable laws or regulations",
                        "Distribute illegal, malicious, or inappropriate content",
                        "Conduct hacking or security compromise activities",
                        "Send spam or unsolicited content",
                        "Infringe operational integrity or others' intellectual property rights"
                    ]
                }
            ]
        },
        security: {
            title: t('legal.tabs.security', "Security Policy"),
            lastUpdate: `${t('legal.last_updated', 'Last updated:')} January 15, 2025`,
            sections: [
                {
                    title: "1. Our Commitment",
                    content: "Security is at the heart of our Cloud Nexus infrastructure. We implement industry best practices to protect your data and ensure service continuity."
                },
                {
                    title: "2. Infrastructure Security",
                    content: "Our infrastructure relies on:",
                    list: [
                        "Tier III+ certified datacenters with biometric access control",
                        "N+1 redundancy on all critical components",
                        "Next-generation firewalls and intrusion detection (IDS/IPS)",
                        "Network segmentation and isolation of client environments",
                        "Automatic security updates and critical patching within 24h"
                    ]
                },
                {
                    title: "3. Data Encryption",
                    content: "Multi-layer protection for your data:",
                    list: [
                        "Encryption in transit: TLS 1.3 minimum",
                        "Encryption at rest: AES-256",
                        "Secure key management via HSM",
                        "Free, automatically renewed SSL/TLS certificates"
                    ]
                }
            ]
        },
        gdpr: {
            title: t('legal.tabs.gdpr', "GDPR Compliance"),
            lastUpdate: `${t('legal.last_updated', 'Last updated:')} January 15, 2025`,
            sections: [
                {
                    title: "1. GDPR Commitment",
                    content: "Cloud Nexus is fully compliant with the General Data Protection Regulation (GDPR). We are committed to processing your personal data lawfully, fairly, and transparently."
                },
                {
                    title: "2. Your Rights",
                    content: "Under GDPR, you have the following rights:",
                    list: [
                        "Right of access: obtain a copy of your data",
                        "Right to rectification: correct inaccurate data",
                        "Right to erasure ('right to be forgotten'): delete your data under conditions",
                        "Right to data portability",
                        "Right to object to processing"
                    ]
                },
                {
                    title: "3. Data Transfers",
                    content: "Your data is hosted exclusively within the European Union. If we must transfer data outside the EU, we use standard contractual clauses approved by the European Commission."
                }
            ]
        }
    };

    const activeContent = content[activeTab];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            <Navbar />

            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            {t('legal.hero.title_prefix', 'Legal')}
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                            {t('legal.hero.title_suffix', 'Information')}
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        {t('legal.hero.subtitle', 'Transparency and compliance: discover our commitments and your rights')}
                    </p>
                </div>
            </section>

            {/* Tabs */}
            <section className="px-6 pb-12">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-400/50'
                                    : 'bg-white/80 border border-orange-200 text-slate-700 hover:bg-orange-50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="px-6 pb-20">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-3xl p-12 shadow-xl">
                        <h2 className="text-4xl font-bold text-slate-800 mb-3">{activeContent.title}</h2>
                        <p className="text-slate-600 mb-8 text-sm">{activeContent.lastUpdate}</p>

                        <div className="space-y-8">
                            {activeContent.sections.map((section, idx) => (
                                <div key={idx} className="pb-8 border-b border-orange-200 last:border-0">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-4">{section.title}</h3>
                                    <p className="text-slate-600 leading-relaxed mb-4">{section.content}</p>
                                    {section.list && (
                                        <ul className="space-y-3 ml-6">
                                            {section.list.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-2"></div>
                                                    <span className="text-slate-600 leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-orange-50 border border-orange-200 rounded-2xl">
                            <h4 className="font-bold text-slate-800 mb-2">{t('legal.questions.title', 'Any questions?')}</h4>
                            <p className="text-slate-600 mb-4">
                                {t('legal.questions.subtitle', 'For any questions regarding this policy, contact us:')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="mailto:legal@cloudnexus.com" className="text-orange-600 font-semibold hover:underline">
                                    legal@cloudnexus.com
                                </a>
                                <span className="text-slate-400">•</span>
                                <Link to="/contact" className="text-orange-600 font-semibold hover:underline">
                                    {t('nav.contact', 'Contact Form')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LegalPage;
