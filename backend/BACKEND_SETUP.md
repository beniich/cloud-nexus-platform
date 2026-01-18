# 🚀 INSTALLATION & CONFIGURATION DU BACKEND

## 📋 Prérequis

- Node.js 18+ installé
- PostgreSQL 14+ installé et en cours d'exécution
- Redis installé (optionnel mais recommandé)
- Git installé

## 🔧 Installation

### 1. Naviguer vers le dossier backend

```bash
cd backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos valeurs
nano .env
```

**Variables critiques à configurer:**

```env
# Base de données
DATABASE_URL=postgresql://username:password@localhost:5432/cloud_nexus

# Cryptage (générer une nouvelle clé)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=la_cle_generee_ci_dessus

# JWT
JWT_SECRET=votre_secret_jwt_unique

# Stripe (mode test pour commencer)
STRIPE_TEST_PUBLIC_KEY=pk_test_...
STRIPE_TEST_SECRET_KEY=sk_test_...
```

### 4. Créer la base de données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base
CREATE DATABASE cloud_nexus;

# Créer un utilisateur (optionnel)
CREATE USER cloud_nexus_user WITH PASSWORD 'votre_password';
GRANT ALL PRIVILEGES ON DATABASE cloud_nexus TO cloud_nexus_user;

# Quitter
\q
```

### 5. Exécuter le schéma SQL

```bash
# Méthode 1: Via psql
psql -U postgres -d cloud_nexus -f src/db/payment_schema.sql

# Méthode 2: Via script node (à créer)
node src/db/migrate.js
```

### 6. Lancer le serveur

```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

Le serveur devrait démarrer sur **http://localhost:5000**

## 📁 Routes créées

### Configuration Paiement (Admin seulement)

```
GET    /api/payment/config          # Récupérer la config
PUT    /api/payment/config          # Mettre à jour la config
POST   /api/payment/test/stripe     # Tester connexion Stripe
POST   /api/payment/test/paypal     # Tester connexion PayPal
```

## 🧪 Tester les endpoints

### 1. Obtenir un token d'authentification

```bash
# Se connecter pour obtenir un token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "votre_password"
  }'
```

Réponse:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### 2. Récupérer la configuration de paiement

```bash
curl -X GET http://localhost:5000/api/payment/config \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

### 3. Mettre à jour la configuration (Admin)

```bash
curl -X PUT http://localhost:5000/api/payment/config \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "stripe": {
      "enabled": true,
      "publicKey": "pk_test_xxxxx"
    },
    "commissions": {
      "defaultVendorRate": 10,
      "adminFee": 5
    }
  }'
```

## 🔐 Sécurité

### Cryptage des clés secrètes

Les clés Stripe Secret Key et PayPal Client Secret sont automatiquement cryptées avant d'être stockées en base de données.

**Algorithme:** AES-256-CBC

**Clé de cryptage:** Variable d'environnement `ENCRYPTION_KEY` (32 bytes en hex)

### Génération de la clé de cryptage

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**⚠️ IMPORTANT:** Sauvegardez cette clé en lieu sûr ! Si vous la perdez, vous ne pourrez plus décrypter les clés secrètes stockées.

## 📊 Structure de la base de données

```
payment_config             # Configuration globale
├── stripe_*              # Params Stripe
├── paypal_*              # Params PayPal
├── commissions           # Taux de commission
├── taxes                 # Configuration taxes
└── notifications         # Préférences notifications

vendor_payment_config     # Config spécifique vendeur
├── custom_commission_rate
├── payout_schedule
└── bank_details

commissions               # Commissions vendeurs
├── order_id
├── commission_amount
├── status
└── paid_at

vendor_payouts            # Paiements aux vendeurs
├── vendor_id
├── amount
├── commission_ids
└── status

orders                    # Commandes
├── user_id
├── vendor_id
├── items
└── payment_status

invoices                  # Factures
├── order_id
├── invoice_number
└── pdf_url

audit_logs                # Journal d'audit
├── user_id
├── action
└── entity_type
```

## 🔗 Intégration avec le frontend

Le frontend est déjà configuré pour utiliser ces endpoints via:
- `PaymentConfigContext` → Gère l'état de la config
- `usePaymentConfig` hook → Accès facile aux fonctions

**Base URL:** Définie dans `VITE_API_URL` (frontend)

```env
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

## 🐛 Dépannage

### Erreur: "Cannot connect to database"
```bash
# Vérifier que PostgreSQL est lancé
sudo systemctl status postgresql

# Vérifier la connexion
psql -U postgres -d cloud_nexus -c "SELECT 1;"
```

### Erreur: "ENCRYPTION_KEY not found"
```bash
# Générer et ajouter la clé dans .env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
echo "ENCRYPTION_KEY=cle_generee" >> .env
```

### Erreur: "Port 5000 already in use"
```bash
# Changer le port dans .env
PORT=5001
```

### Les routes ne fonctionnent pas
```bash
# Vérifier que les routes sont bien enregistrées dans server.js
# Voir le fichier d'intégration ci-dessous
```

## 📝 Fichier d'intégration server.js

Ajoutez dans votre `src/server.js`:

```javascript
import paymentConfigRoutes from './routes/paymentConfig.js';

// Après les autres routes
app.use('/api/payment', paymentConfigRoutes);
```

## ✅ Checklist de déploiement

- [ ] PostgreSQL configuré et accessible
- [ ] Base de données créée
- [ ] Schéma SQL exécuté
- [ ] Variables d'environnement configurées
- [ ] Clé ENCRYPTION_KEY générée et sécurisée
- [ ] Dépendances installées (npm install)
- [ ] Serveur démarre sans erreur
- [ ] Routes accessibles (tester avec curl)
- [ ] Frontend configuré (VITE_API_URL)
- [ ] Tests de connexion Stripe/PayPal réussis

## 🚀 Commandes utiles

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Lancer en production
npm start

# Afficher les logs
tail -f logs/server.log

# Redémarrer le serveur
pm2 restart cloud-nexus-api

# Vérifier la santé du serveur
curl http://localhost:5000/health
```

## 📚 Documentation API complète

Pour une documentation interactive de l'API, installez Swagger:

```bash
npm install swagger-ui-express swagger-jsdoc
```

Puis accédez à: **http://localhost:5000/api-docs**

---

**Vous êtes prêt ! Le backend est configuré pour recevoir les modifications du frontend.** 🎉
