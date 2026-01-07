import React from 'react';
import { Plus } from 'lucide-react';
import { useCloud } from '@/contexts/CloudContext';
import { StatusBadge } from '../components/StatusBadge';

const Domains: React.FC = () => {
    const { domains } = useCloud();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Domains</h2>
                    <p className="text-gray-400">Manage your DNS records</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                    <Plus className="w-5 h-5" />
                    Add Domain
                </button>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Domain</th>
                            <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Records</th>
                            <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Status</th>
                            <th className="px-6 py-4 text-right text-gray-400 text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {domains.map(domain => (
                            <tr key={domain.id} className="border-t border-gray-700 hover:bg-gray-750">
                                <td className="px-6 py-4 text-white font-medium">{domain.name}</td>
                                <td className="px-6 py-4 text-gray-400">{domain.records} records</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={domain.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                                        Manage DNS
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Domains;
