import React from 'react';

export default function SalesPipeline() {
    const stages = [
        { name: 'Prospect', deals: 5 },
        { name: 'Qualification', deals: 3 },
        { name: 'Proposition', deals: 4 },
        { name: 'Négociation', deals: 2 },
        { name: 'Clôture', deals: 1 },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pipeline de Ventes</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {stages.map(stage => (
                    <div key={stage.name} className="bg-white dark:bg-gray-800 rounded-xl p-4 w-48 flex-shrink-0 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{stage.name}</h3>
                        <p className="text-2xl font-bold text-blue-600">{stage.deals}</p>
                        <p className="text-sm text-gray-500">Affaires</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
