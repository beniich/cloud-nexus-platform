import React from 'react';
import { Service } from './servicesData';
import { CheckCircle, Server, Layers, HardDrive, Box, Network, Shield, Database } from 'lucide-react';

interface ServiceCardProps {
    service: Service;
    onDeploy: (service: Service) => void;
}

const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'server': return <Server className="w-6 h-6" />;
        case 'layers': return <Layers className="w-6 h-6" />;
        case 'hard-drive': return <HardDrive className="w-6 h-6" />;
        case 'box': return <Box className="w-6 h-6" />;
        case 'network': return <Network className="w-6 h-6" />;
        case 'shield': return <Shield className="w-6 h-6" />;
        case 'database': return <Database className="w-6 h-6" />;
        default: return <Server className="w-6 h-6" />;
    }
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onDeploy }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-orange-300 group flex flex-col h-full">
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        {getIcon(service.icon)}
                    </div>
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                        {service.category}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">
                        {service.title}
                    </h3>
                </div>
            </div>

            <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow">
                {service.description}
            </p>

            <div className="space-y-3 mb-8">
                {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                <span className="text-xl font-extrabold text-gray-900">
                    {service.price}
                </span>
                <button
                    onClick={() => onDeploy(service)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-orange-200 hover:shadow-orange-300 transform hover:-translate-y-1"
                >
                    Déployer
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;
