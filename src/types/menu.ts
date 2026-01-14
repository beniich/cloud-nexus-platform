export type UserRole = 'client' | 'seller' | 'admin' | 'owner';

export interface MenuItem {
    id: string;
    label: string;
    icon: string;              // Name of the Lucide icon
    path: string;              // Route path
    roles: UserRole[];         // Allowed roles
    type: 'internal' | 'external';  // Internal nav or external link
    color?: string;            // Tailwind color class
    badge?: string | number;   // Notification badge
    featureFlag?: string;      // Optional feature flag
    children?: MenuItem[];     // Optional sub-menu
}

export interface MenuConfig {
    version: string;
    lastUpdated: string;
    menus: Record<UserRole, MenuItem[]>;
}
