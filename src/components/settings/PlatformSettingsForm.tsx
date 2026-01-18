import React, { useState } from 'react';
import { usePlatformConfig } from '@/contexts/PlatformConfigContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save } from 'lucide-react';

export default function PlatformSettingsForm() {
    const { settings, updateSettings, isLoading } = usePlatformConfig();
    const { toast } = useToast();
    const [formData, setFormData] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateSettings(formData);
            toast({
                title: "Paramètres mis à jour",
                description: "Les informations de la plateforme ont été enregistrées avec succès.",
                className: "bg-green-500 text-white",
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour les paramètres.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Configuration de la Plateforme (Marque Blanche)</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Modifiez l'apparence globale de votre application SaaS.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Identité Visuelle</CardTitle>
                        <CardDescription>
                            Ces paramètres affectent l'ensemble du site web.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="site_name">Nom du Site (Titre)</Label>
                            <Input
                                id="site_name"
                                name="site_name"
                                value={formData.site_name}
                                onChange={handleChange}
                                placeholder="Mon Super SaaS"
                            />
                            <p className="text-xs text-muted-foreground">Apparaît dans l'onglet du navigateur et les métadonnées SEO.</p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="site_icon_url">URL de l'Icône (Favicon)</Label>
                            <Input
                                id="site_icon_url"
                                name="site_icon_url"
                                value={formData.site_icon_url}
                                onChange={handleChange}
                                placeholder="https://example.com/favicon.ico"
                            />
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-muted-foreground">Aperçu :</span>
                                <img src={formData.site_icon_url} alt="Favicon preview" className="w-8 h-8 rounded border" onError={(e) => (e.currentTarget.src = '/favicon.ico')} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="site_logo_url">URL du Logo (Sidebar)</Label>
                            <Input
                                id="site_logo_url"
                                name="site_logo_url"
                                value={formData.site_logo_url}
                                onChange={handleChange}
                                placeholder="/logo.png"
                            />
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-muted-foreground">Aperçu :</span>
                                <img src={formData.site_logo_url} alt="Logo preview" className="h-8 max-w-[200px] border p-1 rounded bg-gray-100" onError={(e) => (e.currentTarget.src = '/logo.png')} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enregistrement...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Sauvegarder les modifications
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
