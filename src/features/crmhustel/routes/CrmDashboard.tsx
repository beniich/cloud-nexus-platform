import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building, Phone, Mail, Plus } from "lucide-react";

export default function CrmDashboard() {
    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">CRM Hustel</h1>
                    <p className="text-muted-foreground">Gestion de la relation client et prospection.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nouveau Contact
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">+20.1% par rapport au mois dernier</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Entreprises</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">321</div>
                        <p className="text-xs text-muted-foreground">+4 nouveaux cette semaine</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="min-h-[400px] flex items-center justify-center border-dashed">
                <div className="text-center">
                    <h3 className="text-lg font-medium">Tableau de bord CRM en construction</h3>
                    <p className="text-sm text-muted-foreground mt-2">Les fonctionnalités de gestion des leads et contacts arrivent bientôt.</p>
                </div>
            </Card>
        </div>
    );
}
