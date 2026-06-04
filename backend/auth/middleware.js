const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'SpectraOpsSuperSecretJWTKey2026';

// Middleware to authenticate JWT tokens
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = (authHeader && authHeader.split(' ')[1]) || req.headers['x-session-token'];

    if (!token) {
        return res.status(401).json({ success: false, error: 'Authentication token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (decoded.mfaRequired) {
            return res.status(403).json({ success: false, error: 'Multi-factor authentication required to complete action' });
        }

        req.user = {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role
        };
        
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(403).json({ success: false, error: 'Session expired or invalid token' });
    }
}

// Middleware to enforce specific roles (RBAC)
function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        const userRole = req.user.role;

        // If it's a single role string, convert to array
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        // Super-admin always bypasses role checks
        if (userRole === 'super-admin' || userRole === 'super_admin') {
            return next();
        }

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                success: false, 
                error: 'Forbidden: You do not have permission to perform this action' 
            });
        }

        next();
    };
}

module.exports = {
    authenticateToken,
    requireRole
};
