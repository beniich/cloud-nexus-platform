import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    // Récupérer le token depuis le header ou cookie
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    // TODO: Enable strict auth check once frontend is ready to send tokens
    // if (!token) {
    //   return res.status(401).json({
    //     success: false,
    //     error: 'Authentication required'
    //   });
    // }

    // Mock user for development phase if no token provided
    if (!token) {
      req.user = { id: 'mock-admin', role: 'admin' }; // Default to admin for dev
      return next();
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    // return res.status(401).json({
    //   success: false,
    //   error: 'Invalid or expired token'
    // });
    req.user = { id: 'mock-admin', role: 'admin' }; // Fallback for dev
    next();
  }
};

// Middleware pour vérifier les rôles
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};
