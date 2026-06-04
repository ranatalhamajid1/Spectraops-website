const express = require('express');
const NotificationsController = require('./controller');
const { authenticateToken, requireRole } = require('../auth/middleware');

const router = express.Router();

// Public routes
router.post('/contact', NotificationsController.submitContactForm);
router.post('/subscribe', NotificationsController.subscribeNewsletter);

// Protected routes (Admins only)
router.get('/admin/logs', authenticateToken, requireRole(['admin', 'super-admin']), NotificationsController.getNotificationLogs);

module.exports = router;
