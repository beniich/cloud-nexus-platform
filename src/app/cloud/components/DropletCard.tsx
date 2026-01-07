import React from 'react';
import { Droplet } from '@/types/cloud';
import { StatusBadge } from './StatusBadge';

interface DropletCardProps {
    droplet: Droplet;
    onDelete: (id: string) => void;
}

export const DropletCard: React.FC<DropletCardProps> = ({ droplet, onDelete }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 transition-all">
        <div className="flex items-start justify-between mb-4">
            <div>
                <h3 className="text-white font-semibold text-lg">{droplet.name}</h3>
                <p className="text-gray-400 text-sm">{droplet.ip}</p>
            </div>
            <StatusBadge status={droplet.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <p className="text-gray-400 text-xs mb-1">CPU Usage</p>
                <div className="bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${droplet.cpu}%` }}
                    />
                </div>
                <p className="text-white text-sm mt-1">{droplet.cpu}%</p>
            </div>
            <div>
                <p className="text-gray-400 text-xs mb-1">RAM Usage</p>
                <div className="bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${droplet.ram}%` }}
                    />
                </div>
                <p className="text-white text-sm mt-1">{droplet.ram}%</p>
            </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div>
                <p className="text-gray-400 text-xs">Region • Size</p>
                <p className="text-white text-sm">{droplet.region} • {droplet.size}</p>
            </div>
            <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                    Manage
                </button>
                <button
                    onClick={() => onDelete(droplet.id)}
                    className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-sm transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
);
