import { useState } from "react";
// import { VendorPermissions } from "@/types/permissions";

// Using 'any' for vendor for now as requested to minimize complexity, 
// normally this would be fully typed
export default function VendorPermissionsAdmin({ vendor = { permissions: { products: { create: true } } } }: any) {
    // Mock initial state if vendor prop is partial
    const [permissions, setPermissions] = useState(vendor.permissions || { products: { create: true } });

    function toggle(path: string) {
        // Simple deep merge or path update simulation
        const updated = { ...permissions };
        const keys = path.split('.');
        if (keys.length === 2) {
            // @ts-ignore
            updated[keys[0]] = { ...updated[keys[0]], [keys[1]]: !updated[keys[0]][keys[1]] };
        }
        setPermissions(updated);

        // In real app: save to backend
        // localStorage.setItem("vendor_permissions", JSON.stringify(updated));
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Permissions du vendeur</h3>

            <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                    <input
                        type="checkbox"
                        checked={permissions.products?.create}
                        onChange={() => toggle("products.create")}
                        className="w-5 h-5 text-primary rounded focus:ring-primary"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Autoriser création produit</span>
                </label>

                {/* Example of other permissions */}
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                    <input
                        type="checkbox"
                        disabled
                        checked={false} // Placeholder
                        className="w-5 h-5 text-gray-400 rounded focus:ring-gray-400 bg-gray-100"
                    />
                    <span className="text-gray-400 dark:text-gray-500">Autoriser remboursement (Premium)</span>
                </label>
            </div>
        </div>
    );
}
