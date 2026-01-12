import React from 'react';

export default function LivePulseDashboard() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Pulse Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Clients Actifs</h3>
                    <p className="text-3xl font-bold text-blue-600">145</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Leads en Cours</h3>
                    <p className="text-3xl font-bold text-green-600">67</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Conversion Rate</h3>
                    <p className="text-3xl font-bold text-purple-600">32%</p>
                </div>
            </div>
        </div>
    );
}
