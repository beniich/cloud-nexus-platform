import React, { useState } from 'react';
import { Check, Info, Server, Zap, Shield, Globe, Cpu, HardDrive, MousePointer2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { cn } from '@/lib/utils';
import type { HostingPlan, BillingCycle } from '../types';

/**
 * Mock data for hosting plans
 */
const MOCK_PLANS: HostingPlan[] = [
    {
        id: 'plan-starter',
        name: 'Starter',
        description: 'Parfait pour les petits sites personnels et blogs.',
        tier: 'starter',
        cpu: 1,
        ram: 2,
        storage: 20,
        bandwidth: 1000,
        price: 9.99,
        features: {
            ssl: true,
            backup: true,
            cdn: false,
            support: 'email-only',
            customDomain: true,
            emailAccounts: 5,
            databases: 2,
        },
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'plan-pro',
        name: 'Professional',
        description: 'Idéal pour les entreprises en croissance et sites e-commerce.',
        tier: 'professional',
        cpu: 4,
        ram: 8,
        storage: 100,
        bandwidth: 5000,
        price: 29.99,
        popular: true,
        features: {
            ssl: true,
            backup: true,
            cdn: true,
            support: 'business-hours',
            customDomain: true,
            emailAccounts: 50,
            databases: 10,
        },
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'plan-ent',
        name: 'Enterprise',
        description: 'Performance maximale pour les applications critiques.',
        tier: 'enterprise',
        cpu: 16,
        ram: 32,
        storage: 500,
        bandwidth: 999999, // unlimited
        price: 99.99,
        features: {
            ssl: true,
            backup: true,
            cdn: true,
            support: '24/7',
            customDomain: true,
            emailAccounts: 999,
            databases: 999,
            autoScaling: true,
        },
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

interface HostingPlansProps {
    onSelectPlan?: (plan: HostingPlan, cycle: BillingCycle) => void;
    onSelectCustom?: () => void;
}

const HostingPlans: React.FC<HostingPlansProps> = ({ onSelectPlan, onSelectCustom }) => {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

    const getPrice = (basePrice: number) => {
        if (billingCycle === 'yearly') {
            return (basePrice * 0.8 * 12).toFixed(2); // 20% discount for yearly
        }
        return basePrice.toFixed(2);
    };

    const getPriceLabel = () => {
        if (billingCycle === 'yearly') return '/ an';
        return '/ mois';
    };

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                    Solutions d'Hébergement Cloud
                </h2>
                <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                    Choisissez le plan qui correspond à vos besoins ou créez votre propre configuration sur mesure.
                </p>

                <div className="mt-8 flex justify-center">
                    <Tabs defaultValue="monthly" className="w-[400px]" onValueChange={(v) => setBillingCycle(v as BillingCycle)}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="monthly">Facturation Mensuelle</TabsTrigger>
                            <TabsTrigger value="yearly">Facturation Annuelle <Badge variant="secondary" className="ml-2 bg-green-500 text-white">-20%</Badge></TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {MOCK_PLANS.map((plan) => (
                    <Card
                        key={plan.id}
                        className={cn(
                            "relative flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2",
                            plan.popular ? "border-primary shadow-lg scale-105 z-10" : "border-border hover:border-primary/50"
                        )}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                                <Badge className="px-4 py-1 text-sm font-bold bg-gradient-to-r from-primary to-blue-600 shadow-lg">
                                    PLUS POPULAIRE
                                </Badge>
                            </div>
                        )}

                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary mb-2">
                                    {plan.tier === 'starter' && <Zap size={24} />}
                                    {plan.tier === 'professional' && <Server size={24} />}
                                    {plan.tier === 'enterprise' && <Shield size={24} />}
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                            <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
                        </CardHeader>

                        <CardContent className="flex-grow">
                            <div className="mb-6">
                                <span className="text-4xl font-extrabold">${getPrice(plan.price)}</span>
                                <span className="text-muted-foreground ml-1">{getPriceLabel()}</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center text-sm">
                                    <Cpu className="mr-2 text-primary" size={16} />
                                    <span className="font-medium mr-1">{plan.cpu} vCPU</span>
                                    <span className="text-muted-foreground ml-auto">Puissance dédiée</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Zap className="mr-2 text-primary" size={16} />
                                    <span className="font-medium mr-1">{plan.ram} Go RAM</span>
                                    <span className="text-muted-foreground ml-auto">Mémoire rapide</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <HardDrive className="mr-2 text-primary" size={16} />
                                    <span className="font-medium mr-1">{plan.storage} Go NVMe</span>
                                    <span className="text-muted-foreground ml-auto">Stockage SSD</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Globe className="mr-2 text-primary" size={16} />
                                    <span className="font-medium mr-1">
                                        {plan.bandwidth > 10000 ? 'Illimité' : `${plan.bandwidth} Go`} Bandwidth
                                    </span>
                                    <span className="text-muted-foreground ml-auto">Trafic mensuel</span>
                                </div>
                            </div>

                            <div className="border-t border-border pt-6 space-y-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Inclus dans le plan</p>
                                <div className="flex items-center text-sm">
                                    <Check className="mr-2 text-green-500" size={16} />
                                    <span>Certificat SSL gratuit</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Check className="mr-2 text-green-500" size={16} />
                                    <span>Sauvegardes automatiques</span>
                                </div>
                                {plan.features.cdn && (
                                    <div className="flex items-center text-sm">
                                        <Check className="mr-2 text-green-500" size={16} />
                                        <span>CDN Global intégré</span>
                                    </div>
                                )}
                                <div className="flex items-center text-sm">
                                    <Check className="mr-2 text-green-500" size={16} />
                                    <span>Support {plan.features.support === '24/7' ? '24/7 Premium' : 'Prioritaire'}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Check className="mr-2 text-green-500" size={16} />
                                    <span>{plan.features.databases === 999 ? 'Bases de données illimitées' : `${plan.features.databases} Bases de données`}</span>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button
                                className={cn(
                                    "w-full py-6 text-lg font-bold shadow-md transition-all active:scale-95",
                                    plan.popular ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                                )}
                                onClick={() => onSelectPlan?.(plan, billingCycle)}
                            >
                                Commencer maintenant
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Custom Plan Call-to-action */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-2xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Server size={400} />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl text-center lg:text-left">
                        <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-none px-3 py-1">CONFIGURATION AVANCÉE</Badge>
                        <h3 className="text-3xl font-bold mb-4">Besoin d'une configuration spécifique ?</h3>
                        <p className="text-blue-100 text-lg">
                            Créez votre propre serveur virtuel avec les ressources exactes dont votre application a besoin.
                            CPU, RAM, Stockage - payez uniquement pour ce que vous utilisez avec notre calculateur sur mesure.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <Button
                            size="lg"
                            className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-xl px-10 py-8 shadow-xl hover:scale-105 transition-transform group"
                            onClick={onSelectCustom}
                        >
                            Configuration Personnalisée
                            <MousePointer2 className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 relative z-10 border-t border-white/10 pt-8">
                    {[
                        { label: 'Uptime Garanti', value: '99.99%', icon: Zap },
                        { label: 'Infrastructure', value: 'NVMe Gen4', icon: HardDrive },
                        { label: 'Réseau', value: '10 Gbps', icon: Globe },
                        { label: 'Protection', value: 'DDoS Incluse', icon: Shield },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center lg:items-start">
                            <div className="flex items-center mb-1">
                                <item.icon size={16} className="text-blue-300 mr-2" />
                                <span className="text-blue-200 text-sm">{item.label}</span>
                            </div>
                            <span className="text-2xl font-bold">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ or Footer Info */}
            <div className="mt-16 text-center text-muted-foreground text-sm flex flex-wrap justify-center gap-x-8 gap-y-4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="flex items-center hover:text-foreground">
                            <Info size={14} className="mr-1" /> Satisfait ou remboursé sous 30 jours
                        </TooltipTrigger>
                        <TooltipContent>Nous croyons en notre service, essayez-le sans risque.</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger className="flex items-center hover:text-foreground">
                            <Info size={14} className="mr-1" /> Migration gratuite assistée
                        </TooltipTrigger>
                        <TooltipContent>Nos experts s'occupent de transférer vos données gratuitement.</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger className="flex items-center hover:text-foreground">
                            <Info size={14} className="mr-1" /> Activation instantanée
                        </TooltipTrigger>
                        <TooltipContent>Votre serveur est prêt en moins de 60 secondes après paiement.</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default HostingPlans;
