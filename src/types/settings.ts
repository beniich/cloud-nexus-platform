export type UserRole = "admin" | "vendor";

export type TabId =
    | "store"
    | "appearance"
    | "security"
    | "notifications"
    | "payments";

export interface SettingsState {
    storeName: string;
    storeDescription: string;
    theme: "light" | "dark" | "system";
    twoFactorAuth: boolean;
    emailNotifications: boolean;
}
