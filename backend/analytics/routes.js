const express = require('express');
const AnalyticsController = require('./controller');
const { authenticateToken, requireRole } = require('../auth/middleware');

const router = express.Router();

// Public page visit logger
router.post('/visit', AnalyticsController.logVisit);

// Guarded admin analytics endpoints
router.get('/overview', authenticateToken, requireRole(['admin', 'super-admin']), AnalyticsController.getAdminOverview);
router.get('/traffic', authenticateToken, requireRole(['admin', 'super-admin']), AnalyticsController.getTrafficDetails);

module.exports = router;
