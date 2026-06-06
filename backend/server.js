require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Database initialization
const db = require('./config/database');
const { authenticateToken } = require('./auth/middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Database
(async () => {
    try {
        await db.initialize();
        console.log('✅ SQLite Database Connected & Initialized');
    } catch (err) {
        console.error('❌ Database connection failed:', err);
    }
})();

// ===== GLOBAL SECURITY MIDDLEWARES =====
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://challenges.cloudflare.com", "https://db.onlinewebfonts.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://db.onlinewebfonts.com", "https://api.fontshare.com"],
            imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://challenges.cloudflare.com", "https://spectraops.pk", "https://www.spectraops.pk"],
            connectSrc: ["'self'", "https://challenges.cloudflare.com", "https://api.fontshare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "https://db.onlinewebfonts.com", "https://api.fontshare.com", "data:"],
            frameSrc: ["'self'", "https://challenges.cloudflare.com"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: false
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['https://spectraops.pk', 'https://www.spectraops.pk', 'http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Administrative login brute force rate limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, error: 'Too many login attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/verify-mfa', loginLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization middleware against script injection
app.use((req, res, next) => {
    const sanitize = (val) => {
        if (typeof val === 'string') {
            return val.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
        }
        return val;
    };
    if (req.body) {
        for (const k in req.body) req.body[k] = sanitize(req.body[k]);
    }
    next();
});

// Health check endpoint (defined before rate limiter to prevent 429 errors from platform health checks)
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        server: 'SpectraOps Modular Server',
        version: '4.0.0',
        uptime: process.uptime()
    });
});

// Rate limiting: 100 requests per 15 minutes max
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: { success: false, error: 'Too many requests from this IP. Please try again later.' }
});
app.use('/api/', apiLimiter);

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// ===== MODERN MODULAR API ROUTES =====
const authRoutes = require('./auth/routes');
const usersRoutes = require('./users/routes');
const crmRoutes = require('./crm/routes');
const cybersecurityRoutes = require('./cybersecurity/routes');
const businessformationRoutes = require('./businessformation/routes');
const llcRoutes = require('./llc/routes');
const ltdRoutes = require('./ltd/routes');
const itinRoutes = require('./itin/routes');
const paymentsRoutes = require('./payments/routes');
const domainsRoutes = require('./domains/routes');
const careersRoutes = require('./careers/routes');
const blogRoutes = require('./blog/routes');
const toolsRoutes = require('./tools/routes');
const analyticsRoutes = require('./analytics/routes');
const notificationsRoutes = require('./notifications/routes');
const settingsRoutes = require('./settings/routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/cybersecurity', cybersecurityRoutes);
app.use('/api/businessformation', businessformationRoutes);
app.use('/api/llc', llcRoutes);
app.use('/api/ltd', ltdRoutes);
app.use('/api/itin', itinRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/domains', domainsRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/settings', settingsRoutes);

// ===== BACKWARD COMPATIBILITY ALIAS ROUTES =====
const notificationsController = require('./notifications/controller');
const toolsController = require('./tools/controller');
const authController = require('./auth/controller');

// Contact Form Legacy Endpoint
app.post('/api/contact', notificationsController.submitContactForm);

// Subscription Legacy Endpoint
app.post('/api/subscribe', notificationsController.subscribeNewsletter);

// Auth Legacy Endpoints
app.post('/api/admin/authenticate', authController.login);

// Legacy Auth Session check
app.get('/api/admin/check', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = (authHeader && authHeader.split(' ')[1]) || req.headers['x-session-token'];

    if (!token) {
        return res.status(401).json({ success: false, authenticated: false, message: 'Token required' });
    }

    try {
        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'SpectraOpsSuperSecretJWTKey2026';
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({
            success: true,
            authenticated: true,
            isLoggedIn: true,
            user: decoded.username,
            role: decoded.role
        });
    } catch (err) {
        return res.status(401).json({ success: false, authenticated: false, message: 'Invalid session' });
    }
});

// Admin dashboard overview
app.get('/api/admin/dashboard', authenticateToken, async (req, res) => {
    try {
        const totalContacts = await db.get('SELECT COUNT(*) as count FROM contact_submissions');
        const recent = await db.get("SELECT COUNT(*) as count FROM contact_submissions WHERE created_at >= datetime('now', '-7 days')");
        const toolsUsed = await db.get('SELECT COUNT(*) as count FROM security_tool_usage');

        return res.json({
            success: true,
            data: {
                totalContacts: totalContacts.count,
                newThisWeek: recent.count,
                securityToolsUsed: toolsUsed.count,
                avgResponseTime: '1.1s'
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// Admin contact submissions messages list
app.get('/api/admin/messages', authenticateToken, async (req, res) => {
    try {
        const contacts = await db.all('SELECT * FROM contact_submissions ORDER BY id DESC');
        return res.json({ success: true, contacts: contacts, subscribers: [] });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// Legacy tools endpoints
app.post('/api/check-breach', toolsController.checkEmailBreach);
app.post('/api/check-password', toolsController.checkPassword);
app.post('/api/scan-url', toolsController.scanUrl);

// Health check endpoint has been moved before the rate limiter to prevent 429 Too Many Requests errors

// Serve static assets from React production build first, fallback to source/legacy
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.static(path.join(__dirname, '../frontend')));

// Handle all SPA frontend routing to fallback (serves React production bundle build index.html if exists)
app.get('*', (req, res) => {
    const buildPath = path.join(__dirname, '../frontend/dist/index.html');
    const legacyPath = path.join(__dirname, '../frontend/index.html');
    const fs = require('fs');
    if (fs.existsSync(buildPath)) {
        res.sendFile(buildPath);
    } else {
        res.sendFile(legacyPath);
    }
});

// Start Server
app.listen(PORT, () => {
    console.log('='.repeat(80));
    console.log('🚀 SPECTRAOPS ENTERPRISE PLATFORM BACKEND OPERATIONAL');
    console.log('='.repeat(80));
    console.log(`🌐 API Server: http://localhost:${PORT}`);
    console.log(`💊 Health Check: http://localhost:${PORT}/api/health`);
    console.log('='.repeat(80));
});