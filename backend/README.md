# 🚀 Backend - Cloud Nexus Platform

Backend Node.js pour la gestion à distance des serveurs avec WebSocket et SSH.

## 📦 Installation

```bash
cd backend
npm install
```

## 🔑 Configuration

1. Créez un fichier `.env` basé sur `.env.backend`:
```bash
cp .env.backend .env
```

2. Modifiez le `JWT_SECRET` dans `.env`

## 🚀 Démarrage

### Mode Développement
```bash
npm run dev
```

### Mode Production
```bash
npm start
```

Le serveur démarrera sur `http://localhost:3001`

## 🔐 Authentification de test

```
Username: admin
Password: admin123
```

## 📡 Endpoints API

### Authentification
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/verify` - Vérifier le token

### Serveurs
- `GET /api/servers` - Liste des serveurs
- `GET /api/servers/:id` - Détails d'un serveur
- `PATCH /api/servers/:id/metrics` - Mettre à jour les métriques

### WebSocket
- `WS /terminal/:serverId?token=JWT_TOKEN` - Terminal distant

## 🛠️ Scripts utilitaires

```bash
# Hasher un mot de passe
npm run hash-password

# Créer un utilisateur admin
npm run create-admin username password
```

## 📝 Test avec curl

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Récupérer les serveurs
curl http://localhost:3001/api/servers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## ⚠️ Notes importantes

- Le mot de passe admin par défaut doit être changé en production
- node-pty utilise un terminal local par défaut (bash)
- Pour SSH distant réel, décommentez la section SSH dans server.js
- En production, utilisez HTTPS et WSS (WebSocket Secure)

## 🔧 Dépendances principales

- express - Framework web
- ws - WebSocket server
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- node-pty - Terminal emulation
- cors - Cross-Origin Resource Sharing
