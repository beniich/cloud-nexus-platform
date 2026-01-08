import React from 'react';
import { Radio, Lightbulb, Target, Shield, Info, ArrowRight, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KPICardProps {
    title: string;
    value: React.ReactNode;
    icon: React.ElementType;
    subtext: string;
    colorClass: string;
    bgClass?: string;
    iconBgClass: string;
}

const KPICard = ({ title, value, icon: Icon, subtext, colorClass, iconBgClass }: KPICardProps) => (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 font-medium text-sm mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${iconBgClass}`}>
                    <Icon className={`w-6 h-6 ${colorClass}`} />
                </div>
            </div>

            <div className={`text-xs ${subtext.includes('Risque') ? 'text-red-500' : 'text-gray-400'} flex items-center gap-1.5`}>
                <Info className="w-3 h-3" />
                {subtext}
            </div>
        </CardContent>
    </Card>
);

const LivePulseDashboard = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-500">Vue exécutive de votre organisation</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Signaux actifs"
                    value="5"
                    icon={Radio}
                    subtext="Comment c'est calculé"
                    colorClass="text-blue-600"
                    iconBgClass="bg-blue-50"
                />
                <KPICard
                    title="Insights prioritaires"
                    value={
                        <div className="flex items-baseline gap-2">
                            3 <span className="text-base font-medium text-red-500">2R / 1O</span>
                        </div>
                    }
                    icon={Lightbulb}
                    subtext="R = Risque, O = Opportunité"
                    colorClass="text-orange-500"
                    iconBgClass="bg-orange-50"
                />
                <KPICard
                    title="Actions en cours"
                    value={
                        <div className="flex flex-col">
                            <span>3</span>
                            <span className="text-xs font-normal text-gray-500 mt-1">100% avec owner</span>
                        </div>
                    }
                    icon={Target}
                    subtext="Taux d'ownership"
                    colorClass="text-green-600"
                    iconBgClass="bg-green-50"
                />
                <KPICard
                    title="Indice de confiance"
                    value={
                        <div className="flex items-baseline gap-1">
                            84<span className="text-xl text-gray-400">/100</span>
                        </div>
                    }
                    icon={Shield}
                    subtext="Score agrégé"
                    colorClass="text-purple-600"
                    iconBgClass="bg-purple-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Priorités */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                        <span className="text-orange-500">✨</span> Priorités vivantes
                    </div>

                    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-gray-900 text-lg">
                                    Friction UX sur le système de facturation
                                </span>
                                <Badge variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100">
                                    Risque
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 group-hover:text-orange-500 transition-colors">
                                <span className="text-sm font-medium">Voir</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-gray-900 text-lg">
                                    Alignement des équipes sur la Roadmap Q1
                                </span>
                                <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100">
                                    Information
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 group-hover:text-orange-500 transition-colors">
                                <span className="text-sm font-medium">Voir</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar - Signaux Faibles */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                        <AlertTriangle className="w-5 h-5 text-orange-500" /> Signaux faibles
                    </div>

                    <Card className="bg-gray-50 border-none">
                        <CardContent className="p-6">
                            <p className="text-sm text-gray-500 mb-4">
                                Tendances émergentes à faible fréquence mais potentiel fort impact.
                            </p>

                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="flex items-start justify-between mb-2">
                                        <Badge variant="outline" className="text-xs font-normal">Technique</Badge>
                                        <span className="text-xs text-gray-400">Il y a 2j</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-800">
                                        Latence observée sur le cluster Asia-East aux heures de pointe
                                    </p>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="flex items-start justify-between mb-2">
                                        <Badge variant="outline" className="text-xs font-normal">RH</Badge>
                                        <span className="text-xs text-gray-400">Il y a 5j</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-800">
                                        Questions récurrentes sur la politique de télétravail
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LivePulseDashboard;
