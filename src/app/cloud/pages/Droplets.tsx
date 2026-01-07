import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCloud } from '@/contexts/CloudContext';
import { DropletCard } from '../components/DropletCard';
import { Droplet } from '@/types/cloud';

const Droplets: React.FC = () => {
    const { droplets, createDroplet, deleteDroplet } = useCloud();
    const [showCreate, setShowCreate] = useState(false);
    const [formData, setFormData] = useState<Partial<Droplet>>({
        name: '',
        region: 'fra1',
        size: '2GB RAM',
        cost: 12
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Droplets</h2>
                    <p className="text-gray-400">Manage your virtual servers</p>
                </div>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Droplet
                </button>
            </div>

            {showCreate && (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-white text-xl font-semibold mb-4">Create New Droplet</h3>
                    <div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-gray-400 text-sm mb-2 block">Droplet Name</label>
                                <input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="my-droplet"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-2 block">Region</label>
                                <select
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="fra1">Frankfurt</option>
                                    <option value="nyc3">New York</option>
                                    <option value="lon1">London</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-2 block">Size</label>
                                <select
                                    value={formData.size}
                                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="2GB RAM">2GB RAM - $12/mo</option>
                                    <option value="4GB RAM">4GB RAM - $24/mo</option>
                                    <option value="8GB RAM">8GB RAM - $48/mo</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-2 block">Monthly Cost</label>
                                <input
                                    type="number"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    createDroplet(formData);
                                    setShowCreate(false);
                                    setFormData({ name: '', region: 'fra1', size: '2GB RAM', cost: 12 });
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => setShowCreate(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {droplets.map(droplet => (
                    <DropletCard key={droplet.id} droplet={droplet} onDelete={deleteDroplet} />
                ))}
            </div>
        </div>
    );
};

export default Droplets;
