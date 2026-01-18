# 🚀 GUIDE D'INTÉGRATION - Système de Paiement Multi-Rôles

## ✅ Ce qui a été créé

###Types et Interfaces
- ✅ `src/types/payment-config.types.ts` - Types configuration paiement
- ✅ `src/types/auth.ts` - Déjà existant, rôles définis

### Contexts
- ✅ `src/contexts/PaymentConfigContext.tsx` - Configuration globale
- ✅ `src/contexts/AuthContext.tsx` - Déjà existant

### Hooks
- ✅ `src/hooks/useRoleAccess.ts` - Contrôle d'accès par rôle

### Composants
- ✅ `src/components/shared/RoleGuard.tsx` - Protection de routes

### Pages
- ✅ `src/pages/admin/PaymentSettings.tsx` - Config paiement admin

## 🔧 ÉTAPES D'INTÉGRATION

### Étape 1: Wrapper App avec PaymentConfigProvider

Dans `src/main.tsx`,ajoutez le provider :

```tsx
import { PaymentConfigProvider } from './contexts/PaymentConfigContext';

// Dans la structure des providers
<PaymentConfigProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
</PaymentConfigProvider>
```

### Étape 2: Ajouter les routes dans App.tsx

```tsx
import PaymentSettings from './pages/admin/PaymentSettings';
import { RoleGuard, AdminGuard } from './components/shared/RoleGuard';

// Dans vos routes
function App() {
  return (
    <Routes>
      {/* Routes existantes... */}
      
      {/* NOUVELLES ROUTES ADMIN */}
      <Route
        path="/admin/payment-settings"
        element={
          <AdminGuard>
            <PaymentSettings />
          </AdminGuard>
        }
      />
      
      {/* Route checkout (déjà créée) */}
      <Route path="/checkout" element={<CheckoutPage />} />
    </Routes>
  );
}
```

### Étape 3: Créer le menu dynamique par rôle

Créez `src/components/layout/DynamicMenu.tsx` :

```tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  CreditCard,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Settings,
  FileText,
  TrendingUp
} from 'lucide-react';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  roles: string[];
}

const MENU_ITEMS: MenuItem[] = [
  // ADMIN
  {
    label: 'Dashboard Admin',
    path: '/admin',
    icon: LayoutDashboard,
    roles: ['admin', 'owner']
  },
  {
    label: 'Config. Paiement',
    path: '/admin/payment-settings',
    icon: CreditCard,
    roles: ['admin', 'owner']
  },
  {
    label: 'Gestion Vendeurs',
    path: '/admin/vendors',
    icon: Users,
    roles: ['admin', 'owner']
  },
  {
    label: 'Toutes les commandes',
    path: '/admin/orders',
    icon: ShoppingCart,
    roles: ['admin', 'owner']
  },
  
  // VENDEUR
  {
    label: 'Mon Dashboard',
    path: '/vendor/dashboard',
    icon: TrendingUp,
    roles: ['vendor', 'seller']
  },
  {
    label: 'Mes Produits',
    path: '/vendor/products',
    icon: Package,
    roles: ['vendor', 'seller']
  },
  {
    label: 'Mes Ventes',
    path: '/vendor/sales',
    icon: DollarSign,
    roles: ['vendor', 'seller']
  },
  
  // CLIENT
  {
    label: 'Mes Commandes',
    path: '/orders',
    icon: ShoppingCart,
    roles: ['client', 'vendor', 'seller', 'admin', 'owner']
  },
  {
    label: 'Mes Factures',
    path: '/invoices',
    icon: FileText,
    roles: ['client', 'vendor', 'seller', 'admin', 'owner']
  },
  
  // TOUS
  {
    label: 'Paramètres',
    path: '/settings',
    icon: Settings,
    roles: ['client', 'vendor', 'seller', 'admin', 'owner']
  },
];

export const DynamicMenu: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { hasAnyRole } = useRoleAccess();

  if (!user) return null;

  // Filtrer les items selon le rôle
  const visibleItems = MENU_ITEMS.filter(item => 
    hasAnyRole(item.roles as any[])
  );

  return (
    <nav className="space-y-1">
      {visibleItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
```

### Étape 4: Intégrer le menu dans Sidebar

Dans `src/components/layout/Sidebar.tsx`, remplacez le menu existant :

```tsx
import { DynamicMenu } from './DynamicMenu';

// Dans le composant Sidebar
<aside className="w-64 bg-white border-r border-gray-200 h-screen">
  <div className="p-4">
    <h1 className="text-xl font-bold">Cloud Nexus</h1>
  </div>
  
  <div className="px-4 py-2">
    <DynamicMenu />
  </div>
</aside>
```

### Étape 5: Afficher le rôle de l'utilisateur

Ajoutez un indicateur de rôle dans le header :

```tsx
import { useAuth } from '@/contexts/AuthContext';

export const Header: React.FC = () => {
  const { user } = useAuth();

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: { label: 'Admin', color: 'bg-red-100 text-red-800' },
      owner: { label: 'Propriétaire', color: 'bg-purple-100 text-purple-800' },
      vendor: { label: 'Vendeur', color: 'bg-green-100 text-green-800' },
      seller: { label: 'Vendeur', color: 'bg-green-100 text-green-800' },
      client: { label: 'Client', color: 'bg-blue-100 text-blue-800' },
    };

    const badge = badges[role] || badges.client;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <div className="flex items-center gap-3">
        <img src={user?.avatar} className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-medium">{user?.name}</p>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
        {getRoleBadge(user?.role || 'client')}
      </div>
    </header>
  );
};
```

## 🎯 UTILISATION

### Pour accéder à la config de paiement (Admin)

1. Se connecter avec un compte **admin** ou **owner**
2. Aller dans le menu → **Config. Paiement**
3. Configurer :
   - ✅ Stripe (clés API)
   - ✅ PayPal (client ID, mode)
   - ✅ Commissions vendeurs
   - ✅ Taxes par pays
   - ✅ Facturation automatique
   - ✅ Notifications

### Vérifier le rôle dans n'importe quel composant

```tsx
import { useRoleAccess } from '@/hooks/useRoleAccess';

function MyComponent() {
  const { isAdmin, isVendor, canManagePayments } = useRoleAccess();

  if (canManagePayments()) {
    return <button>Configurer paiements</button>;
  }

  if (isVendor()) {
    return <div>Mes ventes: 1,250€</div>;
  }

  return <div>Client view</div>;
}
```

### Protéger une route

```tsx
// Méthode 1: Avec le composant
<Route
  path="/admin/payment-settings"
  element={
    <AdminGuard>
      <PaymentSettings />
    </AdminGuard>
  }
/>

// Méthode 2: Avec RoleGuard et rôles spécifiques
<Route
  path="/vendor/dashboard"
  element={
    <RoleGuard requiredRole={['vendor', 'seller', 'admin']}>
      <VendorDashboard />
    </RoleGuard>
  }
/>
```

## 📊 Exemple de flux complet

### Scénario: Admin configure le système

```
1. Admin se connecte (role: 'admin')
   ↓
2. Menu affiche "Config. Paiement"
   ↓
3. Admin va dans /admin/payment-settings
   ↓
4. RoleGuard vérifie: isAdmin() → ✅ AUTORISÉ
   ↓
5. Page charge la config actuelle via PaymentConfigContext
   ↓
6. Admin modifie:
   - Active Stripe
   - Entre la clé publique
   - Définit commission vendeurs: 10%
   - Active taxes: 20%
   ↓
7. Clique "Enregistrer"
   ↓
8. usePaymentConfig().updateConfig() envoie au backend
   ↓
9. Backend sauvegarde (sécurisé, clés cryptées)
   ↓
10. Toast success: "Configuration enregistrée"
```

### Scénario: Vendeur voit ses commissions

```
1. Vendeur se connecte (role: 'vendor')
   ↓
2. Menu affiche "Mes Ventes"
   (PAS "Config. Paiement" car pas admin)
   ↓
3. Vendeur va dans /vendor/sales
   ↓
4. RoleGuard vérifie: isVendor() → ✅ AUTORISÉ
   ↓
5. Page charge ses ventes avec commissions calculées
   ↓
6. Affiche: "Commission: 125€ (10% de 1250€)"
```

### Scénario: Client achète

```
1. Client se connecte (role: 'client')
   ↓
2. Menu affiche "Mes Commandes"
   (PAS les options admin/vendeur)
   ↓
3. Client sélectionne un produit → /checkout
   ↓
4. Système utilise la config de PaymentConfigContext:
   - Stripe activé? → Affiche option Stripe
   - PayPal activé? → Affiche option PayPal
   - Applique taxes selon pays
   ↓
5. Client paie
   ↓
6. Si produit d'un vendeur:
   - Calcule commission avec le taux configuré
   - Crée une entrée dans `commissions`
```

## 🔐 Sécurité

### Règles importantes

1. **Clés secrètes JAMAIS côté client**
   - Stripe Secret Key → Backend uniquement
   - PayPal Secret → Backend uniquement

2. **Validation côté serveur**
   - Toute action sensible doit être validée côté backend
   - Ne jamais faire confiance au rôle côté client seul

3. **Tokens sécurisés**
   - JWT avec expiration courte
   - Refresh tokens HttpOnly

4. **Audit logs**
   - Logger toute modification de config
   - Tracer qui a fait quoi

## 📝 Checklist d'intégration

- [ ] Ajouter PaymentConfigProvider dans main.tsx
- [ ] Ajouter route /admin/payment-settings dans App.tsx
- [ ] Créer DynamicMenu.tsx
- [ ] Intégrer DynamicMenu dans Sidebar
- [ ] Ajouter badge de rôle dans Header
- [ ] Tester avec compte admin
- [ ] Tester avec compte vendeur
- [ ] Tester avec compte client
- [ ] Vérifier que les routes sont protégées
- [ ] Configurer les variables d'env backend

## 🚀 Prochaines étapes

Voici l'ordre de priorité pour compléter le système :

1. **Backend API** ⚠️ CRITIQUE
   - Implémenter POST/PUT /api/payment/config
   - Crypter les clés secrètes
   - Endpoints commissions vendeurs

2. **Pages Vendeur**
   - Dashboard vendeur avec stats
   - Liste produits
   - Historique ventes

3. **Page Gestion Vendeurs (Admin)**
   - Liste des vendeurs
   - Upgrade utilisateur → vendeur
   - Config commission personnalisée

4. **Calcul automatique commissions**
   - Sur chaque vente
   - Créer entrée `Commission`
   - Afficher dans dashboard vendeur

5. **Système de payout**
   - Admin peut payer les vendeurs
   - Historique des paiements
   - Notifications

## 💡 Astuce: Test rapide

Pour tester rapidement, simulez un changement de rôle :

```tsx
// Temporaire pour dev
const { user } = useAuth();

// Force un rôle pour tester
user.role = 'admin'; // ou 'vendor', 'client'

// Rafraîchir la page pour voir le menu changer
```

---

**Vous avez maintenant tout pour démarrer ! 🎉**

La configuration de paiement est accessible uniquement aux admins, et le système s'adapte automatiquement selon le rôle de l'utilisateur connecté.
