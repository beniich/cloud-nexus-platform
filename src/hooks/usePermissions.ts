import { UserRole } from "@/types/auth";

export function usePermissions(role?: UserRole) {
    return {
        isAdmin: role === "admin",
        isVendor: role === "vendor",

        canManageUsers: role === "admin",
        canManageMarketplace: role === "admin",
        canManageOwnStore: role === "vendor",
        canViewRevenue: role === "vendor" || role === "admin",
    };
}
