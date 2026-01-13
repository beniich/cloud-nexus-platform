import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { User, AuthContextType } from '../types/auth';
import { toast } from 'sonner';
// import { apiClient } from '../lib/api/client'; // Commenté pour mode MOCK

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// MODE MOCK - Utilisateurs de démonstration (sans backend)
const MOCK_USERS = [
    {
        id: 'user-1',
        email: 'admin@hustel.com',
        name: 'Administrateur Cloud Nexus',
        role: 'admin' as const,
        avatar: '',
        teamId: 'team-1'
    },
    {
        id: 'user-2',
        email: 'vendor@hustel.com',
        name: 'Vendeur Cloud Nexus',
        role: 'vendor' as const,
        avatar: '',
        teamId: 'team-1'
    },
    {
        id: 'user-3',
        email: 'client@hustel.com',
        name: 'Client Cloud Nexus',
        role: 'client' as const,
        avatar: '',
        teamId: 'team-2'
    }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { t } = useTranslation();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simuler vérification de session locale (MODE MOCK)
        const verifySession = async () => {
            try {
                // Vérifier si un user est stocké dans localStorage
                const storedUser = localStorage.getItem('mockUser');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.log('Session verification failed, logging out');
                setUser(null);
                localStorage.removeItem('mockUser');
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, []);

    const login = async (email: string, password?: string) => {
        setIsLoading(true);
        try {
            // Simuler délai réseau
            await new Promise(resolve => setTimeout(resolve, 800));

            // MODE MOCK - Trouver l'utilisateur dans les mocks
            const mockUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!mockUser) {
                throw new Error('errors.AUTH_USER_NOT_FOUND');
            }

            // Simuler validation du mot de passe (accepte n'importe quel mot de passe en mode MOCK)
            if (!password || password.length === 0) {
                throw new Error('errors.AUTH_PASSWORD_REQUIRED');
            }

            // Authentification réussie
            setUser(mockUser);
            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            localStorage.setItem('mockToken', 'mock-jwt-token-' + Date.now());

            toast.success(t('dashboard.welcome', { name: mockUser.name }), {
                description: 'Authentification en mode MOCK (sans backend)'
            });
        } catch (error: any) {
            const message = error.message?.startsWith('errors.')
                ? t(error.message)
                : t('errors.AUTH_LOGIN_FAILED');
            toast.error(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            // MODE MOCK - Pas besoin d'appel API
            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('mockUser');
            localStorage.removeItem('mockToken');
            toast.info(t('auth.logout')); // Assuming auth.logout exists or common.logout
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
