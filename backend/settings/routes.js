const express = require('express');
const SettingsController = require('./controller');
const { authenticateToken, requireRole } = require('../auth/middleware');

const router = express.Router();

// Settings edits are highly sensitive and require Super Admin permission
router.get('/', authenticateToken, requireRole('super-admin'), SettingsController.getSettings);
router.put('/', authenticateToken, requireRole('super-admin'), SettingsController.updateSettings);

module.exports = router;
