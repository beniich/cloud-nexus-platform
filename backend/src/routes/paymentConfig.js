import express from 'express';
import { body, param } from 'express-validator';
import {
    getPaymentConfig,
    updatePaymentConfig,
    testStripeConnection,
    testPayPalConnection
} from '../api/paymentConfigController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * @route   GET /api/payment/config
 * @desc    Récupérer la configuration de paiement
 * @access  Private (tous les utilisateurs authentifiés)
 */
router.get('/config', authenticateToken, getPaymentConfig);

/**
 * @route   PUT /api/payment/config
 * @desc    Mettre à jour la configuration de paiement
 * @access  Private (Admin seulement)
 */
router.put(
    '/config',
    authenticateToken,
    requireRole(['admin', 'owner']),
    [
        body('stripe.enabled').optional().isBoolean(),
        body('stripe.publicKey').optional().isString(),
        body('paypal.enabled').optional().isBoolean(),
        body('paypal.clientId').optional().isString(),
        body('paypal.mode').optional().isIn(['sandbox', 'live']),
        body('commissions.defaultVendorRate').optional().isFloat({ min: 0, max: 100 }),
        body('commissions.adminFee').optional().isFloat({ min: 0, max: 100 }),
        body('commissions.paymentProcessingFee').optional().isFloat({ min: 0, max: 100 }),
        body('commissions.minimumPayout').optional().isFloat({ min: 0 }),
        body('taxes.enabled').optional().isBoolean(),
        body('taxes.defaultRate').optional().isFloat({ min: 0, max: 1 }),
        validate
    ],
    updatePaymentConfig
);

/**
 * @route   POST /api/payment/test/stripe
 * @desc    Tester la connexion Stripe
 * @access  Private (Admin seulement)
 */
router.post(
    '/test/stripe',
    authenticateToken,
    requireRole(['admin', 'owner']),
    testStripeConnection
);

/**
 * @route   POST /api/payment/test/paypal
 * @desc    Tester la connexion PayPal
 * @access  Private (Admin seulement)
 */
router.post(
    '/test/paypal',
    authenticateToken,
    requireRole(['admin', 'owner']),
    testPayPalConnection
);

export default router;
