import { CommissionResult } from "@/types/commission";

export default function CommissionTable({ data }: { data: CommissionResult[] }) {
    // Mock data conversion if incoming data doesn't match CommissionResult exactly, or assuming 'any' was mapped
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-3 rounded-tl-lg">Commande</th>
                        <th className="px-6 py-3">Total</th>
                        <th className="px-6 py-3">Commission</th>
                        <th className="px-6 py-3 rounded-tr-lg">Gain vendeur</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {data.map((c) => (
                        <tr key={c.orderId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{c.orderId}</td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{c.gross} €</td>
                            <td className="px-6 py-4 font-semibold text-red-500">-{c.commission} €</td>
                            <td className="px-6 py-4 font-semibold text-green-600">{c.vendorEarning} €</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
