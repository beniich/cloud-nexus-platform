
// ============================================================
// AUTO LANGUAGE DETECTION BY IP GEOLOCATION
// Backend + Frontend Integration
// ============================================================

// ============================================================
// BACKEND - IP GEOLOCATION SERVICE
// ============================================================

import express from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Language mapping by country code
const COUNTRY_TO_LANGUAGE = {
    // French-speaking countries
    'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'CA': 'fr', 'LU': 'fr',
    'MC': 'fr', 'SN': 'fr', 'CI': 'fr', 'ML': 'fr', 'BF': 'fr',

    // Spanish-speaking countries
    'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es',
    'PE': 'es', 'VE': 'es', 'EC': 'es', 'GT': 'es', 'CU': 'es',
    'BO': 'es', 'DO': 'es', 'HN': 'es', 'PY': 'es', 'SV': 'es',
    'NI': 'es', 'CR': 'es', 'PA': 'es', 'UY': 'es', 'PR': 'es',

    // German-speaking countries
    'DE': 'de', 'AT': 'de', 'LI': 'de',

    // Japanese
    'JP': 'ja',

    // Arabic-speaking countries
    'SA': 'ar', 'AE': 'ar', 'EG': 'ar', 'MA': 'ar', 'DZ': 'ar',
    'TN': 'ar', 'JO': 'ar', 'LB': 'ar', 'KW': 'ar', 'OM': 'ar',
    'QA': 'ar', 'BH': 'ar', 'IQ': 'ar', 'SY': 'ar', 'YE': 'ar',

    // Portuguese
    'PT': 'pt', 'BR': 'pt', 'AO': 'pt', 'MZ': 'pt',

    // Italian
    'IT': 'it',

    // Russian
    'RU': 'ru', 'BY': 'ru', 'KZ': 'ru',

    // Chinese
    'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'SG': 'zh',

    // Default to English for all others
};

export class GeolocationService {

    /**
     * Get user's location from IP using multiple providers
     */
    async getLocationFromIP(ip) {
        // Skip for localhost/private IPs
        if (this.isPrivateIP(ip)) {
            return {
                country: 'US',
                language: 'en',
                city: 'Local',
                timezone: 'UTC',
                source: 'local'
            };
        }

        try {
            // Try ipapi.co first (free, 1000 requests/day)
            const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
                timeout: 3000
            });

            const data = response.data;

            return {
                country: data.country_code || 'US',
                language: COUNTRY_TO_LANGUAGE[data.country_code] || 'en',
                city: data.city,
                region: data.region,
                timezone: data.timezone,
                latitude: data.latitude,
                longitude: data.longitude,
                source: 'ipapi.co'
            };

        } catch (error) {
            console.error('IP geolocation error:', error.message);

            // Fallback to ip-api.com (free, unlimited)
            try {
                const fallback = await axios.get(`http://ip-api.com/json/${ip}`, {
                    timeout: 3000
                });

                return {
                    country: fallback.data.countryCode || 'US',
                    language: COUNTRY_TO_LANGUAGE[fallback.data.countryCode] || 'en',
                    city: fallback.data.city,
                    timezone: fallback.data.timezone,
                    source: 'ip-api.com'
                };

            } catch (fallbackError) {
                console.error('Fallback geolocation failed:', fallbackError.message);

                // Ultimate fallback
                return {
                    country: 'US',
                    language: 'en',
                    city: 'Unknown',
                    timezone: 'UTC',
                    source: 'fallback'
                };
            }
        }
    }

    /**
     * Check if IP is private/local
     */
    isPrivateIP(ip) {
        if (!ip || ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
            return true;
        }

        const parts = ip.split('.');
        if (parts.length !== 4) return false;

        // Check private IP ranges
        return (
            parts[0] === '10' ||
            (parts[0] === '172' && parseInt(parts[1]) >= 16 && parseInt(parts[1]) <= 31) ||
            (parts[0] === '192' && parts[1] === '168')
        );
    }

    /**
     * Get client IP from request (handles proxies)
     */
    getClientIP(req) {
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }

        return (
            req.headers['x-real-ip'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.ip
        );
    }

    /**
     * Detect and save user's language preference
     */
    async detectAndSaveLanguage(userId, req) {
        try {
            const ip = this.getClientIP(req);
            const location = await this.getLocationFromIP(ip);

            // Save to database
            await prisma.user.update({
                where: { id: userId },
                data: {
                    language: location.language,
                    country: location.country,
                    timezone: location.timezone,
                    lastIP: ip
                }
            });

            console.log(`✅ Language set to ${location.language} for user ${userId} (${location.country})`);

            return location;

        } catch (error) {
            console.error('Language detection error:', error);
            return { language: 'en', country: 'US' };
        }
    }
}

// ============================================================
// API ROUTES
// ============================================================

export const geoService = new GeolocationService();

/**
 * GET /api/geo/detect
 * Auto-detect user's language from IP
 */
router.get('/detect', async (req, res) => {
    try {
        const ip = geoService.getClientIP(req);
        const location = await geoService.getLocationFromIP(ip);

        res.json({
            success: true,
            ip,
            ...location
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/geo/save-language
 * Save detected language for authenticated user
 */
router.post('/save-language', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId required' });
        }

        const location = await geoService.detectAndSaveLanguage(userId, req);

        res.json({
            success: true,
            language: location.language,
            country: location.country
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/geo/languages
 * Get supported languages
 */
router.get('/languages', (req, res) => {
    res.json({
        success: true,
        languages: [
            { code: 'en', name: 'English', flag: '🇬🇧' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
            { code: 'ja', name: '日本語', flag: '🇯🇵' },
            { code: 'ar', name: 'العربية', flag: '🇸🇦' },
            { code: 'pt', name: 'Português', flag: '🇵🇹' },
            { code: 'it', name: 'Italiano', flag: '🇮🇹' },
            { code: 'ru', name: 'Русский', flag: '🇷🇺' },
            { code: 'zh', name: '中文', flag: '🇨🇳' }
        ]
    });
});

// ============================================================
// MIDDLEWARE - Auto-detect language for all requests
// ============================================================

export async function autoLanguageMiddleware(req, res, next) {
    try {
        // Skip if user already has language set
        if (req.user?.language) {
            req.language = req.user.language;
            return next();
        }

        // Detect from IP
        const ip = geoService.getClientIP(req);
        const location = await geoService.getLocationFromIP(ip);

        req.language = location.language;
        req.country = location.country;

        next();

    } catch (error) {
        req.language = 'en'; // Fallback
        next();
    }
}

export default router;
