import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/shared/ui/separator';
import { Printer, Download, ArrowLeft, CreditCard, Share2, CheckCircle2, Clock } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings'; // Supposons qu'on récupère les settings globaux ici
import { Badge } from '@/components/ui/badge';

// Mock data pour la démo - Dans la vraie app, ceci viendrait de l'API via useParams()
const MOCK_INVOICE = {
    id: 'INV-2026-001',
    status: 'paid', // paid, pending, overdue
    dateIssued: '2026-01-16',
    dateDue: '2026-02-16',
    client: {
        name: 'Tech Solutions SARL',
        email: 'billing@techsolutions.com',
        address: '123 Bd Mohamed V, Casablanca, Maroc',
        taxId: 'ICE: 001122334455'
    },
    items: [
        { description: 'Création Site E-commerce Premium', quantity: 1, price: 5000 },
        { description: 'Hébergement Serveur VPS (Annuel)', quantity: 1, price: 1200 },
        { description: 'Nom de domaine .ma', quantity: 1, price: 150 },
        { description: 'Certificat SSL Wildcard', quantity: 1, price: 500 },
    ],
    subtotal: 6850,
    taxRate: 20,
    notes: "Merci de votre confiance. Ce service inclut une maintenance de 3 mois offerte.",
    paymentMethod: "Carte Bancaire (Stripe)"
};

export default function InvoiceView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { settings } = useSettings(); // Récupère config admin (logo, company name)
    const invoiceRef = useRef<HTMLDivElement>(null);

    const invoice = MOCK_INVOICE; // Ici on ferait un fetch(id)
    const taxAmount = invoice.subtotal * (invoice.taxRate / 100);
    const total = invoice.subtotal + taxAmount;

    // Récupérer les infos de l'admin settings (avec fallback)
    // Note: Dans useSettings, ces champs sont peut-être dans une propriété 'admin' ou 'store' selon votre implémentation
    const companyName = settings.storeName || "Cloud Nexus Platform";
    const companyLogo = (settings as any).admin?.pdf?.logoUrl || "https://placehold.co/150x50/2563eb/white?text=CN";
    const footerText = (settings as any).admin?.pdf?.footerText || "SARL au capital de 10.000 DH - RC 12345 - ICE 67890";
    const companyAddress = "Technopark, Route de Nouaceur, Casablanca"; // Pourrait aussi être dans les settings

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Actions Bar - Ne s'imprime pas */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="w-4 h-4 mr-2" />
                            Imprimer
                        </Button>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                        </Button>
                        {invoice.status === 'pending' && (
                            <Button className="bg-green-600 hover:bg-green-700 text-white">
                                <CreditCard className="w-4 h-4 mr-2" />
                                Payer maintenant
                            </Button>
                        )}
                    </div>
                </div>

                {/* Invoice Paper */}
                <Card className="bg-white dark:bg-black overflow-hidden shadow-xl print:shadow-none" ref={invoiceRef}>
                    {/* Header Strip */}
                    <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 w-full" />

                    <div className="p-8 md:p-12">
                        {/* Top Section: Logo & Status */}
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <img src={companyLogo} alt="Logo" className="h-12 object-contain mb-4" />
                                <h2 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Facture Pour</h2>
                                <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">{invoice.client.name}</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-1 whitespace-pre-line">
                                    {invoice.client.address}
                                    <br />
                                    {invoice.client.taxId}
                                </p>
                            </div>
                            <div className="text-right">
                                <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-2">FACTURE</h1>
                                <p className="text-gray-500 font-medium">#{invoice.id}</p>
                                <div className="mt-4">
                                    {invoice.status === 'paid' && (
                                        <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1 text-sm">
                                            <CheckCircle2 className="w-4 h-4 mr-1" /> Payée
                                        </Badge>
                                    )}
                                    {invoice.status === 'pending' && (
                                        <Badge className="bg-orange-100 text-orange-700 border-orange-200 px-3 py-1 text-sm">
                                            <Clock className="w-4 h-4 mr-1" /> En attente
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Émetteur</h4>
                                <p className="font-bold text-gray-800 dark:text-gray-200">{companyName}</p>
                                <p className="text-sm text-gray-500">{companyAddress}</p>
                                <p className="text-sm text-gray-500">contact@cloudnexus.com</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Date d'émission</h4>
                                    <p className="font-medium">{new Date(invoice.dateIssued).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Date d'échéance</h4>
                                    <p className="font-medium">{new Date(invoice.dateDue).toLocaleDateString()}</p>
                                </div>
                                <div className="col-span-2 mt-2">
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Méthode de paiement</h4>
                                    <p className="font-medium flex items-center">
                                        {invoice.paymentMethod}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-12">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-800">
                                        <th className="py-3 text-sm font-semibold text-gray-500 uppercase tracking-wider w-1/2">Description</th>
                                        <th className="py-3 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">Qté</th>
                                        <th className="py-3 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Prix Unit.</th>
                                        <th className="py-3 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {invoice.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-4 text-gray-900 dark:text-gray-100 font-medium">
                                                {item.description}
                                            </td>
                                            <td className="py-4 text-gray-500 text-center">{item.quantity}</td>
                                            <td className="py-4 text-gray-500 text-right">{item.price.toFixed(2)} DH</td>
                                            <td className="py-4 text-gray-900 dark:text-gray-100 font-bold text-right">
                                                {(item.quantity * item.price).toFixed(2)} DH
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Section */}
                        <div className="flex justify-end mb-12">
                            <div className="w-full md:w-1/2 lg:w-1/3 space-y-3">
                                <div className="flex justify-between text-gray-500">
                                    <span>Sous-total</span>
                                    <span>{invoice.subtotal.toFixed(2)} DH</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>TVA ({invoice.taxRate}%)</span>
                                    <span>{taxAmount.toFixed(2)} DH</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2">
                                    <span>Total TTC</span>
                                    <span>{total.toFixed(2)} DH</span>
                                </div>
                            </div>
                        </div>

                        {/* Notes & Footer */}
                        {invoice.notes && (
                            <div className="mb-12 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                                <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">Notes</h4>
                                <p className="text-sm text-blue-600 dark:text-blue-300">{invoice.notes}</p>
                            </div>
                        )}

                        <div className="text-center text-xs text-gray-400 border-t pt-8 mt-auto">
                            <p>{footerText}</p>
                            <p className="mt-1">Généré par Cloud Nexus Platform</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
