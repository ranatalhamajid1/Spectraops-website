const express = require('express');
const DomainsController = require('./controller');
const { authenticateToken, requireRole } = require('../auth/middleware');

const router = express.Router();

// Public ReadyTitles search routes
router.post('/search', DomainsController.searchDomain);

// Protected search history logs
router.get('/admin/history', authenticateToken, requireRole(['admin', 'super-admin']), DomainsController.getSearchHistory);

module.exports = router;
