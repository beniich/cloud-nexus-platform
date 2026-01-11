import React from 'react';
import HostingPlans from '../components/HostingPlans';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import type { HostingPlan, BillingCycle } from '../types';

const HostingManagement: React.FC = () => {
    const navigate = useNavigate();

    const handleSelectPlan = (plan: HostingPlan, cycle: BillingCycle) => {
        console.log('Selected plan:', plan.name, 'with cycle:', cycle);
        // Navigate to request form with plan selection
        navigate('/request-service', {
            state: {
                serviceType: 'hosting',
                planId: plan.id,
                billingCycle: cycle
            }
        });
    };

    const handleSelectCustom = () => {
        console.log('Selected custom configuration');
        // Navigate to custom request form
        navigate('/request-service', {
            state: {
                serviceType: 'hosting',
                isCustom: true
            }
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Hébergement Cloud Premium | Cloud Industrie</title>
                <meta name="description" content="Découvrez nos plans d'hébergement cloud haute performance. Serveurs NVMe, uptime 99.9%, support 24/7 et configurations sur mesure." />
            </Helmet>

            {/* Hero Section Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-background pointer-events-none -z-10" />

            <main>
                <HostingPlans
                    onSelectPlan={handleSelectPlan}
                    onSelectCustom={handleSelectCustom}
                />

                {/* Support Section */}
                <section className="bg-secondary/30 py-20 mt-12 border-t border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h3 className="text-2xl font-bold mb-4">Vous hésitez sur le choix de votre plan ?</h3>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                            Nos architectes cloud sont là pour vous conseiller gratuitement. Contactez-nous pour une analyse de vos besoins
                            et obtenez une recommandation personnalisée en moins de 24h.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-6 py-3 bg-foreground text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
                                onClick={() => navigate('/contact')}
                            >
                                Parler à un expert
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HostingManagement;
