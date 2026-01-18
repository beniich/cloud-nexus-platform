# 🎯 Plan d'implémentation - Configuration Paiement Multi-Rôles

## 📋 Vue d'ensemble

Création d'un système de configuration de paiement avec 3 niveaux d'accès:
- **Admin** - Configuration complète de la plateforme de paiement
- **Vendeur** - Gestion des produits et ventes
- **Client** - Achat de produits/services

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SYSTÈME DE RÔLES                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐     ┌──────────┐      ┌─────────┐           │
│  │  ADMIN   │     │ VENDEUR  │      │ CLIENT  │           │
│  └────┬─────┘     └────┬─────┘      └────┬────┘           │
│       │                │                  │                 │
│       ├─ Config all    ├─ Voir ventes    └─ Acheter        │
│       ├─ Commissions   ├─ Stats          └─ Historique     │
│       ├─ Vendeurs      ├─ Produits                         │
│       ├─ Stripe/PayPal └─ Clients                          │
│       └─ Taxes                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Fichiers à créer

### 1. Types et Interfaces
- `src/types/payment-config.types.ts` - Types pour config paiement
- `src/types/roles.ts` - Extension des rôles

### 2. Contexts
- `src/contexts/PaymentConfigContext.tsx` - État global config paiement

### 3. Services
- `src/services/PaymentConfigService.ts` - CRUD config paiement
- `src/services/CommissionService.ts` - Calcul commissions vendeurs

### 4. Pages Admin
- `src/pages/admin/PaymentSettings.tsx` - Config générale
- `src/pages/admin/CommissionSettings.tsx` - Config commissions
- `src/pages/admin/VendorManagement.tsx` - Gestion vendeurs

### 5. Pages Vendeur
- `src/pages/vendor/VendorDashboard.tsx` - Dashboard vendeur
- `src/pages/vendor/VendorProducts.tsx` - Produits du vendeur
- `src/pages/vendor/VendorSales.tsx` - Ventes et commissions

### 6. Pages Client
- `src/pages/client/ClientOrders.tsx` - Commandes client
- `src/pages/client/ClientInvoices.tsx` - Factures

### 7. Composants
- `src/components/admin/PaymentConfigForm.tsx` - Formulaire config
- `src/components/vendor/CommissionDisplay.tsx` - Affichage commissions
- `src/components/shared/RoleGuard.tsx` - Protection par rôle

### 8. Hooks
- `src/hooks/usePaymentConfig.ts` - Hook config paiement
- `src/hooks/useRoleAccess.ts` - Hook contrôle d'accès

## 🚀 Étapes d'implémentation

### Phase 1: Types et Rôles ✅
1. Étendre les types de rôles
2. Créer les types de configuration
3. Définir les permissions par rôle

### Phase 2: Contexts et Services ✅
4. Créer PaymentConfigContext
5. Implémenter PaymentConfigService
6. Créer CommissionService

### Phase 3: Composants de base ✅
7. RoleGuard component
8. Menu dynamique par rôle
9. Hooks personnalisés

### Phase 4: Pages Admin ✅
10. PaymentSettings page
11. CommissionSettings page
12. VendorManagement page

### Phase 5: Pages Vendeur ✅
13. VendorDashboard
14. VendorProducts
15. VendorSales

### Phase 6: Pages Client ✅
16. ClientOrders
17. ClientInvoices

### Phase 7: Intégration ✅
18. Routes protégées
19. Menus dynamiques
20. Tests

## 🎯 Permissions par rôle

```typescript
const ROLE_PERMISSIONS = {
  admin: [
    'payment.config.edit',
    'payment.commission.edit',
    'vendor.manage',
    'order.view.all',
    'payment.methods.manage',
    'tax.config.edit'
  ],
  
  vendor: [
    'product.create',
    'product.edit.own',
    'order.view.own',
    'commission.view.own',
    'customer.view.own'
  ],
  
  client: [
    'order.create',
    'order.view.own',
    'invoice.view.own',
    'payment.method.manage.own'
  ]
};
```

## 📝 Configuration Paiement (Admin)

### Paramètres disponibles

```typescript
interface PaymentConfiguration {
  // Passerelles de paiement
  stripe: {
    enabled: boolean;
    publicKey: string;
    secretKey: string; // Chiffré côté backend
    webhookSecret: string;
  };
  
  paypal: {
    enabled: boolean;
    clientId: string;
    clientSecret: string; // Chiffré
    mode: 'sandbox' | 'live';
  };
  
  // Commissions
  commissions: {
    defaultRate: number; // % pour les vendeurs
    adminFee: number; // % frais plateforme
    paymentProcessingFee: number; // % frais paiement
  };
  
  // Taxes
  taxes: {
    enabled: boolean;
    defaultRate: number;
    ratesByCountry: Record<string, number>;
  };
  
  // Facturation
  invoicing: {
    autoGenerate: boolean;
    prefix: string; // CN-2026-
    companyInfo: {
      name: string;
      address: string;
      taxId: string;
    };
  };
  
  // Notifications
  notifications: {
    emailOnPurchase: boolean;
    emailOnCommission: boolean;
    smsNotifications: boolean;
  };
}
```

## 🔐 Sécurité

### Contrôle d'accès

```typescript
// Dans chaque page/composant sensible
const PaymentSettings = () => {
  const { hasPermission } = useRoleAccess();
  
  if (!hasPermission('payment.config.edit')) {
    return <Unauthorized />;
  }
  
  // ... reste du code
};
```

### Protection des routes

```typescript
// Dans App.tsx
<Route
  path="/admin/payment-settings"
  element={
    <RoleGuard requiredRole="admin">
      <PaymentSettings />
    </RoleGuard>
  }
/>
```

## 📊 Dashboard par rôle

### Admin Dashboard
```
┌────────────────────────────────────────────┐
│ 📊 Vue d'ensemble                         │
├────────────────────────────────────────────┤
│ • Total ventes: 125,450€                  │
│ • Commissions vendeurs: 12,545€          │
│ • Frais plateforme: 6,272€               │
│ • Transactions: 1,234                     │
│                                            │
│ 🔧 Actions rapides:                       │
│ [Config Paiement] [Gérer Vendeurs]       │
│ [Voir Transactions] [Rapports]            │
└────────────────────────────────────────────┘
```

### Vendeur Dashboard
```
┌────────────────────────────────────────────┐
│ 💰 Mes gains                              │
├────────────────────────────────────────────┤
│ • Ventes ce mois: 15,250€                 │
│ • Ma commission: 1,525€ (10%)            │
│ • En attente: 750€                        │
│ • Nombre de ventes: 45                    │
│                                            │
│ 📦 Actions rapides:                       │
│ [Mes Produits] [Voir Ventes]             │
│ [Mes Clients] [Statistiques]              │
└────────────────────────────────────────────┘
```

### Client Dashboard
```
┌────────────────────────────────────────────┐
│ 🛍️ Mes achats                             │
├────────────────────────────────────────────┤
│ • Commandes: 12                           │
│ • Total dépensé: 2,450€                   │
│ • Abonnements actifs: 2                   │
│ • Prochaine facturation: 25/01/2026      │
│                                            │
│ 🔍 Actions rapides:                       │
│ [Mes Commandes] [Mes Factures]            │
│ [Mes Abonnements] [Méthodes Paiement]     │
└────────────────────────────────────────────┘
```

## 🔄 Workflow Vendeur

1. **Admin configure** la plateforme de paiement
2. **Admin active** un utilisateur comme vendeur
3. **Vendeur crée** ses produits/services
4. **Client achète** via le checkout standard
5. **Système calcule** automatiquement les commissions
6. **Vendeur voit** ses ventes et commissions
7. **Admin peut retirer** les gains vendeur

## 💡 Cas d'usage

### Scénario 1: Configuration initiale
```
1. Admin se connecte
2. Va dans Paramètres > Paiement
3. Configure Stripe (clés API)
4. Configure PayPal (optionnel)
5. Définit taux commission (ex: 10%)
6. Définit frais plateforme (ex: 5%)
7. Configure taxes par pays
8. Sauvegarde
```

### Scénario 2: Création vendeur
```
1. Admin va dans Gestion Vendeurs
2. Sélectionne un utilisateur
3. Upgrade vers rôle "vendor"
4. Définit taux commission personnalisé (optionnel)
5. Active le compte vendeur
```

### Scénario 3: Vente par vendeur
```
1. Client achète produit du vendeur
2. Paiement via Stripe/PayPal
3. Montant total: 100€
4. Commission vendeur (10%): 10€
5. Frais plateforme (5%): 5€
6. Net vendeur: 10€ - 0.50€ = 9.50€
7. Net admin: 85€ + 5€ = 90€
```

## 🎨 UI/UX

### Menu Admin
```
Dashboard Admin
├── 📊 Vue d'ensemble
├── 💳 Configuration Paiement
│   ├── Stripe
│   ├── PayPal
│   └── Autres méthodes
├── 💰 Commissions
│   ├── Taux par défaut
│   ├── Taux personnalisés
│   └── Historique paiements
├── 👥 Gestion Vendeurs
│   ├── Liste vendeurs
│   ├── Ajouter vendeur
│   └── Commissions vendeurs
├── 📋 Transactions
└── ⚙️ Paramètres
```

### Menu Vendeur
```
Dashboard Vendeur
├── 💰 Mes gains
├── 📦 Mes produits
│   ├── Ajouter produit
│   └── Liste produits
├── 📊 Mes ventes
│   ├── Ventes récentes
│   └── Historique
├── 👥 Mes clients
└── 📈 Statistiques
```

### Menu Client
```
Mon compte
├── 🛍️ Mes commandes
├── 📄 Mes factures
├── 🔄 Mes abonnements
├── 💳 Méthodes de paiement
└── ⚙️ Paramètres
```

---

**Prochaine étape**: Je vais maintenant créer tous ces fichiers !
