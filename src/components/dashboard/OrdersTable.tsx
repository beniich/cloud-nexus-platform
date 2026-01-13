import { VendorOrder } from "@/types/vendor";

export default function OrdersTable({ orders }: { orders: VendorOrder[] }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-3 rounded-tl-lg">ID</th>
                        <th className="px-6 py-3">Client</th>
                        <th className="px-6 py-3">Total</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 rounded-tr-lg">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{o.id}</td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{o.customer}</td>
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{o.total} €</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(o.status)}`}>
                                    {o.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{o.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
