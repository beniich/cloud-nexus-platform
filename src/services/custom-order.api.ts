// Backend API Mock pour les commandes personnalisées
// À remplacer par de vraies API calls vers votre serveur Express

interface CustomOrderRequest {
    serviceType: 'website' | 'server' | 'hosting';
    config: any;
    options: any;
    clientInfo: {
        entreprise: string;
        contact: string;
        email: string;
        telephone: string;
    };
    totalAmount: number;
}

interface Order {
    id: string;
    orderNumber: string;
    client: any;
    service: any;
    montantTotal: number;
    dateCommande: string;
    statut: 'pending' | 'validated' | 'rejected';
    stripeTransactionId?: string;
}

export const CustomOrderAPI = {
    /**
     * Créer une nouvelle commande personnalisée
     */
    async createOrder(data: CustomOrderRequest): Promise<{ success: boolean; orderId: string }> {
        // TODO: Remplacer par fetch('/api/orders/custom', {method: 'POST', ...})

        // Mock: Simulation delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const orderId = `ORD-${Date.now()}`;

        // Mock: Sauvegarder en localStorage temporairement
        const orders = JSON.parse(localStorage.getItem('custom_orders') || '[]');
        orders.push({
            id: orderId,
            orderNumber: `CMD-${String(orders.length + 1).padStart(6, '0')}`,
            client: data.clientInfo,
            service: {
                type: data.serviceType,
                config: data.config,
                options: data.options
            },
            montantTotal: data.totalAmount,
            dateCommande: new Date().toISOString(),
            statut: 'pending'
        });
        localStorage.setItem('custom_orders', JSON.stringify(orders));

        return { success: true, orderId };
    },

    /**
     * Récupérer les commandes en attente (Admin)
     */
    async getPendingOrders(): Promise<Order[]> {
        // TODO: Remplacer par fetch('/api/admin/orders/pending')

        await new Promise(resolve => setTimeout(resolve, 500));

        const orders = JSON.parse(localStorage.getItem('custom_orders') || '[]');
        return orders.filter((o: Order) => o.statut === 'pending');
    },

    /**
     * Valider une commande (Admin)
     */
    async validateOrder(orderId: string, data: { provisioningDate: string; deliveryDate: string }): Promise<boolean> {
        // TODO: Remplacer par fetch(`/api/admin/orders/${orderId}/validate`, {method: 'POST', ...})

        await new Promise(resolve => setTimeout(resolve, 1000));

        const orders = JSON.parse(localStorage.getItem('custom_orders') || '[]');
        const index = orders.findIndex((o: Order) => o.id === orderId);

        if (index !== -1) {
            orders[index].statut = 'validated';
            orders[index].provisioningDate = data.provisioningDate;
            orders[index].deliveryDate = data.deliveryDate;
            localStorage.setItem('custom_orders', JSON.stringify(orders));
            return true;
        }
        return false;
    },

    /**
     * Refuser une commande (Admin)
     */
    async rejectOrder(orderId: string, reason: string): Promise<boolean> {
        // TODO: Remplacer par fetch(`/api/admin/orders/${orderId}/reject`, {method: 'POST', ...})

        await new Promise(resolve => setTimeout(resolve, 1000));

        const orders = JSON.parse(localStorage.getItem('custom_orders') || '[]');
        const index = orders.findIndex((o: Order) => o.id === orderId);

        if (index !== -1) {
            orders[index].statut = 'rejected';
            orders[index].rejectionReason = reason;
            localStorage.setItem('custom_orders', JSON.stringify(orders));
            return true;
        }
        return false;
    },

    /**
     * Demander plus d'informations
     */
    async requestMoreInfo(orderId: string, questions: string[]): Promise<boolean> {
        // TODO: Remplacer par fetch(`/api/admin/orders/${orderId}/request-info`, {method: 'POST', ...})

        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock: Juste retourner success
        console.log(`Info requested for ${orderId}:`, questions);
        return true;
    }
};
