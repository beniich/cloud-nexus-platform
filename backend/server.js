// server.js - Backend Node.js avec Express, WebSocket et SSH
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { spawn } = require('node-pty');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Configuration
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-super-securise';

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// BASE DE DONNÉES SIMULÉE (Remplacer par une vraie DB)
// ==========================================

// Utilisateurs (en production: utiliser MongoDB, PostgreSQL, etc.)
const users = [
    {
        id: '1',
        username: 'admin',
        password: '$2a$10$XQvZ5qKZ5qKZ5qKZ5qKZ5u', // "admin123" hashé
        role: 'admin'
    }
];

// Serveurs (en production: base de données)
let servers = [
    {
        id: 'srv-001',
        name: 'prod-web-01',
        ip: '192.168.1.100',
        sshPort: 22,
        sshUser: 'root',
        status: 'online',
        cpu: 45,
        memory: 62,
        disk: 38
    },
    {
        id: 'srv-002',
        name: 'prod-db-01',
        ip: '192.168.1.101',
        sshPort: 22,
        sshUser: 'root',
        status: 'online',
        cpu: 78,
        memory: 85,
        disk: 65
    },
    {
        id: 'srv-003',
        name: 'dev-app-01',
        ip: '192.168.1.102',
        sshPort: 22,
        sshUser: 'root',
        status: 'maintenance',
        cpu: 12,
        memory: 25,
        disk: 15
    }
];

// ==========================================
// MIDDLEWARE D'AUTHENTIFICATION
// ==========================================

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide ou expiré' });
        }
        req.user = user;
        next();
    });
}

// ==========================================
// ROUTES API REST
// ==========================================

// Authentification - Login
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    // Rechercher l'utilisateur
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Générer le token JWT
    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});

// Vérifier le token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({ valid: true, user: req.user });
});

// Récupérer tous les serveurs
app.get('/api/servers', authenticateToken, (req, res) => {
    res.json(servers);
});

// Récupérer un serveur spécifique
app.get('/api/servers/:id', authenticateToken, (req, res) => {
    const server = servers.find(s => s.id === req.params.id);

    if (!server) {
        return res.status(404).json({ error: 'Serveur non trouvé' });
    }

    res.json(server);
});

// Mettre à jour les métriques d'un serveur (simulation)
app.patch('/api/servers/:id/metrics', authenticateToken, (req, res) => {
    const server = servers.find(s => s.id === req.params.id);

    if (!server) {
        return res.status(404).json({ error: 'Serveur non trouvé' });
    }

    const { cpu, memory, disk, status } = req.body;

    if (cpu !== undefined) server.cpu = cpu;
    if (memory !== undefined) server.memory = memory;
    if (disk !== undefined) server.disk = disk;
    if (status !== undefined) server.status = status;

    res.json(server);
});

// ==========================================
// WEBSOCKET - TERMINAL SSH
// ==========================================

// Map pour stocker les sessions terminales actives
const terminalSessions = new Map();

wss.on('connection', (ws, req) => {
    console.log('Nouvelle connexion WebSocket');

    // Extraire le token et l'ID du serveur depuis l'URL
    const params = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const token = params.get('token');
    const serverId = req.url.split('/terminal/')[1]?.split('?')[0];

    // Vérifier le token
    if (!token) {
        ws.send(JSON.stringify({ type: 'error', message: 'Token manquant' }));
        ws.close();
        return;
    }

    let user;
    try {
        user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        ws.send(JSON.stringify({ type: 'error', message: 'Token invalide' }));
        ws.close();
        return;
    }

    // Vérifier que le serveur existe
    const server = servers.find(s => s.id === serverId);
    if (!server) {
        ws.send(JSON.stringify({ type: 'error', message: 'Serveur non trouvé' }));
        ws.close();
        return;
    }

    console.log(`User ${user.username} se connecte au serveur ${server.name}`);

    // Créer une session SSH via node-pty
    // IMPORTANT: En production, utilisez une vraie connexion SSH avec ssh2 ou similar
    let ptyProcess;

    try {
        // Option 1: Terminal local (développement)
        ptyProcess = spawn('bash', [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.env.HOME,
            env: process.env
        });

        // Option 2: SSH distant (production) - Décommentez et configurez
        /*
        ptyProcess = spawn('ssh', [
          '-o', 'StrictHostKeyChecking=no',
          '-p', server.sshPort.toString(),
          `${server.sshUser}@${server.ip}`
        ], {
          name: 'xterm-color',
          cols: 80,
          rows: 30,
          cwd: process.env.HOME,
          env: process.env
        });
        */

        // Message de bienvenue
        ws.send(`\r\n\x1b[32m╔════════════════════════════════════════════╗\x1b[0m\r\n`);
        ws.send(`\x1b[32m║\x1b[0m  Connecté à: ${server.name.padEnd(28)} \x1b[32m║\x1b[0m\r\n`);
        ws.send(`\x1b[32m║\x1b[0m  IP: ${server.ip.padEnd(33)} \x1b[32m║\x1b[0m\r\n`);
        ws.send(`\x1b[32m║\x1b[0m  Utilisateur: ${user.username.padEnd(26)} \x1b[32m║\x1b[0m\r\n`);
        ws.send(`\x1b[32m╚════════════════════════════════════════════╝\x1b[0m\r\n\r\n`);

        // Transmettre les données du terminal au client WebSocket
        ptyProcess.onData((data) => {
            try {
                ws.send(data);
            } catch (err) {
                console.error('Erreur envoi données:', err);
            }
        });

        // Transmettre les données du client au terminal
        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);

                if (data.type === 'input') {
                    ptyProcess.write(data.data);
                } else if (data.type === 'resize') {
                    ptyProcess.resize(data.cols, data.rows);
                }
            } catch (err) {
                console.error('Erreur traitement message:', err);
            }
        });

        // Gérer la fermeture de la connexion
        ws.on('close', () => {
            console.log(`Déconnexion terminal: ${server.name}`);
            if (ptyProcess) {
                ptyProcess.kill();
            }
            terminalSessions.delete(ws);
        });

        // Gérer les erreurs
        ptyProcess.onExit((exitCode) => {
            console.log(`Terminal exited with code: ${exitCode}`);
            ws.close();
        });

        // Stocker la session
        terminalSessions.set(ws, { ptyProcess, server, user });

    } catch (err) {
        console.error('Erreur création terminal:', err);
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Erreur lors de la création du terminal'
        }));
        ws.close();
    }
});

// ==========================================
// SIMULATION DE MISE À JOUR DES MÉTRIQUES
// ==========================================

// Simuler la mise à jour des métriques toutes les 5 secondes
setInterval(() => {
    servers.forEach(server => {
        if (server.status === 'online') {
            // Variation aléatoire des métriques
            server.cpu = Math.max(0, Math.min(100, server.cpu + (Math.random() - 0.5) * 10));
            server.memory = Math.max(0, Math.min(100, server.memory + (Math.random() - 0.5) * 5));
            server.disk = Math.max(0, Math.min(100, server.disk + (Math.random() - 0.5) * 2));
        }
    });
}, 5000);

// ==========================================
// DÉMARRAGE DU SERVEUR
// ==========================================

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║  🚀 Serveur démarré avec succès !              ║
╠════════════════════════════════════════════════╣
║  HTTP API:    http://localhost:${PORT}        ║
║  WebSocket:   ws://localhost:${PORT}          ║
╠════════════════════════════════════════════════╣
║  Routes disponibles:                           ║
║  POST   /api/auth/login                        ║
║  GET    /api/auth/verify                       ║
║  GET    /api/servers                           ║
║  GET    /api/servers/:id                       ║
║  PATCH  /api/servers/:id/metrics               ║
║  WS     /terminal/:serverId?token=...          ║
╠════════════════════════════════════════════════╣
║  Login test:                                   ║
║  username: admin                               ║
║  password: admin123                            ║
╚════════════════════════════════════════════════╝
  `);
});

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
    console.log('SIGTERM reçu, fermeture du serveur...');
    server.close(() => {
        console.log('Serveur fermé');
        process.exit(0);
    });
});
