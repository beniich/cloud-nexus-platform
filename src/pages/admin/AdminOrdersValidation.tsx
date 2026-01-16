import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, MessageSquare, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { CustomOrderAPI } from '@/services/custom-order.api';
import { EmailNotificationService } from '@/services/email-notification.service';

interface Order {
    id: string;
    orderNumber: string;
    client: {
        entreprise: string;
        contact: string;
        email: string;
        telephone: string;
    };
    service: {
        type: string;
        config: Record<string, unknown>;
        options: Record<string, unknown>;
    };
    montantTotal: number;
    dateCommande: string;
    statut: 'pending' | 'validated' | 'rejected';
    stripeTransactionId?: string;
}

export default function AdminOrdersValidation() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    const fetchPendingOrders = async () => {
        try {
            const data = await CustomOrderAPI.getPendingOrders();
            setOrders(data);
        } catch (error) {
            toast.error('Erreur chargement commandes');
        }
    };

    const handleValidate = async (orderId: string) => {
        setLoading(true);
        try {
            const order = orders.find(o => o.id === orderId);
            if (!order) return;

            const success = await CustomOrderAPI.validateOrder(orderId, {
                provisioningDate: new Date().toISOString(),
                deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            });

            if (success) {
                // Envoyer email de validation
                await EmailNotificationService.sendOrderValidated({
                    orderNumber: order.orderNumber,
                    clientEmail: order.client.email,
                    clientName: order.client.contact,
                    estimatedDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')
                });

                toast.success('Commande validée ! Email envoyé au client.');
                fetchPendingOrders();
                setSelectedOrder(null);
            }
        } catch (error) {
            toast.error('Erreur validation');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (orderId: string, reason: string) => {
        setLoading(true);
        try {
            const success = await CustomOrderAPI.rejectOrder(orderId, reason);

            if (success) {
                toast.success('Commande refusée. Email envoyé au client.');
                fetchPendingOrders();
                setSelectedOrder(null);
            }
        } catch (error) {
            toast.error('Erreur refus');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestInfo = async (orderId: string) => {
        const questions = prompt('Entrez vos questions (séparez par des virgules):');
        if (!questions) return;

        setLoading(true);
        try {
            const order = orders.find(o => o.id === orderId);
            if (!order) return;

            const questionList = questions.split(',').map(q => q.trim());
            const success = await CustomOrderAPI.requestMoreInfo(orderId, questionList);

            if (success) {
                // Envoyer email demande d'infos
                await EmailNotificationService.sendInfoRequest({
                    orderNumber: order.orderNumber,
                    clientEmail: order.client.email,
                    clientName: order.client.contact,
                    questions: questionList
                });

                toast.success('Email envoyé au client pour plus d\'infos');
            }
        } catch (error) {
            toast.error('Erreur envoi demande');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Validation des Commandes</h1>
                <p className="text-gray-500">Gérer les commandes en attente</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Liste des commandes */}
                <div className="lg:col-span-2 space-y-4">
                    {orders.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center text-gray-500">
                                Aucune commande en attente
                            </CardContent>
                        </Card>
                    ) : (
                        orders.map(order => (
                            <Card
                                key={order.id}
                                className={`cursor-pointer transition-colors ${selectedOrder?.id === order.id ? 'border-blue-500 bg-blue-50' : ''
                                    }`}
                                onClick={() => setSelectedOrder(order)}
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                                            <CardDescription>
                                                {order.client.entreprise} - {order.client.email}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="secondary">⏳ En attente</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between text-sm">
                                        <span>Service: <strong>{order.service.type}</strong></span>
                                        <span className="text-lg font-bold text-blue-600">{order.montantTotal}€</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2">
                                        {new Date(order.dateCommande).toLocaleDateString('fr-FR')}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Détails commande sélectionnée */}
                {selectedOrder && (
                    <Card className="lg:col-span-1 sticky top-6">
                        <CardHeader>
                            <CardTitle>Détails Commande</CardTitle>
                            <CardDescription>{selectedOrder.orderNumber}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="font-semibold mb-2">Client</h4>
                                <p className="text-sm">{selectedOrder.client.contact}</p>
                                <p className="text-sm text-gray-500">{selectedOrder.client.email}</p>
                                <p className="text-sm text-gray-500">{selectedOrder.client.telephone}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Service Demandé</h4>
                                <p className="text-sm">Type: {selectedOrder.service.type}</p>
                                {selectedOrder.service.config && (
                                    <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-40">
                                        {JSON.stringify(selectedOrder.service.config, null, 2)}
                                    </pre>
                                )}
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Montant</h4>
                                <p className="text-2xl font-bold text-green-600">{selectedOrder.montantTotal}€</p>
                                {selectedOrder.stripeTransactionId && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Transaction: {selectedOrder.stripeTransactionId}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 pt-4 border-t">
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    onClick={() => handleValidate(selectedOrder.id)}
                                    disabled={loading}
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Valider et Provisionner
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => handleRequestInfo(selectedOrder.id)}
                                    disabled={loading}
                                >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Demander plus d'infos
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                        const reason = prompt('Motif du refus:');
                                        if (reason) handleReject(selectedOrder.id, reason);
                                    }}
                                    disabled={loading}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Refuser
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
