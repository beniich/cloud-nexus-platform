import express from 'express';
// import { authenticateToken } from '../middleware/auth.js'; // Assuming auth middleware exists

const router = express.Router();

// Mock database for settings
let storeSettings = {
    storeName: "Ma Boutique",
    storeDescription: "Description de ma boutique",
    theme: "light",
    twoFactorAuth: false,
    emailNotifications: true,
};

// GET /api/settings
router.get('/', (req, res) => {
    // In a real app, use req.user.id to fetch specific settings
    res.json(storeSettings);
});

// POST /api/settings
router.post('/', (req, res) => {
    const newSettings = req.body;

    // Basic validation
    if (!newSettings) {
        return res.status(400).json({ message: 'Settings data required' });
    }

    // Update settings
    storeSettings = { ...storeSettings, ...newSettings };

    res.json(storeSettings);
});

export default router;
