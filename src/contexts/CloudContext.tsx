import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useDroplets } from '@/hooks/useDroplets';
import { useDomains } from '@/hooks/useDomains';
import { Droplet, Domain } from '@/types/cloud';

interface CloudContextType {
    droplets: Droplet[];
    createDroplet: (data: Partial<Droplet>) => void;
    deleteDroplet: (id: string) => void;
    domains: Domain[];
}

const CloudContext = createContext<CloudContextType | undefined>(undefined);

export const CloudProvider = ({ children }: { children: ReactNode }) => {
    const { droplets, createDroplet, deleteDroplet } = useDroplets();
    const { domains } = useDomains();

    return (
        <CloudContext.Provider value={{ droplets, createDroplet, deleteDroplet, domains }}>
            {children}
        </CloudContext.Provider>
    );
};

export const useCloud = () => {
    const context = useContext(CloudContext);
    if (context === undefined) {
        throw new Error('useCloud must be used within a CloudProvider');
    }
    return context;
};
