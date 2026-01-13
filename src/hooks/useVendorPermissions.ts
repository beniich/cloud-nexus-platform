import { VendorPermissions } from "@/types/permissions";

const defaultPermissions: VendorPermissions = {
    products: { create: true, edit: true, delete: false },
    orders: { view: true, refund: false },
    earnings: { view: true, withdraw: false },
    settings: { editStore: true },
};

export function useVendorPermissions() {
    const raw = localStorage.getItem("vendor_permissions");
    const permissions: VendorPermissions = raw
        ? JSON.parse(raw)
        : defaultPermissions;

    return permissions;
}
