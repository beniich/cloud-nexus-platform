import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { Button } from "@/shared/ui/button";
import { Check, Zap, Server, Database, TrendingUp, AlertTriangle } from "lucide-react";

export default function SubscriptionSection() {
    const currentPlan = {
        name: "Business Pro",
        price: "49.99€",
        cycle: "mensuel",
        status: "actif",
        features: [
            "10 Serveurs Cloud",
            "500 GB Stockage SSD",
            "Support Prioritaire 24/7",
            "API Access Illimité",
            "Backup Automatique"
        ]
    };

    const quotas = [
        { label: "Stockage SSD", used: 320, total: 500, unit: "GB", icon: Database, color: "bg-blue-500" },
        { label: "Bande Passante", used: 2.1, total: 5, unit: "TB", icon: TrendingUp, color: "bg-green-500" },
        { label: "vCPUs Alloués", used: 12, total: 20, unit: "Cores", icon: Server, color: "bg-purple-500" },
        { label: "RAM Utilisée", used: 48, total: 64, unit: "GB", icon: Zap, color: "bg-orange-500" }
    ];

    const getProgressColor = (percentage: number) => {
        if (percentage > 90) return "bg-red-500";
        if (percentage > 75) return "bg-orange-500";
        return "bg-blue-500";
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Mon Abonnement</h2>
                    <p className="text-gray-500 dark:text-gray-400">Gérez votre plan et surveillez vos quotas</p>
                </div>
                <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    Résilier l'abonnement
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Plan Details Card */}
                <Card className="lg:col-span-1 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 shadow-lg">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 rounded-full uppercase tracking-wide">
                                {currentPlan.status}
                            </span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{currentPlan.name}</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-300">
                            <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{currentPlan.price}</span>
                            <span className="text-sm"> / {currentPlan.cycle}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Inclus dans votre plan</h4>
                        <ul className="space-y-3">
                            {currentPlan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
                                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md">
                            Changer de plan
                        </Button>
                    </CardFooter>
                </Card>

                {/* Quotas Section */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Utilisation des Ressources</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {quotas.map((quota, i) => {
                            const percentage = Math.round((quota.used / quota.total) * 100);
                            return (
                                <Card key={i} className="border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-xl ${quota.color} bg-opacity-10 text-opacity-100`}>
                                                <quota.icon className={`w-6 h-6 text-gray-700 dark:text-gray-200`} />
                                            </div>
                                            <span className={`text-2xl font-bold ${percentage > 90 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                                {percentage}%
                                            </span>
                                        </div>
                                        <div className="mb-2 flex justify-between items-end">
                                            <h4 className="font-medium text-gray-700 dark:text-gray-300">{quota.label}</h4>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {quota.used} / {quota.total} {quota.unit}
                                            </span>
                                        </div>
                                        <Progress value={percentage} className="h-2" />
                                        {percentage > 90 && (
                                            <div className="mt-3 flex items-center gap-2 text-xs text-red-500 font-medium">
                                                <AlertTriangle className="w-3 h-3" />
                                                Attention : quota critique
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Upgrade Banner */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg mt-8 relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Besoin de plus de puissance ?</h3>
                                <p className="text-purple-100 max-w-lg">
                                    Passez au plan Enterprise pour des ressources illimitées et un support dédié avec un gestionnaire de compte personnel.
                                </p>
                            </div>
                            <Button variant="secondary" size="lg" className="whitespace-nowrap font-bold text-indigo-900 bg-white hover:bg-gray-100 border-none">
                                Découvrir Enterprise
                            </Button>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-purple-400 opacity-20 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
