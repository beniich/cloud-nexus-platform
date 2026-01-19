import { api } from '../api/secureAxios';

class SecureAuthService {
    private refreshTimer: NodeJS.Timeout | null = null;
    private readonly TOKEN_REFRESH_BUFFER = 60000; // 1 minute avant expiration

    /**
     * Login sécurisé avec rate limiting
     */
    async login(email: string, password: string): Promise<any> {
        // --- BYPASS POUR DEMO LOCALE SANS BACKEND ---
        // Sert à accéder au dashboard quand le npm run dev backend n'est pas lancé
        const DEMO_EMAIL = "admin@cloudnexus.com";
        const DEMO_PASS = "AdminPassword123!"; // Doit satisfaire: 12 chars, Maj, Min, Chiffre, Spécial.

        if (email === DEMO_EMAIL && password === DEMO_PASS) {
            console.warn("🔐 MOCK AUTH BYPASS ACTIVATED");
            // Simuler un délai réseau
            await new Promise(r => setTimeout(r, 800));

            // Stocker une fausse session
            localStorage.setItem('cnp_token', 'mock_token_demo_123');
            localStorage.setItem('cnp_user', JSON.stringify({
                id: 'admin_1',
                email: DEMO_EMAIL,
                name: 'Local Admin',
                role: 'admin',
                permissions: ['*']
            }));

            // Retourner structure user attendue
            return {
                user: {
                    id: 'admin_1',
                    email: DEMO_EMAIL,
                    name: 'Local Admin',
                    role: 'admin',
                },
                token: 'mock_token_demo_123'
            };
        }
        // ---------------------------------------------


        // 1. Validation des entrées (Basique)
        if (!this.isValidEmail(email)) {
            throw new Error('Email invalide');
        }

        // 2. Rate limiting Local
        const attempts = this.getLoginAttempts(email);
        if (attempts >= 5) {
            const lockoutTime = this.getLockoutTime(email);
            if (lockoutTime > Date.now()) {
                const remaining = Math.ceil((lockoutTime - Date.now()) / 60000);
                throw new Error(`Compte verrouillé. Réessayez dans ${remaining} minutes.`);
            }
            this.resetLoginAttempts(email);
        }

        try {
            // Note: Le hashage client est une couche supplémentaire, le serveur doit aussi hasher !
            const hashedPassword = await this.hashPassword(password);

            // 3. Appel API
            const response = await api.post('/auth/login', {
                email,
                password: hashedPassword, // Envoi du hash
            });

            // 4. Reset des tentatives en cas de succès
            this.resetLoginAttempts(email);

            // 5. Gestion Token (Si cookie HttpOnly, rien à faire ici. Si réponse JSON, stockage mémoire)
            // Ici on assume que le serveur renvoie des infos user mais le token est en cookie

            // 6. Démarrer refresh
            this.startTokenRefresh();

            // 7. Log Succès
            // this.logSecurityEvent('login_success', { email });

            return response.data;

        } catch (error: any) {
            // this.logSecurityEvent('login_failure', { email, error: error.message });

            // Incrémenter tentatives
            this.incrementLoginAttempts(email);
            throw error;
        }
    }

    /**
     * Logout sécurisé
     */
    async logout(): Promise<void> {
        try {
            // Tenter logout API mais ne pas bloquer si fail (ex: backend down)
            try { await api.post('/auth/logout'); } catch (e) { }
            localStorage.removeItem('cnp_token');
            localStorage.removeItem('cnp_user');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            this.stopTokenRefresh();
            this.clearLocalData();
            // Redirection handled by caller or router
        }
    }

    /**
     * Démarrer le timer de refresh
     */
    private startTokenRefresh(): void {
        // Récupérer l'expiration depuis un endpoint public ou decoder token si accessible
        // Ici simulation d'appel
        api.get('/auth/token-info')
            .then(response => {
                const data = response.data;
                if (data && data.expiresIn) {
                    const expiresIn = data.expiresIn * 1000; // Convertir en ms
                    const refreshTime = expiresIn - this.TOKEN_REFRESH_BUFFER;

                    if (refreshTime > 0) {
                        this.refreshTimer = setTimeout(() => {
                            this.refreshToken();
                        }, refreshTime);
                    }
                }
            })
            .catch(() => { /* Silent fail or retry */ });
    }

    private async refreshToken(): Promise<void> {
        try {
            await api.post('/auth/refresh');
            // Reprogrammer le prochain refresh
            this.startTokenRefresh();
        } catch (error) {
            // Token expiré, logout forcé sera géré par l'intercepteur Axios ou ici
        }
    }

    private stopTokenRefresh(): void {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    // --- Validation & Crypto ---

    private isValidEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email) && email.length <= 254;
    }

    private async hashPassword(password: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // --- Rate Limiting (Session Storage) ---

    private getLoginAttempts(email: string): number {
        const key = `login_attempts_${email}`;
        const data = sessionStorage.getItem(key);
        return data ? parseInt(data, 10) : 0;
    }

    private incrementLoginAttempts(email: string): void {
        const key = `login_attempts_${email}`;
        const attempts = this.getLoginAttempts(email) + 1;
        sessionStorage.setItem(key, attempts.toString());

        if (attempts >= 5) {
            const lockoutKey = `lockout_${email}`;
            const lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
            sessionStorage.setItem(lockoutKey, lockoutUntil.toString());
        }
    }

    private resetLoginAttempts(email: string): void {
        sessionStorage.removeItem(`login_attempts_${email}`);
        sessionStorage.removeItem(`lockout_${email}`);
    }

    private getLockoutTime(email: string): number {
        const key = `lockout_${email}`;
        const data = sessionStorage.getItem(key);
        return data ? parseInt(data, 10) : 0;
    }

    private clearLocalData(): void {
        sessionStorage.clear();
    }
}

export const secureAuth = new SecureAuthService();
