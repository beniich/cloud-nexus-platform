# ⚡ DÉMARRAGE RAPIDE - 10 MINUTES

## 🎯 Objectif
Intégrer le système de paiement multi-rôles dans votre app existante en **10 minutes chrono**.

---

## ✅ Étape 1: Provider (1 min)

**Fichier:** `src/main.tsx`

```tsx
import { PaymentConfigProvider } from './contexts/PaymentConfigContext';

// AVANT:
<AuthProvider>
  <App />
</AuthProvider>

// APRÈS:
<PaymentConfigProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
</PaymentConfigProvider>
```

---

## ✅ Étape 2: Routes (2 min)

**Fichier:** `src/App.tsx`

```tsx
// Ajoutez en haut:
import PaymentSettings from './pages/admin/PaymentSettings';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminGuard } from './components/shared/RoleGuard';

// Dans vos <Routes>:
<Route
  path="/admin/payment-settings"
  element={<AdminGuard><PaymentSettings /></AdminGuard>}
/>

<Route
  path="/checkout"
  element={<CheckoutPage />}
/>
```

---

## ✅ Étape 3: Menu dynamique (3 min)

**Fichier:** `src/components/layout/Sidebar.tsx`

```tsx
// Ajoutez en haut:
import { DynamicMenu } from './DynamicMenu';
import { useAuth } from '@/contexts/AuthContext';

// REMPLACEZ votre menu existant par:
export const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Cloud Nexus</h1>
        
        {/* Badge de rôle */}
        {user && (
          <div className="mt-2">
            <span className={`
              px-3 py-1 rounded-full text-xs font-semibold
              ${user.role === 'admin' || user.role === 'owner' 
                ? 'bg-red-100 text-red-800' 
                : user.role === 'vendor' || user.role === 'seller'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }
            `}>
              {user.role.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Menu dynamique */}
      <div className="p-4">
        <DynamicMenu />
      </div>
    </aside>
  );
};
```

---

## ✅ Étape 4: Test (4 min)

### 4.1 Lancer l'application
```bash
npm run dev
```

### 4.2 Se connecter  
Utilisez un compte existant ou créez-en un.

### 4.3 Changer temporairement le rôle pour tester

**Dans la console du navigateur:**

```javascript
// Forcer le rôle Admin
localStorage.setItem('mockRole', 'admin');
location.reload();

// Forcer le rôle Vendeur
localStorage.setItem('mockRole', 'vendor');
location.reload();

// Forcer le rôle Client
localStorage.setItem('mockRole', 'client');
location.reload();
```

**OU** modifier directement dans AuthContext:

```tsx
// src/contexts/AuthContext.tsx - ligne ~60
const mockUser: User = {
  id: '1',
  email,
  name: email.split('@')[0],
  role: 'admin', // ← Changez ici: 'admin', 'vendor', 'client'
  avatar: undefined,
  teamId: 'team-1'
};
```

### 4.4 Vérifier les menus

**Avec role='admin'** → Devrait voir:
- ✅ Config. Paiement [NEW]
- ✅ Gestion Vendeurs
- ✅ Toutes les commandes

**Avec role='vendor'** → Devrait voir:
- ✅ Mes Produits
- ✅ Mes Ventes
- ❌ PAS Config. Paiement

**Avec role='client'** → Devrait voir:
- ✅ Mes Commandes
- ✅ Mes Factures
- ❌ PAS Config. Paiement
- ❌ PAS Mes Produits

---

## ✅ Étape 5: Configurer Stripe/PayPal (optionnel)

**En tant qu'admin:**

1. Aller dans **Config. Paiement**
2. Onglet **Stripe**:
   - ✅ Activer Stripe
   - Entrer: `pk_test_51xxxxxxxxxxxxx` (votre clé de test)
   - Sélectionner devises: EUR, USD
3. Onglet **PayPal** (optionnel):
   - ✅ Activer PayPal
   - Entrer Client ID
   - Mode: Sandbox
4. Onglet **Commissions**:
   - Commission vendeurs: 10%
   - Frais plateforme: 5%
   - Frais traitement: 2.9%
5. Cliquer **Enregistrer**

---

## 🎉 C'EST TERMINÉ !

Vous avez maintenant:
- ✅ Menu qui change selon le rôle
- ✅ Page de config paiement (admin uniquement)
- ✅ Protection automatique des routes
- ✅ Système de checkout complet
- ✅ Gestion des commissions vendeur

---

## 🐛 Dépannage rapide

### Le menu ne change pas ?
```tsx
// Vérifiez que useAuth() retourne bien le user avec son rôle
const { user } = useAuth();
console.log('User role:', user?.role);
```

### "Config. Paiement" n'apparaît pas ?
```tsx
// Vérifiez le rôle:
const { isAdmin } = useRoleAccess();
console.log('Is admin?', isAdmin());
// Doit retourner true pour 'admin' ou 'owner'
```

### Page de config paiement affiche "Accès refusé" ?
```tsx
// Le RoleGuard bloque. Vérifiez le rôle:
// Doit être 'admin' ou 'owner'
```

### Erreur "usePaymentConfig must be used within PaymentConfigProvider" ?
```tsx
// Vous avez oublié le provider dans main.tsx
// Ajoutez <PaymentConfigProvider> autour de <App />
```

---

## 📚 Documentation complète

Pour aller plus loin:

1. **[MULTI_ROLE_PAYMENT_SYSTEM.md](./MULTI_ROLE_PAYMENT_SYSTEM.md)** - Récapitulatif complet
2. **[INTEGRATION_GUIDE.md](./docs/INTEGRATION_GUIDE.md)** - Guide d'intégration détaillé
3. **[PAYMENT_INDEX.md](./docs/PAYMENT_INDEX.md)** - Documentation système de paiement
4. **[PAYMENT_ADMIN_PLAN.md](./docs/PAYMENT_ADMIN_PLAN.md)** - Plan architecture

---

## 🚀 Prochaines étapes

Maintenant que c'est intégré, vous pouvez:

1. **Implémenter le backend**
   - Créer les endpoints API
   - Sauvegarder la config en BDD
   - Crypter les clés secrètes

2. **Créer les pages vendeur**
   - Dashboard vendeur
   - Gestion produits
   - Vue des ventes

3. **Tester le flux complet**
   - Admin configure
   - Vendeur vend
   - Client achète

4. **Déployer en production**
   - Variables d'env
   - Clés Stripe production
   - Tests finaux

---

```
╔════════════════════════════════════════════════╗
║                                                ║
║  ⚡ 10 MINUTES CHRONO !                        ║
║                                                ║
║  ✅ Provider ajouté                            ║
║  ✅ Routes créées                              ║
║  ✅ Menu dynamique intégré                     ║
║  ✅ Testé avec différents rôles                ║
║  ✅ Configuration accessible (admin)           ║
║                                                ║
║  🎉 SYSTÈME OPÉRATIONNEL !                     ║
║                                                ║
╚════════════════════════════════════════════════╝
```

**C'est parti ! 🚀**
