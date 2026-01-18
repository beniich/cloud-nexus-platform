import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import menuConfigRoutes from './routes/menuConfig.js';
import digitalOceanRoutes from './routes/digitalOcean.js';
import spacesRoutes from './routes/spaces.js';
import featureFlagsRoutes from './routes/featureFlags.js';
import usersRoutes from './routes/users.js';
import vendorRoutes from './routes/vendor.js';
import settingsRoutes from './routes/settings.js';
import paymentConfigRoutes from './routes/paymentConfig.js';
import platformSettingsRoutes from './routes/platform.js';

dotenv.config();

import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3005', 'http://localhost:3006', 'http://localhost:8086'], // Update with frontend port
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE GLOBAUX
// ============================================

// Sécurité
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:8085', 'http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

// ============================================
// API ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/menu-config', menuConfigRoutes);
app.use('/api/digitalocean', digitalOceanRoutes);
app.use('/api/spaces', spacesRoutes);
app.use('/api/feature-flags', featureFlagsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/payment', paymentConfigRoutes);
app.use('/api/platform', platformSettingsRoutes);

// ============================================
// ERROR HANDLING
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   🚀 Backend Server Running            ║
╠════════════════════════════════════════╣
║   Environment: ${process.env.NODE_ENV?.padEnd(24) || 'development'.padEnd(24)}║
║   Port: ${PORT.toString().padEnd(31)}║
║   URL: http://localhost:${PORT}          ║
╚════════════════════════════════════════╝
  `);
});

export default app;
