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
        // Verify session using real token
        const verifySession = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');

                if (storedUser && token) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.log('Session verification failed, logging out');
                setUser(null);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, []);

    const login = async (email: string, password?: string) => {
        setIsLoading(true);
        try {
            // Call real backend API
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
                throw new Error(errorData.error || 'Authentication failed');
            }

            const data = await response.json();

            if (!data.token || !data.user) {
                throw new Error('Invalid response from server');
            }

            // Store authentication data
            const authenticatedUser: User = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: data.user.role as 'admin' | 'owner' | 'seller' | 'client' | 'vendor',
                avatar: data.user.avatar || '',
                teamId: data.user.teamId || ''
            };

            setUser(authenticatedUser);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(authenticatedUser));

            toast.success(t('dashboard.welcome', { name: authenticatedUser.name }) || `Welcome back, ${authenticatedUser.name}!`);
        } catch (error: unknown) {
            console.error('Login error:', error);
            const message = error instanceof Error ? error.message : t('errors.AUTH_LOGIN_FAILED') || 'Login failed';
            toast.error(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            toast.info(t('auth.logout') || 'You have been logged out');
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
