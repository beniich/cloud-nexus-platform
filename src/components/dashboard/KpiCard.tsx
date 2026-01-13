export default function KpiCard({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
        </div>
    );
}
