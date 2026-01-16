import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Check, Globe, Server, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { CustomOrderAPI } from '@/services/custom-order.api';
import { EmailNotificationService } from '@/services/email-notification.service';

type StepId = 'type' | 'config' | 'options' | 'info' | 'payment';
type ServiceType = 'website' | 'server' | 'hosting' | '';
type WebsiteType = 'vitrine' | 'ecommerce' | 'blog' | 'application' | 'autre' | '';

interface FormData {
    // Type
    serviceType: ServiceType;

    // Config Website
    websiteType: WebsiteType;
    nbProduits?: number;
    paiements?: string;
    fonctionnalites: string;
    budget: string;
    delai: string;

    // Info Client
    entreprise: string;
    contact: string;
    email: string;
    telephone: string;

    // Options
    domaine: boolean;
    ssl: boolean;
    emailPro: number;
    maintenance: boolean;
}

export default function ServiceRequestWizard() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<StepId>('type');
    const [formData, setFormData] = useState<FormData>({
        serviceType: '',
        websiteType: '',
        fonctionnalites: '',
        budget: '',
        delai: '',
        entreprise: '',
        contact: '',
        email: '',
        telephone: '',
        domaine: false,
        ssl: false,
        emailPro: 0,
        maintenance: false,
    });

    const steps: StepId[] = ['type', 'config', 'options', 'info', 'payment'];
    const currentStepIndex = steps.indexOf(currentStep);

    const isStepCompleted = (step: StepId): boolean => {
        const index = steps.indexOf(step);
        return index < currentStepIndex;
    };

    const handleNext = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
            setCurrentStep(steps[nextIndex]);
        }
    };

    const handlePrevious = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(steps[prevIndex]);
        }
    };

    const handleSubmit = async () => {
        try {
            const total = calculateTotal();

            // Créer la commande
            const result = await CustomOrderAPI.createOrder({
                serviceType: formData.serviceType,
                config: {
                    websiteType: formData.websiteType,
                    nbProduits: formData.nbProduits,
                    paiements: formData.paiements,
                    fonctionnalites: formData.fonctionnalites,
                    budget: formData.budget,
                    delai: formData.delai,
                },
                options: {
                    domaine: formData.domaine,
                    ssl: formData.ssl,
                    emailPro: formData.emailPro,
                    maintenance: formData.maintenance,
                },
                clientInfo: {
                    entreprise: formData.entreprise,
                    contact: formData.contact,
                    email: formData.email,
                    telephone: formData.telephone,
                },
                totalAmount: total
            });

            if (result.success) {
                // Envoyer email de confirmation
                await EmailNotificationService.sendOrderReceived({
                    orderNumber: result.orderId,
                    clientEmail: formData.email,
                    clientName: formData.contact,
                    totalAmount: total
                });

                toast.success('Commande envoyée ! Vous allez recevoir un email de confirmation.');
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error('Erreur lors de l\'envoi de la commande');
        }
    };

    const calculateTotal = (): number => {
        let total = 0;

        if (formData.websiteType === 'ecommerce') total += 1200;
        else if (formData.websiteType === 'vitrine') total += 500;
        else if (formData.websiteType === 'blog') total += 300;

        if (formData.domaine) total += 12;
        if (formData.ssl) total += 50;
        if (formData.emailPro) total += formData.emailPro * 5;
        if (formData.maintenance) total += 50;

        return total;
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Stepper Header */}
            <div className="flex items-center justify-between mb-12">
                {steps.map((step, index) => (
                    <div key={step} className="flex items-center">
                        <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${isStepCompleted(step)
                                ? 'bg-green-500 border-green-500 text-white'
                                : currentStep === step
                                    ? 'bg-blue-500 border-blue-500 text-white'
                                    : 'bg-gray-200 border-gray-300 text-gray-500'
                                }`}>
                                {isStepCompleted(step) ? <Check className="w-6 h-6" /> : index + 1}
                            </div>
                            <span className="text-xs mt-2 capitalize">{step}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`h-0.5 flex-1 mx-2 ${isStepCompleted(steps[index + 1]) ? 'bg-green-500' : 'bg-gray-300'}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step: Type */}
            {currentStep === 'type' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Type de Service</CardTitle>
                        <CardDescription>Choisissez le type de service dont vous avez besoin</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => setFormData({ ...formData, serviceType: 'website' })}
                                className={`p-6 border-2 rounded-lg hover:bg-gray-50 transition-colors ${formData.serviceType === 'website' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}
                            >
                                <Globe className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                                <h3 className="font-semibold">Site Web Complet</h3>
                                <p className="text-sm text-gray-500 mt-2">E-commerce, vitrine, blog...</p>
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, serviceType: 'server' })}
                                className={`p-6 border-2 rounded-lg hover:bg-gray-50 transition-colors ${formData.serviceType === 'server' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}
                            >
                                <Server className="w-12 h-12 mx-auto mb-4 text-green-500" />
                                <h3 className="font-semibold">Serveur Pré-configuré</h3>
                                <p className="text-sm text-gray-500 mt-2">LAMP, Node.js, Docker...</p>
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, serviceType: 'hosting' })}
                                className={`p-6 border-2 rounded-lg hover:bg-gray-50 transition-colors ${formData.serviceType === 'hosting' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}
                            >
                                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                                <h3 className="font-semibold">Hébergement Simple</h3>
                                <p className="text-sm text-gray-500 mt-2">Espace web + Email</p>
                            </button>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleNext} disabled={!formData.serviceType} className="ml-auto">
                            Continuer
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step: Config */}
            {currentStep === 'config' && formData.serviceType === 'website' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration du Site Web</CardTitle>
                        <CardDescription>Détails de votre projet</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label>Type de site souhaité</Label>
                            <Select value={formData.websiteType} onValueChange={(v: WebsiteType) => setFormData({ ...formData, websiteType: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisissez..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vitrine">Site vitrine simple</SelectItem>
                                    <SelectItem value="ecommerce">Boutique en ligne (e-commerce)</SelectItem>
                                    <SelectItem value="blog">Blog / Site d'actualités</SelectItem>
                                    <SelectItem value="application">Application web personnalisée</SelectItem>
                                    <SelectItem value="autre">Autre (préciser)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.websiteType === 'ecommerce' && (
                            <>
                                <div>
                                    <Label>Nombre de produits approximatif</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={formData.nbProduits || ''}
                                        onChange={(e) => setFormData({ ...formData, nbProduits: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label>Moyens de paiement souhaités</Label>
                                    <Input
                                        placeholder="ex: Carte bancaire, PayPal, Cash..."
                                        value={formData.paiements || ''}
                                        onChange={(e) => setFormData({ ...formData, paiements: e.target.value })}
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <Label>Fonctionnalités importantes (séparez par virgule)</Label>
                            <Textarea
                                rows={4}
                                placeholder="ex: espace client, réservation, blog, newsletter..."
                                value={formData.fonctionnalites}
                                onChange={(e) => setFormData({ ...formData, fonctionnalites: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Budget approximatif (en dirhams)</Label>
                            <Select value={formData.budget} onValueChange={(v) => setFormData({ ...formData, budget: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir une fourchette" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5000-10000">5 000 – 10 000 DH</SelectItem>
                                    <SelectItem value="10000-20000">10 000 – 20 000 DH</SelectItem>
                                    <SelectItem value="20000-40000">20 000 – 40 000 DH</SelectItem>
                                    <SelectItem value="40000+">Plus de 40 000 DH</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Délai souhaité</Label>
                            <Input
                                type="date"
                                value={formData.delai}
                                onChange={(e) => setFormData({ ...formData, delai: e.target.value })}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handlePrevious}>Précédent</Button>
                        <Button onClick={handleNext}>Continuer</Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step: Options */}
            {currentStep === 'options' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Options Additionnelles</CardTitle>
                        <CardDescription>Services complémentaires</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Nom de domaine (.com, .fr, etc.)</Label>
                                <p className="text-sm text-gray-500">12€/an</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.domaine}
                                onChange={(e) => setFormData({ ...formData, domaine: e.target.checked })}
                                className="w-5 h-5"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Certificat SSL Premium</Label>
                                <p className="text-sm text-gray-500">50€/an</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.ssl}
                                onChange={(e) => setFormData({ ...formData, ssl: e.target.checked })}
                                className="w-5 h-5"
                            />
                        </div>
                        <div>
                            <Label>Email professionnel</Label>
                            <p className="text-sm text-gray-500 mb-2">5€/mois par boîte</p>
                            <Input
                                type="number"
                                min="0"
                                placeholder="Nombre de boîtes email"
                                value={formData.emailPro || ''}
                                onChange={(e) => setFormData({ ...formData, emailPro: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Maintenance mensuelle</Label>
                                <p className="text-sm text-gray-500">50€/mois</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.maintenance}
                                onChange={(e) => setFormData({ ...formData, maintenance: e.target.checked })}
                                className="w-5 h-5"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handlePrevious}>Précédent</Button>
                        <Button onClick={handleNext}>Continuer</Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step: Info */}
            {currentStep === 'info' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Vos Informations</CardTitle>
                        <CardDescription>Coordonnées pour la facturation</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>Entreprise</Label>
                                <Input
                                    required
                                    value={formData.entreprise}
                                    onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Contact</Label>
                                <Input
                                    required
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Téléphone</Label>
                                <Input
                                    type="tel"
                                    placeholder="+212 6..."
                                    required
                                    value={formData.telephone}
                                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handlePrevious}>Précédent</Button>
                        <Button onClick={handleNext}>Continuer vers le paiement</Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step: Payment */}
            {currentStep === 'payment' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Récapitulatif & Paiement</CardTitle>
                        <CardDescription>Validez votre commande</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between">
                                <span>Service:</span>
                                <span className="font-semibold">{formData.websiteType}</span>
                            </div>
                            {formData.domaine && <div className="flex justify-between"><span>Domaine</span><span>12€</span></div>}
                            {formData.ssl && <div className="flex justify-between"><span>SSL Premium</span><span>50€</span></div>}
                            {formData.emailPro > 0 && <div className="flex justify-between"><span>Email Pro ({formData.emailPro})</span><span>{formData.emailPro * 5}€</span></div>}
                            {formData.maintenance && <div className="flex justify-between"><span>Maintenance</span><span>50€/mois</span></div>}
                            <div className="border-t pt-2 flex justify-between text-xl font-bold">
                                <span>Total:</span>
                                <span>{calculateTotal()}€</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handlePrevious}>Précédent</Button>
                        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                            Valider & Payer
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
