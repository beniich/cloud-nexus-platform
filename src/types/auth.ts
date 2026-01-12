export type UserRole = 'client' | 'seller' | 'admin' | 'owner' | 'manager' | 'user';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password?: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}
