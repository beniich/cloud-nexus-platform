import { useEffect, useState } from "react";
import { VendorAPI } from "@/services/vendorApi";
import KpiCard from "@/components/dashboard/KpiCard";
import OrdersTable from "@/components/dashboard/OrdersTable";
import RoleGuard from "@/components/RoleGuard";
import { VendorStats, VendorOrder } from "@/types/vendor";

export default function VendorDashboard() {
    const token = localStorage.getItem("mockToken") || "mock-token"; // Using mockToken for demo
    const [stats, setStats] = useState<VendorStats | null>(null);
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            VendorAPI.stats(token),
            VendorAPI.orders(token)
        ]).then(([statsData, ordersData]) => {
            setStats(statsData);
            setOrders(ordersData);
            setLoading(false);
        });
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <RoleGuard allow={["vendor", "admin"]}> {/* Allow admin to view for debug */}
            <div className="p-6 space-y-6 animate-fade-in max-w-7xl mx-auto">

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Vendeur</h1>
                    <div className="text-sm text-gray-500">Dernière mise à jour: Aujourd'hui</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard label="Ventes totales" value={`${stats.totalSales} €`} />
                    <KpiCard label="Commandes" value={stats.totalOrders} />
                    <KpiCard label="Produits" value={stats.totalProducts} />
                    <KpiCard label="Solde" value={`${stats.balance} €`} />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Commandes récentes</h2>
                        <button className="text-primary hover:underline text-sm font-medium">Voir tout</button>
                    </div>
                    <OrdersTable orders={orders} />
                </div>

            </div>
        </RoleGuard>
    );
}
