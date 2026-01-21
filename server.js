import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const prisma = new PrismaClient();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:8080'],
        credentials: true
    }
});

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists
            let user = await prisma.user.findUnique({
                where: { email: profile.emails[0].value }
            });

            if (!user) {
                // Create new user
                user = await prisma.user.create({
                    data: {
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        password: '', // No password for Google users
                        role: 'owner', // Default role
                        team: {
                            create: {
                                name: `${profile.displayName}'s Team`
                            }
                        }
                    }
                });
            }

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:8080'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-CSRF-Token', 'X-Request-ID']
}));
app.use(express.json());

// ==================== MIDDLEWARE ====================
const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: { team: true }
        });

        if (!req.user) {
            return res.status(401).json({ error: 'User not found' });
        }

        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
};

// ==================== AUTH ENDPOINTS ====================

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req, res) => {
        // Successful authentication
        const token = jwt.sign({ userId: req.user.id }, JWT_SECRET, { expiresIn: '7d' });
        // Redirect to frontend with token
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        res.redirect(`${clientUrl}/auth/callback?token=${token}`);
    }
);

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'owner',
                team: {
                    create: {
                        name: `${name}'s Team`
                    }
                }
            },
            include: { team: true }
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                teamId: user.teamId
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { team: true }
        });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                teamId: user.teamId
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== DROPLETS ENDPOINTS ====================
app.get('/api/droplets', authenticateToken, async (req, res) => {
    try {
        const droplets = await prisma.droplet.findMany({
            where: { teamId: req.user.teamId },
            include: {
                metrics: {
                    orderBy: { timestamp: 'desc' },
                    take: 1
                }
            }
        });

        res.json(droplets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/droplets', authenticateToken, async (req, res) => {
    try {
        const { name, region, size, image } = req.body;

        // Simulate droplet creation cost
        const pricing = {
            '2GB': 12,
            '4GB': 24,
            '8GB': 48,
            '16GB': 96
        };

        const monthlyCost = pricing[size] || 12;

        const droplet = await prisma.droplet.create({
            data: {
                name,
                region,
                size,
                image: image || 'ubuntu-22-04',
                status: 'starting',
                ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                monthlyCost,
                teamId: req.user.teamId,
                createdBy: req.user.id
            }
        });

        // Simulate droplet startup
        setTimeout(async () => {
            await prisma.droplet.update({
                where: { id: droplet.id },
                data: { status: 'running' }
            });

            io.to(`team-${req.user.teamId}`).emit('droplet:updated', {
                id: droplet.id,
                status: 'running'
            });
        }, 3000);

        res.json(droplet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/droplets/:id', authenticateToken, async (req, res) => {
    try {
        const droplet = await prisma.droplet.findUnique({
            where: { id: req.params.id }
        });

        if (!droplet || droplet.teamId !== req.user.teamId) {
            return res.status(404).json({ error: 'Droplet not found' });
        }

        await prisma.droplet.delete({
            where: { id: req.params.id }
        });

        io.to(`team-${req.user.teamId}`).emit('droplet:deleted', { id: req.params.id });

        res.json({ message: 'Droplet deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/droplets/:id/reboot', authenticateToken, async (req, res) => {
    try {
        const droplet = await prisma.droplet.update({
            where: { id: req.params.id },
            data: { status: 'rebooting' }
        });

        setTimeout(async () => {
            await prisma.droplet.update({
                where: { id: req.params.id },
                data: { status: 'running' }
            });

            io.to(`team-${req.user.teamId}`).emit('droplet:updated', {
                id: droplet.id,
                status: 'running'
            });
        }, 5000);

        res.json(droplet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== DOMAINS ENDPOINTS ====================
app.get('/api/domains', authenticateToken, async (req, res) => {
    try {
        const domains = await prisma.domain.findMany({
            where: { teamId: req.user.teamId },
            include: {
                records: true
            }
        });

        res.json(domains);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/domains', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;

        const domain = await prisma.domain.create({
            data: {
                name,
                status: 'pending',
                teamId: req.user.teamId
            }
        });

        // Auto-create default DNS records
        await prisma.dNSRecord.createMany({
            data: [
                { domainId: domain.id, type: 'A', name: '@', value: '0.0.0.0', ttl: 3600 },
                { domainId: domain.id, type: 'CNAME', name: 'www', value: name, ttl: 3600 }
            ]
        });

        res.json(domain);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/domains/:id/records', authenticateToken, async (req, res) => {
    try {
        const { type, name, value, ttl } = req.body;

        const domain = await prisma.domain.findUnique({
            where: { id: req.params.id }
        });

        if (!domain || domain.teamId !== req.user.teamId) {
            return res.status(404).json({ error: 'Domain not found' });
        }

        const record = await prisma.dNSRecord.create({
            data: {
                domainId: req.params.id,
                type,
                name,
                value,
                ttl: ttl || 3600
            }
        });

        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== BILLING & STRIPE ====================
app.get('/api/billing/invoices', authenticateToken, async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany({
            where: { teamId: req.user.teamId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/billing/checkout', authenticateToken, async (req, res) => {
    try {
        const { amount } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Cloud Platform Credit',
                        },
                        unit_amount: amount * 100, // Stripe uses cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/billing`,
            metadata: {
                userId: req.user.id,
                teamId: req.user.teamId
            }
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        await prisma.invoice.create({
            data: {
                teamId: session.metadata.teamId,
                amount: session.amount_total / 100,
                status: 'paid',
                stripeInvoiceId: session.id
            }
        });
    }

    res.json({ received: true });
});

// ==================== TEAMS & INVITATIONS ====================
app.get('/api/team/members', authenticateToken, async (req, res) => {
    try {
        const members = await prisma.user.findMany({
            where: { teamId: req.user.teamId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });

        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/team/invite', authenticateToken, checkRole(['owner', 'admin']), async (req, res) => {
    try {
        const { email, role } = req.body;

        const invitation = await prisma.invitation.create({
            data: {
                email,
                role: role || 'member',
                teamId: req.user.teamId,
                invitedBy: req.user.id,
                token: jwt.sign({ email, teamId: req.user.teamId }, JWT_SECRET, { expiresIn: '7d' })
            }
        });

        // Here you would send an email with the invitation link
        // await sendInvitationEmail(email, invitation.token);

        res.json(invitation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/team/accept-invite', async (req, res) => {
    try {
        const { token, password, name } = req.body;

        const decoded = jwt.verify(token, JWT_SECRET);

        const invitation = await prisma.invitation.findFirst({
            where: {
                email: decoded.email,
                teamId: decoded.teamId,
                acceptedAt: null
            }
        });

        if (!invitation) {
            return res.status(400).json({ error: 'Invalid or expired invitation' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email: decoded.email,
                password: hashedPassword,
                name,
                role: invitation.role,
                teamId: decoded.teamId
            }
        });

        await prisma.invitation.update({
            where: { id: invitation.id },
            data: { acceptedAt: new Date() }
        });

        const authToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token: authToken, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/team/members/:userId', authenticateToken, checkRole(['owner']), async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.userId }
        });

        if (!user || user.teamId !== req.user.teamId) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'owner') {
            return res.status(400).json({ error: 'Cannot remove team owner' });
        }

        await prisma.user.delete({
            where: { id: req.params.userId }
        });

        res.json({ message: 'Member removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== MONITORING & METRICS ====================
app.get('/api/droplets/:id/metrics', authenticateToken, async (req, res) => {
    try {
        const metrics = await prisma.dropletMetric.findMany({
            where: { dropletId: req.params.id },
            orderBy: { timestamp: 'desc' },
            take: 100
        });

        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== WEBSOCKET FOR REAL-TIME MONITORING ====================
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join:team', async (teamId) => {
        socket.join(`team-${teamId}`);
        console.log(`Socket ${socket.id} joined team ${teamId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Simulate real-time metrics generation
setInterval(async () => {
    const runningDroplets = await prisma.droplet.findMany({
        where: { status: 'running' }
    });

    for (const droplet of runningDroplets) {
        const metric = await prisma.dropletMetric.create({
            data: {
                dropletId: droplet.id,
                cpuUsage: Math.random() * 100,
                ramUsage: Math.random() * 100,
                diskUsage: Math.random() * 100,
                networkIn: Math.random() * 1000000,
                networkOut: Math.random() * 1000000,
                timestamp: new Date()
            }
        });

        io.to(`team-${droplet.teamId}`).emit('metrics:update', {
            dropletId: droplet.id,
            metrics: metric
        });
    }
}, 5000); // Every 5 seconds

// ==================== START SERVER ====================
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 WebSocket server ready`);
});
