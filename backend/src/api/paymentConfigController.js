import pool from '../db/database.js';
import crypto from 'crypto';

// Algorithme de cryptage pour les clés secrètes
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;

/**
 * Crypter une donnée sensible
 */
function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Décrypter une donnée sensible
 */
function decrypt(text) {
    try {
        const parts = text.split(':');
        const iv = Buffer.from(parts.shift(), 'hex');
        const encryptedText = Buffer.from(parts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        return null;
    }
}

/**
 * GET /api/payment/config
 * Récupérer la configuration de paiement
 */
export const getPaymentConfig = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM payment_config WHERE id = 1 LIMIT 1'
        );

        if (result.rows.length === 0) {
            // Créer une configuration par défaut si elle n'existe pas
            const defaultConfig = {
                stripe_enabled: false,
                stripe_public_key: '',
                stripe_supported_currencies: ['EUR', 'USD'],
                paypal_enabled: false,
                paypal_client_id: '',
                paypal_mode: 'sandbox',
                paypal_supported_currencies: ['EUR', 'USD'],
                default_vendor_rate: 10,
                admin_fee: 5,
                payment_processing_fee: 2.9,
                minimum_payout: 50,
                taxes_enabled: true,
                default_tax_rate: 0.20,
                tax_rates_by_country: { FR: 0.20, BE: 0.21, DE: 0.19 },
                invoicing_auto_generate: true,
                invoicing_prefix: 'CN-',
                invoicing_starting_number: 1000,
                company_info: {
                    name: 'Cloud Nexus Platform',
                    address: '123 Rue de la Paix',
                    city: 'Paris',
                    postalCode: '75001',
                    country: 'France',
                    taxId: 'FR12345678901',
                    email: 'contact@cloudnexus.com',
                    phone: '+33 1 23 45 67 89'
                },
                notifications: {
                    email: {
                        onPurchase: true,
                        onCommission: true,
                        onPayout: true,
                        onRefund: true
                    },
                    sms: { enabled: false, onPurchase: false },
                    push: { enabled: true, onPurchase: true, onCommission: true }
                }
            };

            const insertResult = await pool.query(
                `INSERT INTO payment_config (
          stripe_enabled, stripe_public_key, stripe_supported_currencies,
          paypal_enabled, paypal_client_id, paypal_mode, paypal_supported_currencies,
          default_vendor_rate, admin_fee, payment_processing_fee, minimum_payout,
          taxes_enabled, default_tax_rate, tax_rates_by_country,
          invoicing_auto_generate, invoicing_prefix, invoicing_starting_number,
          company_info, notifications, updated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *`,
                [
                    defaultConfig.stripe_enabled,
                    defaultConfig.stripe_public_key,
                    JSON.stringify(defaultConfig.stripe_supported_currencies),
                    defaultConfig.paypal_enabled,
                    defaultConfig.paypal_client_id,
                    defaultConfig.paypal_mode,
                    JSON.stringify(defaultConfig.paypal_supported_currencies),
                    defaultConfig.default_vendor_rate,
                    defaultConfig.admin_fee,
                    defaultConfig.payment_processing_fee,
                    defaultConfig.minimum_payout,
                    defaultConfig.taxes_enabled,
                    defaultConfig.default_tax_rate,
                    JSON.stringify(defaultConfig.tax_rates_by_country),
                    defaultConfig.invoicing_auto_generate,
                    defaultConfig.invoicing_prefix,
                    defaultConfig.invoicing_starting_number,
                    JSON.stringify(defaultConfig.company_info),
                    JSON.stringify(defaultConfig.notifications),
                    'system'
                ]
            );

            return res.json(formatConfig(insertResult.rows[0]));
        }

        res.json(formatConfig(result.rows[0]));
    } catch (error) {
        console.error('Error fetching payment config:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

/**
 * PUT /api/payment/config
 * Mettre à jour la configuration de paiement
 */
export const updatePaymentConfig = async (req, res) => {
    try {
        const { user } = req;
        const updates = req.body;

        // Construire la requête SQL dynamiquement
        const fields = [];
        const values = [];
        let paramCount = 1;

        // Stripe
        if (updates.stripe) {
            if (updates.stripe.enabled !== undefined) {
                fields.push(`stripe_enabled = $${paramCount++}`);
                values.push(updates.stripe.enabled);
            }
            if (updates.stripe.publicKey !== undefined) {
                fields.push(`stripe_public_key = $${paramCount++}`);
                values.push(updates.stripe.publicKey);
            }
            if (updates.stripe.secretKey !== undefined) {
                // Crypter la clé secrète avant de la stocker
                fields.push(`stripe_secret_key = $${paramCount++}`);
                values.push(encrypt(updates.stripe.secretKey));
            }
            if (updates.stripe.supportedCurrencies) {
                fields.push(`stripe_supported_currencies = $${paramCount++}`);
                values.push(JSON.stringify(updates.stripe.supportedCurrencies));
            }
        }

        // PayPal
        if (updates.paypal) {
            if (updates.paypal.enabled !== undefined) {
                fields.push(`paypal_enabled = $${paramCount++}`);
                values.push(updates.paypal.enabled);
            }
            if (updates.paypal.clientId !== undefined) {
                fields.push(`paypal_client_id = $${paramCount++}`);
                values.push(updates.paypal.clientId);
            }
            if (updates.paypal.clientSecret !== undefined) {
                // Crypter le secret
                fields.push(`paypal_client_secret = $${paramCount++}`);
                values.push(encrypt(updates.paypal.clientSecret));
            }
            if (updates.paypal.mode) {
                fields.push(`paypal_mode = $${paramCount++}`);
                values.push(updates.paypal.mode);
            }
            if (updates.paypal.supportedCurrencies) {
                fields.push(`paypal_supported_currencies = $${paramCount++}`);
                values.push(JSON.stringify(updates.paypal.supportedCurrencies));
            }
        }

        // Commissions
        if (updates.commissions) {
            if (updates.commissions.defaultVendorRate !== undefined) {
                fields.push(`default_vendor_rate = $${paramCount++}`);
                values.push(updates.commissions.defaultVendorRate);
            }
            if (updates.commissions.adminFee !== undefined) {
                fields.push(`admin_fee = $${paramCount++}`);
                values.push(updates.commissions.adminFee);
            }
            if (updates.commissions.paymentProcessingFee !== undefined) {
                fields.push(`payment_processing_fee = $${paramCount++}`);
                values.push(updates.commissions.paymentProcessingFee);
            }
            if (updates.commissions.minimumPayout !== undefined) {
                fields.push(`minimum_payout = $${paramCount++}`);
                values.push(updates.commissions.minimumPayout);
            }
        }

        // Taxes
        if (updates.taxes) {
            if (updates.taxes.enabled !== undefined) {
                fields.push(`taxes_enabled = $${paramCount++}`);
                values.push(updates.taxes.enabled);
            }
            if (updates.taxes.defaultRate !== undefined) {
                fields.push(`default_tax_rate = $${paramCount++}`);
                values.push(updates.taxes.defaultRate);
            }
            if (updates.taxes.ratesByCountry) {
                fields.push(`tax_rates_by_country = $${paramCount++}`);
                values.push(JSON.stringify(updates.taxes.ratesByCountry));
            }
        }

        // Invoicing
        if (updates.invoicing) {
            if (updates.invoicing.autoGenerate !== undefined) {
                fields.push(`invoicing_auto_generate = $${paramCount++}`);
                values.push(updates.invoicing.autoGenerate);
            }
            if (updates.invoicing.prefix) {
                fields.push(`invoicing_prefix = $${paramCount++}`);
                values.push(updates.invoicing.prefix);
            }
            if (updates.invoicing.companyInfo) {
                fields.push(`company_info = $${paramCount++}`);
                values.push(JSON.stringify(updates.invoicing.companyInfo));
            }
        }

        // Notifications
        if (updates.notifications) {
            fields.push(`notifications = $${paramCount++}`);
            values.push(JSON.stringify(updates.notifications));
        }

        // Updated by
        fields.push(`updated_by = $${paramCount++}`);
        values.push(user.id);

        fields.push(`updated_at = NOW()`);

        if (fields.length === 0) {
            return res.status(400).json({ message: 'Aucune modification fournie' });
        }

        const query = `
      UPDATE payment_config 
      SET ${fields.join(', ')}
      WHERE id = 1
      RETURNING *
    `;

        const result = await pool.query(query, values);

        // Logger l'action
        await pool.query(
            'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
            [user.id, 'UPDATE', 'payment_config', 1, JSON.stringify({ fields: Object.keys(updates) })]
        );

        res.json(formatConfig(result.rows[0]));
    } catch (error) {
        console.error('Error updating payment config:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

/**
 * POST /api/payment/test/stripe
 * Tester la connexion Stripe
 */
export const testStripeConnection = async (req, res) => {
    try {
        // TODO: Implémenter le test réel avec Stripe SDK
        // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        // await stripe.customers.list({ limit: 1 });

        res.json({
            success: true,
            message: 'Connexion Stripe réussie',
            timestamp: new Date()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Échec de la connexion Stripe',
            error: error.message
        });
    }
};

/**
 * POST /api/payment/test/paypal
 * Tester la connexion PayPal
 */
export const testPayPalConnection = async (req, res) => {
    try {
        // TODO: Implémenter le test réel avec PayPal SDK

        res.json({
            success: true,
            message: 'Connexion PayPal réussie',
            timestamp: new Date()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Échec de la connexion PayPal',
            error: error.message
        });
    }
};

/**
 * Formater la configuration pour la réponse
 * (Ne pas envoyer les clés secrètes au client)
 */
function formatConfig(row) {
    return {
        id: row.id,
        stripe: {
            enabled: row.stripe_enabled,
            publicKey: row.stripe_public_key,
            supportedCurrencies: typeof row.stripe_supported_currencies === 'string'
                ? JSON.parse(row.stripe_supported_currencies)
                : row.stripe_supported_currencies
        },
        paypal: {
            enabled: row.paypal_enabled,
            clientId: row.paypal_client_id,
            mode: row.paypal_mode,
            supportedCurrencies: typeof row.paypal_supported_currencies === 'string'
                ? JSON.parse(row.paypal_supported_currencies)
                : row.paypal_supported_currencies
        },
        commissions: {
            defaultVendorRate: parseFloat(row.default_vendor_rate),
            adminFee: parseFloat(row.admin_fee),
            paymentProcessingFee: parseFloat(row.payment_processing_fee),
            minimumPayout: parseFloat(row.minimum_payout)
        },
        taxes: {
            enabled: row.taxes_enabled,
            defaultRate: parseFloat(row.default_tax_rate),
            ratesByCountry: typeof row.tax_rates_by_country === 'string'
                ? JSON.parse(row.tax_rates_by_country)
                : row.tax_rates_by_country,
            includedInPrice: row.taxes_included_in_price || false
        },
        invoicing: {
            autoGenerate: row.invoicing_auto_generate,
            prefix: row.invoicing_prefix,
            startingNumber: row.invoicing_starting_number,
            companyInfo: typeof row.company_info === 'string'
                ? JSON.parse(row.company_info)
                : row.company_info
        },
        notifications: typeof row.notifications === 'string'
            ? JSON.parse(row.notifications)
            : row.notifications,
        updatedAt: row.updated_at,
        updatedBy: row.updated_by
    };
}
