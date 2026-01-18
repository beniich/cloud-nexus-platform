# 🔗 INTÉGRATION DES ROUTES DANS LE SERVEUR

## 📝 Modifications à apporter à `src/server.js`

### 1. Importer les nouvelles routes

Ajoutez en haut du fichier `server.js`:

```javascript
import paymentConfigRoutes from './routes/paymentConfig.js';
```

### 2. Enregistrer les routes

Ajoutez après vos routes existantes (généralement après les routes `/api/auth`, etc.):

```javascript
// Routes de configuration de paiement
app.use('/api/payment', paymentConfigRoutes);
```

### 3. Exemple complet de server.js

Voici à quoi devrait ressembler votre `server.js`:

```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Import des routes existantes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
// ... vos autres routes

// ✨ NOUVELLE ROUTE
import paymentConfigRoutes from './routes/paymentConfig.js';

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3005',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Routes existantes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// ... vos autres routes

// ✨ NOUVELLE ROUTE DE PAIEMENT
app.use('/api/payment', paymentConfigRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Erreur serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`💳 Payment Config: http://localhost:${PORT}/api/payment/config`);
});

export default app;
```

## 🧪 Vérification de l'intégration

### 1. Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

### 2. Tester les routes

```bash
# Test 1: Health check
curl http://localhost:5000/health

# Test 2: Récupérer la config (sans auth pour tester)
curl http://localhost:5000/api/payment/config
```

### 3. Vérifier les logs

Vous devriez voir dans la console:

```
✅ Serveur démarré sur le port 5000
📡 API: http://localhost:5000/api
💳 Payment Config: http://localhost:5000/api/payment/config
```

Et lors d'une requête:

```
GET /api/payment/config 200 45ms
```

## 🔐 Middleware d'authentification

Si vous n'avez pas encore de middleware `authenticateToken`, créez-le:

### Fichier: `src/middleware/auth.js`

```javascript
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }

    req.user = user;
    next();
  });
};
```

## 🔄 Méthode alternative: Auto-import des routes

Si vous avez beaucoup de routes, vous pouvez automatiser l'import:

```javascript
// Fichier: src/routes/index.js
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const registerRoutes = async (app) => {
  const files = readdirSync(__dirname).filter(f => f.endsWith('.js') && f !== 'index.js');
  
  for (const file of files) {
    const route = await import(`./${file}`);
    const routeName = file.replace('.js', '');
    app.use(`/api/${routeName}`, route.default);
    console.log(`📌 Route registered: /api/${routeName}`);
  }
};
```

Puis dans `server.js`:

```javascript
import { registerRoutes } from './routes/index.js';

// Au lieu de multiples app.use
await registerRoutes(app);
```

## ✅ Checklist d'intégration

- [ ] Routes importées dans server.js
- [ ] Routes enregistrées avec app.use()
- [ ] Middleware d'auth créé (si nécessaire)
- [ ] Middleware de rôles créé (roleCheck.js)
- [ ] Middleware de validation créé (validate.js)
- [ ] Serveur redémarré
- [ ] Routes accessibles (test avec curl)
- [ ] Logs du serveur OK
- [ ] Pas d'erreur 404 sur /api/payment/config

## 🐛 Résolution des problèmes

### Erreur: "Cannot find module './routes/paymentConfig.js'"

```bash
# Vérifier que le fichier existe
ls -la backend/src/routes/paymentConfig.js

# Vérifier l'extension (.js)
# Si vous utilisez TypeScript, remplacez .js par .ts
```

### Erreur: "authenticateToken is not defined"

```bash
# Créer le fichier middleware/auth.js avec le code ci-dessus
# Ou vérifier l'import dans paymentConfig.js
```

### Erreur 404 sur /api/payment/config

```bash
# Vérifier que la route est bien enregistrée
# Vérifier les logs au démarrage du serveur
# Vérifier l'URL complète
```

### Les modifications ne sont pas prises en compte

```bash
# Assurez-vous que nodemon redémarre bien
# Sinon, arrêtez et relancez manuellement
killall node
npm run dev
```

## 📊 Ordre de chargement recommandé

```javascript
// 1. Imports
import express from 'express';
// ... autres imports

// 2. Configuration
dotenv.config();
const app = express();

// 3. Middleware globaux
app.use(helmet());
app.use(cors());
app.use(express.json());

// 4. Routes publiques
app.use('/api/auth', authRoutes);

// 5. Routes protégées
app.use('/api/payment', paymentConfigRoutes);
app.use('/api/users', userRoutes);

// 6. Route de santé
app.get('/health', ...);

// 7. Middleware d'erreurs
app.use((err, req, res, next) => { ... });

// 8. Démarrage serveur
app.listen(PORT, ...);
```

---

**Une fois intégré, testez avec le frontend !** 🚀

Le frontend va maintenant pouvoir:
- Charger la config depuis `GET /api/payment/config`
- Sauvegarder les modifications avec `PUT /api/payment/config`
- Tout fonctionne de bout en bout !
