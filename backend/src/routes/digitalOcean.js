import express from 'express';
const router = express.Router();

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
    next();
};

// GET /api/digitalocean/account - Informations du compte Digital Ocean
router.get('/account', authenticateToken, async (req, res) => {
    try {
        // Simulation des informations de compte
        const accountInfo = {
            uuid: 'do-account-12345',
            email: 'user@example.com',
            status: 'active',
            emailVerified: true,
            balance: 150.00,
            currency: 'USD',
            monthlySpend: 45.80,
            teamName: req.user?.team?.name || 'Default Team'
        };

        res.json({
            success: true,
            account: accountInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch account info',
            message: error.message
        });
    }
});

// GET /api/digitalocean/regions - Liste des régions disponibles
router.get('/regions', authenticateToken, async (req, res) => {
    try {
        const regions = [
            {
                slug: 'nyc1',
                name: 'New York 1',
                sizes: ['s-1vcpu-1gb', 's-1vcpu-2gb', 's-2vcpu-2gb', 's-2vcpu-4gb'],
                available: true,
                features: ['private_networking', 'backups', 'ipv6', 'metadata', 'storage']
            },
            {
                slug: 'nyc3',
                name: 'New York 3',
                sizes: ['s-1vcpu-1gb', 's-1vcpu-2gb', 's-2vcpu-2gb', 's-2vcpu-4gb', 's-4vcpu-8gb'],
                available: true,
                features: ['private_networking', 'backups', 'ipv6', 'metadata', 'storage', 'load_balancers']
            },
            {
                slug: 'fra1',
                name: 'Frankfurt 1',
                sizes: ['s-1vcpu-1gb', 's-1vcpu-2gb', 's-2vcpu-2gb', 's-2vcpu-4gb'],
                available: true,
                features: ['private_networking', 'backups', 'ipv6', 'metadata', 'storage']
            },
            {
                slug: 'lon1',
                name: 'London 1',
                sizes: ['s-1vcpu-1gb', 's-1vcpu-2gb', 's-2vcpu-2gb', 's-2vcpu-4gb'],
                available: true,
                features: ['private_networking', 'backups', 'ipv6', 'metadata', 'storage']
            },
            {
                slug: 'sgp1',
                name: 'Singapore 1',
                sizes: ['s-1vcpu-1gb', 's-1vcpu-2gb', 's-2vcpu-2gb'],
                available: true,
                features: ['private_networking', 'backups', 'ipv6', 'metadata']
            },
            {
                slug: 'sfo3',
                name: 'San Francisco 3',
                sizes: ['s-1vcpu-1gb', 's-1vcpu-2gb', 's-2vcpu-2gb', 's-2vcpu-4gb'],
                available: true,
                features: ['private_networking', 'backups', 'ipv6', 'metadata', 'storage']
            }
        ];

        res.json({
            success: true,
            regions,
            total: regions.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch regions',
            message: error.message
        });
    }
});

// GET /api/digitalocean/sizes - Tailles de droplets disponibles
router.get('/sizes', authenticateToken, async (req, res) => {
    try {
        const sizes = [
            {
                slug: 's-1vcpu-1gb',
                memory: 1024,
                vcpus: 1,
                disk: 25,
                transfer: 1.0,
                priceMonthly: 6.00,
                priceHourly: 0.009,
                available: true,
                description: 'Basic'
            },
            {
                slug: 's-1vcpu-2gb',
                memory: 2048,
                vcpus: 1,
                disk: 50,
                transfer: 2.0,
                priceMonthly: 12.00,
                priceHourly: 0.018,
                available: true,
                description: 'Basic'
            },
            {
                slug: 's-2vcpu-2gb',
                memory: 2048,
                vcpus: 2,
                disk: 60,
                transfer: 3.0,
                priceMonthly: 18.00,
                priceHourly: 0.027,
                available: true,
                description: 'Basic'
            },
            {
                slug: 's-2vcpu-4gb',
                memory: 4096,
                vcpus: 2,
                disk: 80,
                transfer: 4.0,
                priceMonthly: 24.00,
                priceHourly: 0.036,
                available: true,
                description: 'General Purpose'
            },
            {
                slug: 's-4vcpu-8gb',
                memory: 8192,
                vcpus: 4,
                disk: 160,
                transfer: 5.0,
                priceMonthly: 48.00,
                priceHourly: 0.071,
                available: true,
                description: 'General Purpose'
            },
            {
                slug: 's-8vcpu-16gb',
                memory: 16384,
                vcpus: 8,
                disk: 320,
                transfer: 6.0,
                priceMonthly: 96.00,
                priceHourly: 0.143,
                available: true,
                description: 'CPU Optimized'
            }
        ];

        res.json({
            success: true,
            sizes,
            total: sizes.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sizes',
            message: error.message
        });
    }
});

// GET /api/digitalocean/images - Images disponibles
router.get('/images', authenticateToken, async (req, res) => {
    try {
        const images = [
            {
                id: 'ubuntu-22-04-x64',
                name: 'Ubuntu 22.04 LTS x64',
                distribution: 'Ubuntu',
                slug: 'ubuntu-22-04-x64',
                public: true,
                regions: ['nyc1', 'nyc3', 'fra1', 'lon1', 'sfo3'],
                minDiskSize: 15,
                type: 'snapshot',
                sizeGigaBytes: 2.36
            },
            {
                id: 'ubuntu-20-04-x64',
                name: 'Ubuntu 20.04 LTS x64',
                distribution: 'Ubuntu',
                slug: 'ubuntu-20-04-x64',
                public: true,
                regions: ['nyc1', 'nyc3', 'fra1', 'lon1', 'sfo3'],
                minDiskSize: 15,
                type: 'snapshot',
                sizeGigaBytes: 2.20
            },
            {
                id: 'centos-8-x64',
                name: 'CentOS 8 x64',
                distribution: 'CentOS',
                slug: 'centos-8-x64',
                public: true,
                regions: ['nyc1', 'nyc3', 'fra1'],
                minDiskSize: 20,
                type: 'snapshot',
                sizeGigaBytes: 1.91
            },
            {
                id: 'debian-11-x64',
                name: 'Debian 11 x64',
                distribution: 'Debian',
                slug: 'debian-11-x64',
                public: true,
                regions: ['nyc1', 'nyc3', 'fra1', 'lon1', 'sfo3'],
                minDiskSize: 15,
                type: 'snapshot',
                sizeGigaBytes: 1.02
            }
        ];

        res.json({
            success: true,
            images,
            total: images.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch images',
            message: error.message
        });
    }
});

export default router;
