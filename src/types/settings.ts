export type UserRole = "admin" | "vendor";

export type TabId =
    | "store"
    | "appearance"
    | "security"
    | "notifications"
    | "payments"
    | "admin";

export interface SettingsState {
    storeName: string;
    storeDescription: string;
    theme: "light" | "dark" | "system";
    twoFactorAuth: boolean;
    emailNotifications: boolean;
}

export interface Settings extends SettingsState {
    // Merge pour compatibilité
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}
