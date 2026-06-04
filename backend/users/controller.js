const bcrypt = require('bcrypt');
const db = require('../config/database');

class UsersController {
    // List all users (Admins only)
    async getUsers(req, res) {
        try {
            const users = await db.all(
                'SELECT id, username, email, full_name, role, is_active, last_login, created_at FROM admin_users ORDER BY id DESC'
            );
            return res.json({ success: true, users });
        } catch (error) {
            console.error('getUsers error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch admin users' });
        }
    }

    // Get specific user profile
    async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await db.get(
                'SELECT id, username, email, full_name, role, is_active, last_login, created_at FROM admin_users WHERE id = ?',
                [id]
            );
            
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            return res.json({ success: true, user });
        } catch (error) {
            console.error('getUserById error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch user' });
        }
    }

    // Create a new user (Super-admin only)
    async createUser(req, res) {
        const { username, email, password, fullName, role } = req.body;

        if (!username || !email || !password || !fullName || !role) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        try {
            // Check if user already exists
            const existingUser = await db.get(
                'SELECT id FROM admin_users WHERE username = ? OR email = ?',
                [username, email]
            );

            if (existingUser) {
                return res.status(400).json({ success: false, error: 'Username or email already in use' });
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 12);

            // Insert into DB
            const result = await db.run(
                `INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active)
                 VALUES (?, ?, ?, ?, ?, 1)`,
                [username, email, passwordHash, fullName, role]
            );

            return res.status(201).json({
                success: true,
                message: 'User created successfully',
                userId: result.id
            });

        } catch (error) {
            console.error('createUser error:', error);
            return res.status(500).json({ success: false, error: 'Failed to create user' });
        }
    }

    // Update user details (Super-admin or self)
    async updateUser(req, res) {
        const { id } = req.params;
        const { email, fullName, password, role, isActive } = req.body;

        // Access control: only super-admin can change role or status, and users can update their own name/email/pass
        const isSuperAdmin = req.user.role === 'super-admin';
        const isSelf = parseInt(id) === req.user.id;

        if (!isSuperAdmin && !isSelf) {
            return res.status(403).json({ success: false, error: 'Unauthorized to update this user' });
        }

        try {
            const user = await db.get('SELECT * FROM admin_users WHERE id = ?', [id]);
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            const updates = [];
            const params = [];

            if (email) {
                updates.push('email = ?');
                params.push(email);
            }
            if (fullName) {
                updates.push('full_name = ?');
                params.push(fullName);
            }
            if (password) {
                const passwordHash = await bcrypt.hash(password, 12);
                updates.push('password_hash = ?');
                params.push(passwordHash);
            }

            // Super-admin only updates
            if (isSuperAdmin) {
                if (role) {
                    updates.push('role = ?');
                    params.push(role);
                }
                if (isActive !== undefined) {
                    updates.push('is_active = ?');
                    params.push(isActive ? 1 : 0);
                }
            }

            if (updates.length === 0) {
                return res.status(400).json({ success: false, error: 'No fields to update' });
            }

            updates.push('updated_at = CURRENT_TIMESTAMP');
            params.push(id); // For the WHERE clause

            await db.run(
                `UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`,
                params
            );

            return res.json({ success: true, message: 'User updated successfully' });

        } catch (error) {
            console.error('updateUser error:', error);
            return res.status(500).json({ success: false, error: 'Failed to update user' });
        }
    }

    // Delete user (Super-admin only)
    async deleteUser(req, res) {
        const { id } = req.params;

        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ success: false, error: 'You cannot delete your own account' });
        }

        try {
            const user = await db.get('SELECT * FROM admin_users WHERE id = ?', [id]);
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            // Remove user refresh tokens & mfa settings first
            await db.run('DELETE FROM refresh_tokens WHERE user_id = ?', [id]);
            await db.run('DELETE FROM user_mfa WHERE user_id = ?', [id]);
            
            // Delete user
            await db.run('DELETE FROM admin_users WHERE id = ?', [id]);

            return res.json({ success: true, message: 'User deleted successfully' });

        } catch (error) {
            console.error('deleteUser error:', error);
            return res.status(500).json({ success: false, error: 'Failed to delete user' });
        }
    }
}

module.exports = new UsersController();
