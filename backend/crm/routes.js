const express = require('express');
const CrmController = require('./controller');
const { authenticateToken, requireRole } = require('../auth/middleware');

const router = express.Router();

// Public endpoints (no token required)
router.post('/leads', CrmController.createLead);
router.post('/orders', CrmController.createOrder);

// CRM routes require session authorization
router.use(authenticateToken);

// Leads endpoints (Protected)
router.get('/leads', requireRole(['admin', 'super-admin', 'sales', 'support']), CrmController.getLeads);
router.get('/leads/:id', requireRole(['admin', 'super-admin', 'sales', 'support']), CrmController.getLeadById);
router.put('/leads/:id', requireRole(['admin', 'super-admin', 'sales', 'support']), CrmController.updateLead);
router.patch('/leads/:id/status', requireRole(['admin', 'super-admin', 'sales', 'support']), CrmController.updateLeadStatus);

// Orders endpoints (Protected)
router.get('/orders', requireRole(['admin', 'super-admin', 'sales', 'support', 'finance']), CrmController.getOrders);
router.put('/orders/:id', requireRole(['admin', 'super-admin', 'sales', 'support', 'finance']), CrmController.updateOrder);

module.exports = router;
