# 💳 Système de Paiement - Documentation Complète

## 📋 Vue d'ensemble

Ce système de paiement complet permet de gérer le processus d'achat pour :
- **Hébergement web** (plans mensuels, annuels, etc.)
- **Abonnements** (services récurrents)
- **Services** (développement, design, etc.)
- **Domaines et SSL**

## 🏗️ Architecture

### Structure des dossiers

```
src/
├── types/
│   ├── payment.types.ts      # Types pour les paiements
│   └── order.types.ts        # Types pour les commandes
│
├── features/checkout/
│   ├── components/
│   │   ├── CheckoutStepper.tsx          # Indicateur d'étapes
│   │   ├── OrderSummary.tsx             # Résumé de commande
│   │   ├── PaymentMethodSelector.tsx    # Sélection paiement
│   │   ├── BillingInfoForm.tsx          # Formulaire facturation
│   │   └── OrderConfirmation.tsx        # Page confirmation
│   │
│   ├── hooks/
│   │   ├── useCheckout.ts               # Logic principale
│   │   └── usePaymentMethods.ts         # Gestion méthodes
│   │
│   ├── services/
│   │   └── CheckoutService.ts           # API checkout
│   │
│   └── types/
│       └── checkout.types.ts            # Types checkout
│
├── services/
│   ├── StripeService.ts                 # Intégration Stripe
│   ├── PayPalService.ts                 # Intégration PayPal
│   └── PaymentGateway.ts                # Gateway générique
│
└── pages/
    └── CheckoutPage.tsx                 # Page principale
```

## 🚀 Utilisation

### 1. Initialiser un Checkout

```tsx
import { useNavigate } from 'react-router-dom';
import { OrderItem } from '@/types/order.types';

function HostingPlans() {
  const navigate = useNavigate();

  const handleSelectPlan = (plan: any) => {
    // Créer l'item de commande
    const item: OrderItem = {
      id: plan.id,
      type: 'hosting',
      name: plan.name,
      description: plan.description,
      quantity: 1,
      unitPrice: plan.price,
      billingCycle: 'monthly', // ou 'annually', etc.
      setupFee: plan.setupFee,
      metadata: {
        storage: plan.storage,
        bandwidth: plan.bandwidth,
        // ... autres specs
      }
    };

    // Naviguer vers le checkout
    navigate('/checkout', {
      state: { items: [item] }
    });
  };

  return (
    // ... votre UI de plans
  );
}
```

### 2. Ajouter plusieurs items (Panier)

```tsx
import { useState } from 'react';
import { OrderItem } from '@/types/order.types';

function ShoppingCart() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const navigate = useNavigate();

  const addToCart = (product: any) => {
    const item: OrderItem = {
      id: product.id,
      type: product.type, // 'hosting', 'service', etc.
      name: product.name,
      quantity: 1,
      unitPrice: product.price,
      billingCycle: product.billingCycle,
    };

    setItems([...items, item]);
  };

  const proceedToCheckout = () => {
    navigate('/checkout', {
      state: { items }
    });
  };

  return (
    // ... votre UI de panier
  );
}
```

### 3. Personnaliser le processus

```tsx
import { useCheckout } from '@/features/checkout/hooks/useCheckout';

function CustomCheckout() {
  const {
    state,
    checkoutData,
    orderSummary,
    nextStep,
    previousStep,
    processPayment,
  } = useCheckout(initialItems);

  // Vous avez accès à tout l'état et les actions
  // pour créer une expérience personnalisée
}
```

## 💰 Intégration des Passerelles de Paiement

### Stripe

#### Installation
```bash
npm install @stripe/stripe-js
```

#### Configuration
```env
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
VITE_API_URL=http://localhost:5000/api
```

#### Utilisation
```tsx
import { StripeService } from '@/services/StripeService';

// Traiter un paiement
const result = await StripeService.processCardPayment(
  amount,
  cardDetails,
  orderId
);
```

### PayPal

#### Installation
```bash
npm install @paypal/react-paypal-js
```

#### Configuration
```env
VITE_PAYPAL_CLIENT_ID=xxxxxxxxxxxxx
```

#### Utilisation
```tsx
import { PayPalService } from '@/services/PayPalService';

// Créer une commande PayPal
const paypalOrderId = await PayPalService.createOrder(
  amount,
  orderId
);

// Capturer le paiement
const result = await PayPalService.capturePayment(paypalOrderId);
```

## 🔧 Configuration Backend Requise

### Endpoints API

Votre backend doit implémenter les endpoints suivants :

#### 1. Codes Promo
```
POST /api/checkout/promo-code/validate
Body: { code: string, items: OrderItem[] }
Response: PromoCode | null
```

#### 2. Commandes
```
POST /api/orders
Body: CheckoutData
Response: Order

GET /api/orders/:id
Response: Order

POST /api/orders/:id/cancel
Response: { success: boolean }
```

#### 3. Paiements
```
POST /api/checkout/process-payment
Body: { orderId, paymentMethodId, billingDetails }
Response: PaymentResult

POST /api/payments/stripe/create-intent
Body: { amount, currency, orderId }
Response: PaymentIntent

POST /api/payments/paypal/create-order
Body: { amount, currency, orderId }
Response: { paypalOrderId }

POST /api/payments/paypal/capture
Body: { paypalOrderId }
Response: PaymentResult
```

#### 4. Méthodes de paiement
```
GET /api/payment-methods
Response: PaymentMethod[]

POST /api/payment-methods
Body: Omit<PaymentMethod, 'id'>
Response: PaymentMethod

DELETE /api/payment-methods/:id
Response: { success: boolean }

POST /api/payment-methods/:id/set-default
Response: { success: boolean }
```

## 📊 Flux de Paiement

```
1. CART (Panier)
   ↓
   → Utilisateur révise les items
   → Peut appliquer un code promo
   ↓
2. BILLING (Facturation)
   ↓
   → Collecte des informations de facturation
   → Validation des champs requis
   ↓
3. PAYMENT (Paiement)
   ↓
   → Sélection de la méthode de paiement
   → Peut utiliser une méthode sauvegardée ou nouvelle
   ↓
4. REVIEW (Révision)
   ↓
   → Révision finale de toutes les infos
   → Acceptation des CGV
   → Calcul des taxes
   ↓
5. PROCESSING
   ↓
   → Création de la commande
   → Traitement du paiement
   ↓
6. CONFIRMATION
   ↓
   → Affichage de la confirmation
   → Email envoyé
   → Services activés
```

## 🎨 Personnalisation

### Modifier les étapes

```tsx
// Dans useCheckout.ts
const CHECKOUT_STEPS: CheckoutStep[] = [
  'cart',
  'billing',
  'payment',
  'review',
  'confirmation'
];

// Vous pouvez ajouter/retirer des étapes selon vos besoins
```

### Personnaliser les calculs de taxes

```tsx
// Dans CheckoutService.ts
static calculateTax(amount: number, country: string): number {
  const taxRates: Record<string, number> = {
    FR: 0.20,  // Modifier selon vos besoins
    BE: 0.21,
    // ... ajouter d'autres pays
  };

  const rate = taxRates[country] || 0;
  return amount * rate;
}
```

### Ajouter des méthodes de paiement

```tsx
// Dans payment.types.ts
export type PaymentProvider = 
  | 'stripe' 
  | 'paypal' 
  | 'card' 
  | 'bank_transfer'
  | 'crypto'; // ← Ajouter ici

// Puis implémenter le service correspondant
```

## 🔐 Sécurité

### Meilleures pratiques implémentées

1. **Validation des données**
   - Validation côté client ET serveur
   - Sanitization des entrées

2. **Cryptage**
   - Toutes les communications en HTTPS
   - Données sensibles jamais stockées en clair

3. **Conformité PCI-DSS**
   - Utilisation de Stripe/PayPal (certifiés PCI)
   - Pas de stockage de numéros de carte

4. **Protection CSRF**
   - Tokens d'authentification
   - Vérification des origines

## 📱 Responsive Design

Tous les composants sont **fully responsive** :
- Mobile first
- Grid layouts adaptatifs
- Touch-friendly

## ♿ Accessibilité

- Labels ARIA
- Navigation au clavier
- Contraste de couleurs conforme WCAG
- Messages d'erreur descriptifs

## 🧪 Tests

### Tester le flux complet

```tsx
// Données de test
const testItem: OrderItem = {
  id: 'test-1',
  type: 'hosting',
  name: 'Plan Premium',
  quantity: 1,
  unitPrice: 29.99,
  billingCycle: 'monthly',
};

// Code promo test
const testPromoCode = 'TEST2024'; // -20%

// Carte de test Stripe
const testCard = {
  number: '4242424242424242',
  expiryMonth: 12,
  expiryYear: 2025,
  cvc: '123',
  holderName: 'Test User',
};
```

## 📈 Analytics & Tracking

Ajoutez du tracking à chaque étape :

```tsx
import { useCheckout } from '@/features/checkout/hooks/useCheckout';

function CheckoutWithAnalytics() {
  const checkout = useCheckout();

  useEffect(() => {
    // Track step changes
    analytics.track('Checkout Step', {
      step: checkout.state.currentStep,
      items: checkout.checkoutData.items.length,
      total: checkout.orderSummary.total,
    });
  }, [checkout.state.currentStep]);

  // Track successful purchase
  useEffect(() => {
    if (checkout.order) {
      analytics.track('Purchase', {
        orderId: checkout.order.id,
        revenue: checkout.order.total,
        items: checkout.order.items,
      });
    }
  }, [checkout.order]);
}
```

## 🌍 Internationalisation

Le système supporte multiple devises et langues :

```tsx
// Dans OrderSummary.tsx
const formatPrice = (price: number, currency: string = 'EUR', locale: string = 'fr-FR') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price);
};
```

## 🎯 Prochaines étapes

1. **Installer les dépendances nécessaires** :
   ```bash
   npm install @stripe/stripe-js @paypal/react-paypal-js
   ```

2. **Configurer les variables d'environnement** (.env)

3. **Implémenter le backend API**

4. **Tester le flux complet**

5. **Personnaliser selon vos besoins**

## 📞 Support

Pour toute question sur l'utilisation de ce système, consultez :
- Les types TypeScript (documentation intégrée)
- Les exemples dans ce document
- Le code source des composants

---

**Version:** 1.0.0  
**Dernière mise à jour:** 2026-01-18
