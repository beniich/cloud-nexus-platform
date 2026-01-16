import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Settings } from '@/types/settings';
import { Save, Server, Mail, FileText } from 'lucide-react';

interface SettingsAdminFormProps {
    settings: Settings;
    update: (section: keyof Settings, data: any) => Promise<void>;
}

export default function SettingsAdminForm({ settings, update }: SettingsAdminFormProps) {
    const [loading, setLoading] = useState(false);

    // État local initialisé avec les settings existants ou des valeurs par défaut
    const [config, setConfig] = useState({
        api: {
            baseUrl: 'https://api.cloudnexus.com',
            ordersEndpoint: '/api/orders',
            adminEndpoint: '/api/admin',
            enabled: false
        },
        email: {
            provider: 'sendgrid', // ou 'mailgun'
            apiKey: '',
            senderEmail: 'admin@cloudnexus.com',
            senderName: 'Cloud Nexus Team',
            templates: {
                orderReceived: 'd-1234567890',
                orderValidated: 'd-0987654321',
                infoRequest: 'd-1122334455'
            }
        },
        pdf: {
            companyName: 'Cloud Nexus SARL',
            logoUrl: 'https://cloudnexus.com/logo-invoice.png',
            footerText: 'SARL au capital de 10.000 DH - RC 12345 - ICE 67890',
            tvaRate: 20
        }
    });

    const handleChange = (section: string, field: string, value: any) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section as keyof typeof prev],
                [field]: value
            }
        }));
    };

    const handleTemplateChange = (key: string, value: string) => {
        setConfig(prev => ({
            ...prev,
            email: {
                ...prev.email,
                templates: {
                    ...prev.email.templates,
                    [key]: value
                }
            }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Simulation de sauvegarde (dans la vraie app, cela mettrait à jour le store/backend)
            // await update('admin', config); 

            // Pour l'instant, on simule juste le succès car 'admin' n'est pas encore dans le type Settings
            await new Promise(resolve => setTimeout(resolve, 800));

            console.log('Admin configuration saved:', config);
            toast.success('Configuration système mise à jour avec succès');
        } catch (error) {
            toast.error('Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Configuration Système (Admin)</h2>
                <p className="text-muted-foreground">
                    Gérez les connexions API, les services d'emailing et la facturation.
                </p>
            </div>

            {/* Section API Endpoints */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Server className="w-5 h-5 text-blue-500" />
                        Backend API Endpoints
                    </CardTitle>
                    <CardDescription>Configurez les points de terminaison pour les commandes et l'administration.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="space-y-0.5">
                            <Label>Activer l'API de Production</Label>
                            <p className="text-xs text-muted-foreground">Si désactivé, l'application utilise l'API Mock (localStorage).</p>
                        </div>
                        <Switch
                            checked={config.api.enabled}
                            onCheckedChange={(checked) => handleChange('api', 'enabled', checked)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Base URL</Label>
                        <Input
                            value={config.api.baseUrl}
                            onChange={(e) => handleChange('api', 'baseUrl', e.target.value)}
                            placeholder="https://api.votre-domaine.com"
                            disabled={!config.api.enabled}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Orders Endpoint</Label>
                            <Input
                                value={config.api.ordersEndpoint}
                                onChange={(e) => handleChange('api', 'ordersEndpoint', e.target.value)}
                                disabled={!config.api.enabled}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Admin Endpoint</Label>
                            <Input
                                value={config.api.adminEndpoint}
                                onChange={(e) => handleChange('api', 'adminEndpoint', e.target.value)}
                                disabled={!config.api.enabled}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section Email Service */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-green-500" />
                        Service Emailing
                    </CardTitle>
                    <CardDescription>Configuration SendGrid ou Mailgun pour les notifications transactionnelles.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Fournisseur</Label>
                            <Select
                                value={config.email.provider}
                                onValueChange={(v) => handleChange('email', 'provider', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir un provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                                    <SelectItem value="mailgun">Mailgun</SelectItem>
                                    <SelectItem value="smtp">SMTP Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>API Key</Label>
                            <Input
                                type="password"
                                value={config.email.apiKey}
                                onChange={(e) => handleChange('email', 'apiKey', e.target.value)}
                                placeholder="SG.xxxxxxxx..."
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Email Expéditeur</Label>
                            <Input
                                value={config.email.senderEmail}
                                onChange={(e) => handleChange('email', 'senderEmail', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Nom Expéditeur</Label>
                            <Input
                                value={config.email.senderName}
                                onChange={(e) => handleChange('email', 'senderName', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <Label className="mb-2 block font-semibold">IDs des Templates Email</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-xs">Commande Reçue</Label>
                                <Input
                                    value={config.email.templates.orderReceived}
                                    onChange={(e) => handleTemplateChange('orderReceived', e.target.value)}
                                    placeholder="Template ID"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs">Commande Validée</Label>
                                <Input
                                    value={config.email.templates.orderValidated}
                                    onChange={(e) => handleTemplateChange('orderValidated', e.target.value)}
                                    placeholder="Template ID"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs">Demande Info</Label>
                                <Input
                                    value={config.email.templates.infoRequest}
                                    onChange={(e) => handleTemplateChange('infoRequest', e.target.value)}
                                    placeholder="Template ID"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section PDF Generation */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-red-500" />
                        Génération PDF Factures
                    </CardTitle>
                    <CardDescription>Personnalisation des factures générées par le serveur.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Nom Société (En-tête)</Label>
                        <Input
                            value={config.pdf.companyName}
                            onChange={(e) => handleChange('pdf', 'companyName', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>URL Logo</Label>
                        <Input
                            value={config.pdf.logoUrl}
                            onChange={(e) => handleChange('pdf', 'logoUrl', e.target.value)}
                            placeholder="https://..."
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Texte Pied de Page (Mentions Légales)</Label>
                        <Input
                            value={config.pdf.footerText}
                            onChange={(e) => handleChange('pdf', 'footerText', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2 w-1/3">
                        <Label>Taux TVA (%)</Label>
                        <Input
                            type="number"
                            value={config.pdf.tvaRate}
                            onChange={(e) => handleChange('pdf', 'tvaRate', parseFloat(e.target.value))}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                        {loading ? 'Sauvegarde...' : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Enregistrer la Configuration
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
