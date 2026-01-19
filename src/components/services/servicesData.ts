export interface Service {
    id: string;
    category: string;
    title: string;
    description: string;
    features: string[];
    price: string;
    icon: string;
}

export const servicesData: Service[] = [
    {
        id: 'instances',
        category: 'Calcul',
        title: 'Instances Cloud',
        description: 'Machines virtuelles disponibles à la demande avec des performances CPU/RAM entièrement configurables.',
        features: ['99.9% Uptime', 'SSD Storage', 'DDoS Protection'],
        price: 'From €5/mo',
        icon: 'server'
    },
    {
        id: 'kubernetes',
        category: 'Calcul',
        title: 'Kubernetes Managé',
        description: 'Orchestrez vos applications conteneurisées sans effort grâce à notre service K8s géré.',
        features: ['Auto-scaling', 'Auto-healing', 'Integrated Monitoring'],
        price: 'From €20/mo',
        icon: 'layers'
    },
    {
        id: 'block-storage',
        category: 'Stockage',
        title: 'Stockage Bloc',
        description: 'Volumes de stockage persistant haute performance pour vos instances.',
        features: ['NVMe Performance', 'Snapshots', 'Redundancy'],
        price: '€0.05/GB/mo',
        icon: 'hard-drive'
    },
    {
        id: 'object-storage',
        category: 'Stockage',
        title: 'Stockage Objet',
        description: 'Stockage évolutif compatible S3 spécifique pour vos données statiques et sauvegardes.',
        features: ['Unlimited API', 'Global CDN', 'Lifecycle Rules'],
        price: '€0.01/GB/mo',
        icon: 'box'
    },
    {
        id: 'load-balancer',
        category: 'Réseau',
        title: 'Load Balancer',
        description: 'Répartissez le trafic entre vos instances pour garantir performance et disponibilité.',
        features: ['SSL Termination', 'Health Checks', 'Anycast IP'],
        price: '€10/mo',
        icon: 'network'
    },
    {
        id: 'private-network',
        category: 'Réseau',
        title: 'Réseaux Privés',
        description: 'Créez des réseaux isolés et sécurisés entre vos ressources cloud.',
        features: ['VLAN Isolation', 'Low Latency', 'Unlimited Traffic'],
        price: 'Free',
        icon: 'network'
    },
    {
        id: 'ddos',
        category: 'Sécurité',
        title: 'Protection DDoS',
        description: 'Protection avancée contre les attaques volumétriques et applicatives incluse par défaut.',
        features: ['Always-on L3/L4/L7', 'Real-time Mitigation', 'Included'],
        price: 'Included',
        icon: 'shield'
    },
    {
        id: 'databases',
        category: 'Bases de Données',
        title: 'Bases de Données',
        description: 'Bases PostgreSQL, MySQL et Redis gérées, sécurisées et sauvegardées automatiquement.',
        features: ['Auto-backups', 'High Availability', 'Point-in-time Recovery'],
        price: 'From €15/mo',
        icon: 'database'
    }
];

export const categories = ['Tous les services', 'Calcul', 'Stockage', 'Réseau', 'Sécurité', 'Bases de Données'];
