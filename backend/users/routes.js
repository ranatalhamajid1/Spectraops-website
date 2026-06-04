const express = require('express');
const UsersController = require('./controller');
const { authenticateToken, requireRole } = require('../auth/middleware');

const router = express.Router();

// All routes require token authentication
router.use(authenticateToken);

// Admin-level listings
router.get('/', requireRole(['admin', 'super-admin']), UsersController.getUsers);
router.get('/:id', UsersController.getUserById);

// Super-admin only operations
router.post('/', requireRole('super-admin'), UsersController.createUser);
router.delete('/:id', requireRole('super-admin'), UsersController.deleteUser);

// Self or Super-admin updates
router.put('/:id', UsersController.updateUser);

module.exports = router;
