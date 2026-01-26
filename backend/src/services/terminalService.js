// ============================================================
// SERVICE TERMINAL - Simulation de terminal Linux interactif
// ============================================================

export class TerminalService {
    constructor(io) {
        this.io = io;
        this.sessions = new Map(); // sessionId -> session state
        this.metricsIntervals = new Map(); // sessionId -> interval
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log(`🖥️  Terminal client connected: ${socket.id}`);

            // Rejoindre une session terminal
            socket.on('terminal-join', ({ serverId, userId }) => {
                const sessionId = `server-${serverId}`;
                socket.join(sessionId);

                // Initialiser la session si elle n'existe pas
                if (!this.sessions.has(sessionId)) {
                    this.sessions.set(sessionId, {
                        serverId,
                        currentDir: '/home/cloud-nexus',
                        uptime: Date.now(),
                        users: new Set(),
                        commandHistory: []
                    });
                }

                const session = this.sessions.get(sessionId);
                session.users.add(userId);

                // Envoyer le message de bienvenue
                socket.emit('terminal-output', {
                    lines: [
                        { type: 'success', text: `Last login: ${new Date().toLocaleString()} on ttys001` },
                        { type: 'info', text: 'CloudNexus OS v4.2.0-stable (Build 20231024)' },
                        { type: 'info', text: `Welcome to server ${serverId}` }
                    ]
                });

                // Démarrer le streaming de métriques
                this.startMetricsStreaming(sessionId, socket);

                console.log(`✅ User ${userId} joined terminal session ${sessionId}`);
            });

            // Exécuter une commande
            socket.on('terminal-command', ({ serverId, command }) => {
                const sessionId = `server-${serverId}`;
                const session = this.sessions.get(sessionId);

                if (!session) {
                    socket.emit('terminal-output', {
                        lines: [{ type: 'error', text: 'Session not found' }]
                    });
                    return;
                }

                // Ajouter à l'historique
                session.commandHistory.push({
                    command,
                    timestamp: Date.now()
                });

                // Exécuter la commande
                const output = this.executeCommand(command, session);

                // Envoyer la sortie à tous les clients de la session
                this.io.to(sessionId).emit('terminal-output', {
                    lines: [
                        { type: 'command', text: command },
                        ...output
                    ]
                });
            });

            // Quitter la session terminal
            socket.on('terminal-leave', ({ serverId, userId }) => {
                const sessionId = `server-${serverId}`;
                const session = this.sessions.get(sessionId);

                if (session) {
                    session.users.delete(userId);

                    // Nettoyer si plus d'utilisateurs
                    if (session.users.size === 0) {
                        this.stopMetricsStreaming(sessionId);
                        this.sessions.delete(sessionId);
                        console.log(`🧹 Cleaned up terminal session ${sessionId}`);
                    }
                }

                socket.leave(sessionId);
            });

            // Déconnexion
            socket.on('disconnect', () => {
                console.log(`🖥️  Terminal client disconnected: ${socket.id}`);
                // Nettoyer les sessions orphelines
                this.cleanupOrphanedSessions();
            });
        });
    }

    // Exécuter une commande simulée
    executeCommand(command, session) {
        const cmd = command.trim().toLowerCase();

        // Commandes de navigation
        if (cmd === 'pwd') {
            return [{ type: 'output', text: session.currentDir }];
        }

        if (cmd === 'ls' || cmd === 'ls -la') {
            return [
                { type: 'output', text: 'total 48' },
                { type: 'output', text: 'drwxr-xr-x  8 root root 4096 Oct 25 10:30 .' },
                { type: 'output', text: 'drwxr-xr-x 24 root root 4096 Oct 24 09:15 ..' },
                { type: 'output', text: 'drwxr-xr-x  2 root root 4096 Oct 25 08:22 Documents' },
                { type: 'output', text: 'drwxr-xr-x  3 root root 4096 Oct 24 14:30 Downloads' },
                { type: 'output', text: '-rw-r--r--  1 root root 2048 Oct 25 10:15 nginx.conf' },
                { type: 'output', text: '-rw-r--r--  1 root root 8192 Oct 25 10:30 server.log' }
            ];
        }

        if (cmd.startsWith('cd ')) {
            const dir = cmd.substring(3).trim();
            session.currentDir = dir.startsWith('/') ? dir : `${session.currentDir}/${dir}`;
            return [{ type: 'success', text: '' }];
        }

        // Commandes système
        if (cmd === 'uptime') {
            const uptimeMs = Date.now() - session.uptime;
            const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));

            return [{
                type: 'output',
                text: `up ${days} days, ${hours}:${minutes}, 1 user, load average: 0.45, 0.38, 0.32`
            }];
        }

        if (cmd === 'free -h' || cmd === 'free') {
            return [
                { type: 'output', text: '              total        used        free      shared  buff/cache   available' },
                { type: 'output', text: 'Mem:           8.0G        2.4G        3.2G        128M        2.4G        5.3G' },
                { type: 'output', text: 'Swap:          2.0G        0.0G        2.0G' }
            ];
        }

        if (cmd === 'df -h' || cmd === 'df') {
            return [
                { type: 'output', text: 'Filesystem      Size  Used Avail Use% Mounted on' },
                { type: 'output', text: '/dev/sda1        50G   28G   20G  59% /' },
                { type: 'output', text: '/dev/sda2       100G   45G   50G  48% /data' },
                { type: 'output', text: 'tmpfs           4.0G  128M  3.9G   4% /tmp' }
            ];
        }

        if (cmd === 'top' || cmd === 'htop') {
            return [
                { type: 'output', text: 'top - 10:30:45 up 14 days,  5:22,  1 user,  load average: 0.45, 0.38, 0.32' },
                { type: 'output', text: 'Tasks: 142 total,   2 running, 140 sleeping,   0 stopped,   0 zombie' },
                { type: 'output', text: '%Cpu(s): 45.2 us,  8.1 sy,  0.0 ni, 45.7 id,  0.5 wa,  0.0 hi,  0.5 si,  0.0 st' },
                { type: 'output', text: 'MiB Mem :   8192.0 total,   3276.8 free,   2457.6 used,   2457.6 buff/cache' },
                { type: 'output', text: '' },
                { type: 'output', text: '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND' },
                { type: 'output', text: ' 1422 root      20   0  125640  12544   8192 S  12.5   0.2   45:32.18 nginx' },
                { type: 'output', text: ' 2341 www-data  20   0  256780  45632  12288 S   8.3   0.6   23:15.42 node' },
                { type: 'output', text: ' 3456 postgres  20   0  512340  98304  24576 S   5.2   1.2   67:45.33 postgres' }
            ];
        }

        // Commandes systemctl
        if (cmd.startsWith('systemctl status')) {
            const service = cmd.split(' ')[2] || 'nginx';
            return [
                { type: 'output-rich', text: `● ${service}.service - ${this.getServiceDescription(service)}` },
                { type: 'output', text: `   Loaded: loaded (/lib/systemd/system/${service}.service; enabled)` },
                { type: 'output-rich', text: '   Active: active (running) since Mon 2023-10-23 05:08:22 UTC; 14 days ago' },
                { type: 'output', text: `   Main PID: ${Math.floor(Math.random() * 9000) + 1000} (${service})` },
                { type: 'output', text: '   Memory: 45.2M' },
                { type: 'output', text: '   CGroup: /system.slice/' + service + '.service' }
            ];
        }

        if (cmd.startsWith('systemctl restart')) {
            const service = cmd.split(' ')[2] || 'nginx';
            return [
                { type: 'success', text: `✓ Restarting ${service}.service...` },
                { type: 'success', text: `✓ ${service}.service restarted successfully` }
            ];
        }

        // Commandes réseau
        if (cmd === 'netstat -tuln' || cmd === 'ss -tuln') {
            return [
                { type: 'output', text: 'Active Internet connections (only servers)' },
                { type: 'output', text: 'Proto Recv-Q Send-Q Local Address           Foreign Address         State' },
                { type: 'output', text: 'tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN' },
                { type: 'output', text: 'tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN' },
                { type: 'output', text: 'tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN' },
                { type: 'output', text: 'tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN' },
                { type: 'output', text: 'tcp        0      0 127.0.0.1:6379          0.0.0.0:*               LISTEN' }
            ];
        }

        // Commandes diverses
        if (cmd === 'whoami') {
            return [{ type: 'output', text: 'root' }];
        }

        if (cmd === 'hostname') {
            return [{ type: 'output', text: `cloud-nexus-${session.serverId}` }];
        }

        if (cmd === 'date') {
            return [{ type: 'output', text: new Date().toString() }];
        }

        if (cmd === 'clear' || cmd === 'cls') {
            return [{ type: 'clear', text: '' }];
        }

        if (cmd === 'help' || cmd === '--help') {
            return [
                { type: 'info', text: 'Available commands:' },
                { type: 'output', text: '  ls, pwd, cd          - File navigation' },
                { type: 'output', text: '  uptime, free, df     - System info' },
                { type: 'output', text: '  top, htop            - Process monitoring' },
                { type: 'output', text: '  systemctl status     - Service status' },
                { type: 'output', text: '  netstat, ss          - Network connections' },
                { type: 'output', text: '  whoami, hostname     - User/host info' },
                { type: 'output', text: '  clear                - Clear screen' }
            ];
        }

        // Commande inconnue
        return [{
            type: 'error',
            text: `bash: ${command}: command not found`
        }];
    }

    // Descriptions des services
    getServiceDescription(service) {
        const descriptions = {
            nginx: 'A high performance web server and reverse proxy',
            apache2: 'The Apache HTTP Server',
            mysql: 'MySQL Community Server',
            postgresql: 'PostgreSQL RDBMS',
            redis: 'Advanced key-value store',
            docker: 'Application Container Engine',
            ssh: 'OpenBSD Secure Shell server',
            node: 'Node.js application server'
        };
        return descriptions[service] || 'System service';
    }

    // Démarrer le streaming de métriques
    startMetricsStreaming(sessionId, socket) {
        // Éviter les doublons
        if (this.metricsIntervals.has(sessionId)) {
            return;
        }

        // Métriques initiales
        const metrics = this.generateMetrics();
        socket.emit('metrics-update', metrics);

        // Streaming toutes les 2 secondes
        const interval = setInterval(() => {
            const newMetrics = this.generateMetrics();
            this.io.to(sessionId).emit('metrics-update', newMetrics);
        }, 2000);

        this.metricsIntervals.set(sessionId, interval);
        console.log(`📊 Started metrics streaming for ${sessionId}`);
    }

    // Arrêter le streaming de métriques
    stopMetricsStreaming(sessionId) {
        const interval = this.metricsIntervals.get(sessionId);
        if (interval) {
            clearInterval(interval);
            this.metricsIntervals.delete(sessionId);
            console.log(`📊 Stopped metrics streaming for ${sessionId}`);
        }
    }

    // Générer des métriques réalistes
    generateMetrics() {
        return {
            cpu: Math.random() * 30 + 35, // 35-65%
            ram: {
                used: Math.random() * 2 + 2, // 2-4 GB
                total: 8,
                percentage: Math.random() * 25 + 25 // 25-50%
            },
            network: {
                download: Math.random() * 150 + 200, // 200-350 Mbps
                upload: Math.random() * 50 + 30      // 30-80 Mbps
            },
            disk: {
                used: 28,
                total: 50,
                percentage: 56
            },
            processes: Math.floor(Math.random() * 20) + 130, // 130-150
            timestamp: Date.now()
        };
    }

    // Nettoyer les sessions orphelines
    cleanupOrphanedSessions() {
        for (const [sessionId, session] of this.sessions.entries()) {
            if (session.users.size === 0) {
                this.stopMetricsStreaming(sessionId);
                this.sessions.delete(sessionId);
                console.log(`🧹 Cleaned up orphaned session ${sessionId}`);
            }
        }
    }

    // Obtenir les utilisateurs actifs d'une session
    getActiveUsers(sessionId) {
        const session = this.sessions.get(sessionId);
        return session ? Array.from(session.users) : [];
    }

    // Obtenir l'historique des commandes
    getCommandHistory(sessionId) {
        const session = this.sessions.get(sessionId);
        return session ? session.commandHistory : [];
    }
}
