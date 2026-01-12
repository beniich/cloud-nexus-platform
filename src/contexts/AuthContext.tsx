import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';
import { toast } from 'sonner';
import { apiClient } from '../lib/api/client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verify session with server on mount
        const verifySession = async () => {
            try {
                const { data } = await apiClient.get<{ user: User }>('/auth/me');
                if (data.user) {
                    setUser(data.user);
                }
            } catch (error) {
                // If verification fails, clear local user
                console.log('Session verification failed, logging out');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, []);

    const login = async (email: string, password?: string) => {
        setIsLoading(true);
        try {
            // Note: In types/auth.ts, login signature might need adjustment or casting
            const { data } = await apiClient.post<{ user: User, token: string }>('/auth/login', {
                email,
                password: password || 'password123'
            });

            if (data.user) {
                setUser(data.user);
                // Save token for non-cookie support if backend returns it
                if (data.token) localStorage.setItem('token', data.token);
                toast.success(`Bienvenue, ${data.user.name} !`);
            }
        } catch (error: any) {
            toast.error(error.message || 'Échec de la connexion');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout', {});
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('token');
            toast.info('Déconnexion réussie');
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
