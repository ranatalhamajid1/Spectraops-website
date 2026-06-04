const express = require('express');
const AuthController = require('./controller');
const { authenticateToken } = require('./middleware');

const router = express.Router();

// Public auth endpoints
router.post('/login', AuthController.login);
router.post('/verify-mfa', AuthController.verifyMfa);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

// Guarded settings endpoints (require JWT authentication)
router.post('/setup-mfa', authenticateToken, AuthController.setupMfa);
router.post('/activate-mfa', authenticateToken, AuthController.activateMfa);
router.post('/disable-mfa', authenticateToken, AuthController.disableMfa);

// Verify current session token validity
router.get('/check', (req, res) => {
    // If we reach this point, authenticateToken middleware can verify the session,
    // but we can also do a passive check to return user details.
    const authHeader = req.headers['authorization'];
    const token = (authHeader && authHeader.split(' ')[1]) || req.headers['x-session-token'];

    if (!token) {
        return res.json({ success: true, authenticated: false });
    }

    try {
        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'SpectraOpsSuperSecretJWTKey2026';
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (decoded.mfaRequired) {
            return res.json({ success: true, authenticated: false, mfaRequired: true });
        }

        return res.json({
            success: true,
            authenticated: true,
            isLoggedIn: true,
            user: decoded.username,
            role: decoded.role,
            userId: decoded.id
        });
    } catch (err) {
        return res.json({ success: true, authenticated: false, error: 'Token expired' });
    }
});

module.exports = router;
