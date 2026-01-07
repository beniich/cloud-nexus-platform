import { useState } from 'react';
import { Domain } from '@/types/cloud';

export const useDomains = () => {
    const [domains] = useState<Domain[]>([
        { id: '1', name: 'myapp.com', records: 8, status: 'active' },
        { id: '2', name: 'staging.myapp.com', records: 4, status: 'active' },
        { id: '3', name: 'newdomain.io', records: 2, status: 'pending' }
    ]);

    return { domains };
};
