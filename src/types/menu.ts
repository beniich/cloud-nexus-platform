export type UserRole = 'client' | 'seller' | 'admin' | 'owner';

export interface MenuItem {
    id: string;
    label: string;
    icon: string;              // Nom de l'icône Lucide (ex: 'Users')
    path: string;              // Chemin de la route
    section?: string;          // ID de la section pour la navigation interne (compatibilité Dashboard existant)
    roles: UserRole[];         // Rôles autorisés
    type: 'internal' | 'external';  // Navigation interne ou lien externe
    color?: string;            // Classe Tailwind pour la couleur
    badge?: string | number;   // Badge de notification
    featureFlag?: string;      // Feature flag optionnel
    children?: MenuItem[];     // Sous-menu (futur)
}

export interface MenuConfig {
    version: string;
    lastUpdated: string;
    menus: Record<UserRole, MenuItem[]>;
}
