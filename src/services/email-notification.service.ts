// Service pour gérer les emails de notification de commande

interface EmailTemplate {
    to: string;
    subject: string;
    body: string;
    attachments?: Array<{
        filename: string;
        content: Blob;
    }>;
}

export const EmailNotificationService = {
    /**
     * Email 1: Commande reçue (envoyé immédiatement après paiement)
     */
    async sendOrderReceived(orderData: {
        orderNumber: string;
        clientEmail: string;
        clientName: string;
        totalAmount: number;
    }): Promise<boolean> {
        const template: EmailTemplate = {
            to: orderData.clientEmail,
            subject: `✅ Commande ${orderData.orderNumber} - En attente de validation`,
            body: `
Bonjour ${orderData.clientName},

Merci pour votre commande !

📦 Résumé:
- Numéro de commande: ${orderData.orderNumber}
- Total: ${orderData.totalAmount}€

💳 Paiement: Réglé le ${new Date().toLocaleDateString('fr-FR')}

📋 Statut: En attente de validation par notre équipe

Nos experts vont analyser votre demande et valider la faisabilité 
dans les 24h. Vous recevrez un email de confirmation dès validation.

Cordialement,
L'équipe Cloud Nexus

---
[Voir ma commande](${window.location.origin}/dashboard)
            `.trim()
        };

        return this.sendEmail(template);
    },

    /**
     * Email 2: Commande validée par l'admin
     */
    async sendOrderValidated(orderData: {
        orderNumber: string;
        clientEmail: string;
        clientName: string;
        estimatedDelivery: string;
        accessUrl?: string;
    }): Promise<boolean> {
        const template: EmailTemplate = {
            to: orderData.clientEmail,
            subject: `🎉 Votre commande ${orderData.orderNumber} a été validée !`,
            body: `
Bonjour ${orderData.clientName},

Excellente nouvelle ! Notre équipe a validé votre demande.

📅 Planning:
- Provisioning serveur: En cours
- Livraison estimée: ${orderData.estimatedDelivery}

${orderData.accessUrl ? `🔐 Vos accès:
- URL temporaire: ${orderData.accessUrl}
- Identifiants envoyés séparément` : ''}

📄 Votre facture définitive est en pièce jointe.

Vous pouvez suivre l'avancement sur votre dashboard:
[Voir mon projet](${window.location.origin}/dashboard)

À très bientôt !
L'équipe Cloud Nexus
            `.trim()
        };

        return this.sendEmail(template);
    },

    /**
     * Email 3: Demande d'informations complémentaires
     */
    async sendInfoRequest(orderData: {
        orderNumber: string;
        clientEmail: string;
        clientName: string;
        questions: string[];
    }): Promise<boolean> {
        const template: EmailTemplate = {
            to: orderData.clientEmail,
            subject: `⚠️ Informations manquantes - Commande ${orderData.orderNumber}`,
            body: `
Bonjour ${orderData.clientName},

Nous avons besoin de précisions pour finaliser votre projet:

Questions:
${orderData.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Merci de répondre via votre dashboard ou par email.

[Répondre maintenant](${window.location.origin}/dashboard)

Cordialement,
L'équipe Cloud Nexus
            `.trim()
        };

        return this.sendEmail(template);
    },

    /**
     * Fonction backend pour envoyer l'email (à implémenter côté serveur)
     */
    async sendEmail(template: EmailTemplate): Promise<boolean> {
        try {
            const response = await fetch('/api/emails/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(template)
            });

            return response.ok;
        } catch (error) {
            console.error('Erreur envoi email:', error);
            return false;
        }
    }
};
