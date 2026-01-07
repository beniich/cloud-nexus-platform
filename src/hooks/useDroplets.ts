import { useState } from 'react';
import { Droplet } from '@/types/cloud';

export const useDroplets = () => {
    const [droplets, setDroplets] = useState<Droplet[]>([
        {
            id: '1',
            name: 'prod-web-01',
            status: 'running',
            region: 'fra1',
            size: '2GB RAM',
            ip: '178.128.45.67',
            cpu: 45,
            ram: 68,
            cost: 12
        },
        {
            id: '2',
            name: 'staging-api',
            status: 'running',
            region: 'nyc3',
            size: '4GB RAM',
            ip: '159.203.112.89',
            cpu: 23,
            ram: 41,
            cost: 24
        },
        {
            id: '3',
            name: 'dev-database',
            status: 'stopped',
            region: 'lon1',
            size: '8GB RAM',
            ip: '165.227.98.123',
            cpu: 0,
            ram: 0,
            cost: 48
        }
    ]);

    const createDroplet = (data: Partial<Droplet>) => {
        const newDroplet: Droplet = {
            id: Date.now().toString(),
            name: data.name || 'new-droplet',
            status: 'starting',
            region: data.region || 'fra1',
            size: data.size || '2GB RAM',
            ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            cpu: 0,
            ram: 0,
            cost: data.cost || 12
        };
        setDroplets(prev => [...prev, newDroplet]);
    };

    const deleteDroplet = (id: string) => {
        setDroplets(prev => prev.filter(d => d.id !== id));
    };

    return { droplets, createDroplet, deleteDroplet };
};
