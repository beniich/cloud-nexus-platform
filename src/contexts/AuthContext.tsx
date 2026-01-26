import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { User, AuthContextType } from '../types/auth'; // Ensure types compatibility
import { toast } from 'sonner';
import { secureAuth } from '../lib/auth/secureAuth';
import { permissionService, Permission } from '@/lib/permissions/permissionSystem';

// Interface étendue pour inclure la méthode hasPermission strictement typée
interface SecureAuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password?: string) => Promise<void>;
    register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    logout: () => Promise<void>;
    hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<SecureAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { t } = useTranslation();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Dans une vraie implémentation, on vérifierait le cookie HttpOnly via l'API
            // Ici, on vérifie si secureAuth a un token en mémoire ou on tente un refresh
            // const refreshed = await secureAuth.refreshToken();

            // MOCK TEMPORAIRE POUR DEV: On simule une restauration de session si mock activé
            if (import.meta.env.VITE_ENABLE_MOCK === 'true') {
                // Nothing to do for now, user must login on refresh for high security (as requested)
            }
        } catch (error) {
            console.error('Session restoration failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password?: string) => {
        setIsLoading(true);
        try {
            // 1. Authentification sécurisée
            if (import.meta.env.VITE_ENABLE_MOCK !== 'true') {
                await secureAuth.login(email, password || '');
            } else {
                console.info('MOCK MODE: Skipping secureAuth.login');
                await new Promise(r => setTimeout(r, 500)); // Simulate latency
            }

            // 2. Mise à jour de l'utilisateur
            // Note: secureAuth.login retourne void ou un token dans l'implémentation actuelle,
            // on suppose ici qu'on récupère l'user soit de la réponse, soit d'un /me
            // Pour le moment, on mappe manuellement comme avant pour ne pas casser le mock

            // TODO: Remplacer par const userData = await apiClient.get('/auth/me');
            const mockUser: User = {
                id: '1',
                email,
                name: email.split('@')[0],
                role: 'owner', // Default to owner for dev/test permissions
                avatar: undefined,
                teamId: 'team-1'
            };
            setUser(mockUser);

            // 3. Chargement des permissions
            await permissionService.loadUserPermissions();

            toast.success(t('auth.loginSuccess', 'Connexion réussie'));
        } catch (error: any) {
            console.error('Login error:', error);
            // SecureAuth gère déjà les erreurs spécifiques (rate limit, strength)
            toast.error(error.message || t('auth.loginError', 'Echec de connexion'));
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string, firstName: string, lastName: string) => {
        setIsLoading(true);
        try {
            if (import.meta.env.VITE_ENABLE_MOCK !== 'true') {
                await secureAuth.register(email, password, firstName, lastName);
                // Auto-login after register
                await secureAuth.login(email, password);
            } else {
                console.info('MOCK MODE: Skipping secureAuth.register');
                await new Promise(r => setTimeout(r, 500));
            }

            const mockUser: User = {
                id: Math.random().toString(36).substring(2, 9),
                email,
                name: `${firstName} ${lastName}`,
                role: 'owner',
                teamId: 'team-1'
            };
            setUser(mockUser);
            await permissionService.loadUserPermissions();

            toast.success(t('auth.registerSuccess', 'Inscription réussie'));
        } catch (error: any) {
            console.error('Register error:', error);
            toast.error(error.message || t('auth.registerError', "Echec de l'inscription"));
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await secureAuth.logout();
            setUser(null);
            toast.info(t('auth.logoutSuccess', 'Déconnecté'));
        } catch (error) {
            console.error('Logout error', error);
        }
    };

    const hasPermission = (permission: Permission): boolean => {
        if (!user) return false;
        // On délègue totalement au service de permissions
        return permissionService.hasPermission(permission);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout,
            hasPermission
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
