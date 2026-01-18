import express from 'express';
import { getPlatformSettings, updatePlatformSettings } from '../api/platformController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

// Public: Tout le monde peut lire la config (pour afficher le titre/logo avant login)
router.get('/', getPlatformSettings);

// Admin: Seul l'admin peut modifier
router.put('/', authenticateToken, requireRole(['admin', 'owner']), updatePlatformSettings);

export default router;
