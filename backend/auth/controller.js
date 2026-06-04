const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'SpectraOpsSuperSecretJWTKey2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'SpectraOpsSuperSecretJWTRefreshKey2026';
const ACCESS_TOKEN_EXPIRY = '15m'; // Short-lived access token
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

class AuthController {
    // Basic login with username and password
    async login(req, res) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username and password are required' });
        }

        try {
            // Find user in database
            const user = await db.get('SELECT * FROM admin_users WHERE username = ? AND is_active = 1', [username]);
            
            if (!user) {
                return res.status(401).json({ success: false, error: 'Invalid username or password' });
            }

            // Verify password
            const passwordMatch = await bcrypt.compare(password, user.password_hash);
            if (!passwordMatch) {
                // Log failed attempt if necessary
                return res.status(401).json({ success: false, error: 'Invalid username or password' });
            }

            // Check if user has MFA setup
            const mfa = await db.get('SELECT * FROM user_mfa WHERE user_id = ? AND mfa_enabled = 1', [user.id]);

            if (mfa) {
                // Require MFA verification step
                // Return a temporary transaction token
                const tempToken = jwt.sign(
                    { userId: user.id, mfaRequired: true },
                    JWT_SECRET,
                    { expiresIn: '5m' }
                );

                return res.json({
                    success: true,
                    mfaRequired: true,
                    tempToken: tempToken,
                    message: 'Multi-factor authentication required'
                });
            }

            // MFA is not enabled, generate tokens and log in directly
            const tokens = await AuthController.generateUserTokens(user);

            // Log login activity
            await db.run('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
            await AuthController.logActivity(user.id, 'Admin Login', `User ${user.username} logged in successfully (MFA disabled).`, req);

            return res.json({
                success: true,
                mfaRequired: false,
                ...tokens,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullName: user.full_name,
                    role: user.role
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ success: false, error: 'Internal server error during login' });
        }
    }

    // Verify MFA token
    async verifyMfa(req, res) {
        const { tempToken, mfaToken } = req.body;

        if (!tempToken || !mfaToken) {
            return res.status(400).json({ success: false, error: 'Temporary token and MFA token are required' });
        }

        try {
            // Verify temp token
            let decoded;
            try {
                decoded = jwt.verify(tempToken, JWT_SECRET);
            } catch (err) {
                return res.status(401).json({ success: false, error: 'Temporary token expired or invalid' });
            }

            if (!decoded.mfaRequired || !decoded.userId) {
                return res.status(400).json({ success: false, error: 'Invalid authentication context' });
            }

            // Get user and MFA secret
            const user = await db.get('SELECT * FROM admin_users WHERE id = ?', [decoded.userId]);
            const mfa = await db.get('SELECT * FROM user_mfa WHERE user_id = ? AND mfa_enabled = 1', [decoded.userId]);

            if (!user || !mfa) {
                return res.status(401).json({ success: false, error: 'Invalid user or MFA settings' });
            }

            // Verify TOTP token
            const verified = speakeasy.totp.verify({
                secret: mfa.mfa_secret,
                encoding: 'base32',
                token: mfaToken,
                window: 1 // Allow 30 seconds clock drift
            });

            if (!verified) {
                return res.status(401).json({ success: false, error: 'Invalid authentication code' });
            }

            // Generate full tokens
            const tokens = await AuthController.generateUserTokens(user);

            // Log activity
            await db.run('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
            await AuthController.logActivity(user.id, 'Admin MFA Login', `User ${user.username} authenticated with MFA.`, req);

            return res.json({
                success: true,
                ...tokens,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullName: user.full_name,
                    role: user.role
                }
            });

        } catch (error) {
            console.error('MFA verification error:', error);
            return res.status(500).json({ success: false, error: 'Internal server error during MFA verification' });
        }
    }

    // Setup MFA - Generate Secret & QR Code (requires authentication)
    async setupMfa(req, res) {
        const userId = req.user.id;

        try {
            const user = await db.get('SELECT * FROM admin_users WHERE id = ?', [userId]);
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            // Generate secret
            const secret = speakeasy.generateSecret({
                name: `SpectraOps:${user.email}`,
                issuer: 'SpectraOps Ltd'
            });

            // Generate QR Code URL
            const qrImageUrl = await qrcode.toDataURL(secret.otpauth_url);

            // Temporarily store secret in user_mfa (mfa_enabled = 0 until verified)
            // Remove any old incomplete secrets
            await db.run('DELETE FROM user_mfa WHERE user_id = ? AND mfa_enabled = 0', [userId]);
            
            // Insert new secret
            await db.run(
                'INSERT INTO user_mfa (user_id, mfa_secret, mfa_enabled) VALUES (?, ?, 0)',
                [userId, secret.base32]
            );

            return res.json({
                success: true,
                secret: secret.base32,
                qrCode: qrImageUrl
            });

        } catch (error) {
            console.error('MFA setup error:', error);
            return res.status(500).json({ success: false, error: 'Failed to generate MFA credentials' });
        }
    }

    // Activate MFA - Verify token and finalize activation
    async activateMfa(req, res) {
        const userId = req.user.id;
        const { mfaToken } = req.body;

        if (!mfaToken) {
            return res.status(400).json({ success: false, error: 'MFA token is required' });
        }

        try {
            // Find temporary secret
            const mfa = await db.get('SELECT * FROM user_mfa WHERE user_id = ? AND mfa_enabled = 0', [userId]);

            if (!mfa) {
                return res.status(404).json({ success: false, error: 'No pending MFA setup found. Generate key first.' });
            }

            // Verify token
            const verified = speakeasy.totp.verify({
                secret: mfa.mfa_secret,
                encoding: 'base32',
                token: mfaToken,
                window: 1
            });

            if (!verified) {
                return res.status(400).json({ success: false, error: 'Invalid verification token' });
            }

            // Enable MFA and generate backup codes
            const backupCodes = Array.from({ length: 5 }, () => crypto.randomBytes(4).toString('hex'));
            const backupCodesHash = await bcrypt.hash(backupCodes.join(','), 10);

            // Clean existing enabled MFA settings
            await db.run('DELETE FROM user_mfa WHERE user_id = ? AND mfa_enabled = 1', [userId]);

            // Update this setup to active
            await db.run(
                'UPDATE user_mfa SET mfa_enabled = 1, backup_codes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [backupCodesHash, mfa.id]
            );

            await AuthController.logActivity(userId, 'MFA Enabled', 'User enabled Multi-Factor Authentication.', req);

            return res.json({
                success: true,
                message: 'Multi-factor authentication activated successfully',
                backupCodes: backupCodes
            });

        } catch (error) {
            console.error('MFA activation error:', error);
            return res.status(500).json({ success: false, error: 'Failed to activate MFA' });
        }
    }

    // Disable MFA
    async disableMfa(req, res) {
        const userId = req.user.id;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, error: 'Password confirmation is required' });
        }

        try {
            const user = await db.get('SELECT * FROM admin_users WHERE id = ?', [userId]);
            const passwordMatch = await bcrypt.compare(password, user.password_hash);

            if (!passwordMatch) {
                return res.status(401).json({ success: false, error: 'Incorrect password confirmation' });
            }

            await db.run('DELETE FROM user_mfa WHERE user_id = ?', [userId]);
            await AuthController.logActivity(userId, 'MFA Disabled', 'User disabled Multi-Factor Authentication.', req);

            return res.json({ success: true, message: 'Multi-factor authentication disabled' });

        } catch (error) {
            console.error('Disable MFA error:', error);
            return res.status(500).json({ success: false, error: 'Failed to disable MFA' });
        }
    }

    // Refresh token rotation
    async refresh(req, res) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ success: false, error: 'Refresh token is required' });
        }

        try {
            // Verify signature
            let decoded;
            try {
                decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
            } catch (err) {
                return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
            }

            // Check if token exists in DB and is not revoked
            const tokenRecord = await db.get(
                'SELECT * FROM refresh_tokens WHERE token = ? AND revoked = 0 AND expires_at > CURRENT_TIMESTAMP',
                [refreshToken]
            );

            if (!tokenRecord) {
                return res.status(401).json({ success: false, error: 'Revoked or invalid refresh token' });
            }

            // Get user
            const user = await db.get('SELECT * FROM admin_users WHERE id = ? AND is_active = 1', [tokenRecord.user_id]);
            if (!user) {
                return res.status(401).json({ success: false, error: 'User account is inactive or deleted' });
            }

            // Revoke current refresh token (one-time use rotation)
            await db.run('UPDATE refresh_tokens SET revoked = 1 WHERE id = ?', [tokenRecord.id]);

            // Generate new token pair
            const tokens = await AuthController.generateUserTokens(user);

            return res.json({
                success: true,
                ...tokens
            });

        } catch (error) {
            console.error('Refresh token error:', error);
            return res.status(500).json({ success: false, error: 'Internal server error during token refresh' });
        }
    }

    // Logout
    async logout(req, res) {
        const { refreshToken } = req.body;

        try {
            if (refreshToken) {
                // Revoke refresh token
                await db.run('UPDATE refresh_tokens SET revoked = 1 WHERE token = ?', [refreshToken]);
            }

            if (req.user) {
                await AuthController.logActivity(req.user.id, 'Admin Logout', 'User logged out.', req);
            }

            return res.json({ success: true, message: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout error:', error);
            return res.status(500).json({ success: false, error: 'Logout failed' });
        }
    }

    // Helper: Generate Access and Refresh Tokens
    static async generateUserTokens(user) {
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d` });

        // Save refresh token to DB
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

        await db.run(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            [user.id, refreshToken, expiresAt.toISOString()]
        );

        return { accessToken, refreshToken };
    }

    // Helper: Log User Activity in Audit Logs
    static async logActivity(userId, action, details, req) {
        try {
            await db.run(
                `INSERT INTO website_analytics (
                    page_url, visitor_ip, user_agent, referrer, actions_taken
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    '/api/admin/auth',
                    req.ip || '127.0.0.1',
                    req.get('User-Agent') || 'Unknown',
                    req.get('Referrer') || 'Direct',
                    JSON.stringify({ userId, action, details })
                ]
            );
        } catch (err) {
            console.error('Activity logging error:', err);
        }
    }
}

module.exports = new AuthController();
