import { ReactNode } from "react";
import { useVendorPermissions } from "@/hooks/useVendorPermissions";
import { VendorPermissions } from "@/types/permissions";

export default function PermissionGuard({
    check,
    children,
}: {
    check: (p: VendorPermissions) => boolean;
    children: ReactNode;
}) {
    const permissions = useVendorPermissions();

    if (!check(permissions)) {
        return null; // Ou afficher un message "Permission refusée"
    }

    return <>{children}</>;
}
