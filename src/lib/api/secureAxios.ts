import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Interface étendue pour inclure les headers customs potentiels
interface SecureRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

class SecureAPIClient {
    private instance: AxiosInstance;
    private requestQueue: Set<string> = new Set();

    // URL de base peut venir de l'env
    private baseURL = 'http://localhost:4000/api'; // Fallback dev

    constructor() {
        this.instance = axios.create({
            baseURL: this.baseURL,
            timeout: 30000,
            withCredentials: true, // Important pour les cookies
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request Interceptor
        this.instance.interceptors.request.use(
            (config) => {
                const secureConfig = config as SecureRequestConfig;

                // 1. Ajouter CSRF token pour les requêtes mutatives
                if (['post', 'put', 'patch', 'delete'].includes(secureConfig.method?.toLowerCase() || '')) {
                    secureConfig.headers['X-CSRF-Token'] = this.getCsrfToken();
                }

                // 2. Ajouter Request ID unique
                secureConfig.headers['X-Request-ID'] = crypto.randomUUID();

                // 3. Prévenir les requêtes dupliquées (sauf si explicitement autorisé, TODO: ajouter option)
                const requestKey = `${secureConfig.method}-${secureConfig.url}`;
                if (this.requestQueue.has(requestKey)) {
                    // Note: En dev react strict mode, ça peut trigger des faux positifs, on log juste pour l'instant
                    console.warn('Duplicate request detected:', requestKey);
                    // return Promise.reject(new Error('Requête déjà en cours')); 
                }
                this.requestQueue.add(requestKey);

                return secureConfig;
            },
            (error) => Promise.reject(error)
        );

        // Response Interceptor
        this.instance.interceptors.response.use(
            (response) => {
                // Retirer de la queue
                const requestKey = `${response.config.method}-${response.config.url}`;
                this.requestQueue.delete(requestKey);

                return response;
            },
            async (error: AxiosError) => {
                const secureConfig = error.config as SecureRequestConfig;

                // Retirer de la queue
                if (secureConfig) {
                    const requestKey = `${secureConfig.method}-${secureConfig.url}`;
                    this.requestQueue.delete(requestKey);
                }

                // Gestion des erreurs d'authentification (401)
                if (error.response?.status === 401 && !secureConfig._retry) {
                    secureConfig._retry = true;
                    try {
                        await this.refreshToken();
                        // Retry la requête originale
                        return this.instance.request(secureConfig);
                    } catch {
                        // Refresh échoué, on laisse l'erreur remonter pour que l'UI gère la déconnexion
                        return Promise.reject(error);
                    }
                }

                // 403 - Permission insuffisante
                if (error.response?.status === 403) {
                    this.logSecurityEvent('permission_denied', {
                        url: secureConfig?.url,
                        method: secureConfig?.method,
                    });
                }

                // 429 - Rate limit
                if (error.response?.status === 429) {
                    const retryAfter = error.response.headers['retry-after'];
                    // On ne throw pas ici pour laisser le client gérer, mais on pourrait
                    console.error(`Trop de requêtes. Réessayez dans ${retryAfter}s`);
                }

                return Promise.reject(error);
            }
        );
    }

    private getCsrfToken(): string {
        // Dans une SPA, on peut le lire depuis une balise meta injectée par le serveur au chargement
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta?.getAttribute('content') || localStorage.getItem('csrf-token') || '';
    }

    private async refreshToken(): Promise<void> {
        // Appel endpoint refresh qui doit set un nouveau cookie HttpOnly
        await this.instance.post('/auth/refresh');
    }

    private logSecurityEvent(type: string, details: any): void {
        // Eviter boucle infinie si le logging échoue
        // Utiliser fetch natif pour le logging pour sortir du cycle axios
        fetch(`${this.baseURL}/security/log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, timestamp: new Date(), ...details })
        }).catch(() => { });
    }

    // Méthodes publiques
    get<T = any>(url: string, config?: any) {
        return this.instance.get<T>(url, config);
    }

    post<T = any>(url: string, data?: any, config?: any) {
        return this.instance.post<T>(url, data, config);
    }

    put<T = any>(url: string, data?: any, config?: any) {
        return this.instance.put<T>(url, data, config);
    }

    delete<T = any>(url: string, config?: any) {
        return this.instance.delete<T>(url, config);
    }
}

export const api = new SecureAPIClient();
