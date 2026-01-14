export type UserRole = 'client' | 'vendor' | 'admin' | 'owner' | 'manager' | 'user' | 'seller';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    teamId?: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password?: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}
