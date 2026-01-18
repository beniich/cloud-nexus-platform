/**
 * Middleware pour vérifier que l'utilisateur a le bon rôle
 */
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        const userRole = req.user.role;

        // Convertir en tableau si c'est un seul rôle
        const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        if (!rolesArray.includes(userRole)) {
            return res.status(403).json({
                message: 'Accès refusé',
                required: rolesArray,
                current: userRole
            });
        }

        next();
    };
};

/**
 * Middleware pour vérifier si l'utilisateur est admin
 */
export const requireAdmin = requireRole(['admin', 'owner']);

/**
 * Middleware pour vérifier si l'utilisateur est vendeur ou admin
 */
export const requireVendor = requireRole(['vendor', 'seller', 'admin', 'owner']);

/**
 * Middleware pour vérifier si l'utilisateur peut gérer les paiements
 */
export const canManagePayments = requireRole(['admin', 'owner']);
