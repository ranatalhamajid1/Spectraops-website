const express = require('express');
const CrmController = require('./controller');
const { authenticateToken, requireRole } = require('../auth/middleware');

const router = express.Router();

// CRM routes require session authorization
router.use(authenticateToken);

// Leads endpoints
router.get('/leads', requireRole(['admin', 'super-admin', 'sales', 'support']), CrmController.getLeads);
router.get('/leads/:id', requireRole(['admin', 'super-admin', 'sales', 'support']), CrmController.getLeadById);
router.post('/leads', CrmController.createLead);
router.put('/leads/:id', requireRole(['admin', 'super-admin', 'sales', 'support']), CrmController.updateLead);
router.patch('/leads/:id/status', requireRole(['admin', 'super-admin', 'sales', 'support']), CrmController.updateLeadStatus);

// Orders endpoints
router.get('/orders', requireRole(['admin', 'super-admin', 'sales', 'support', 'finance']), CrmController.getOrders);
router.post('/orders', CrmController.createOrder);
router.put('/orders/:id', requireRole(['admin', 'super-admin', 'sales', 'support', 'finance']), CrmController.updateOrder);

module.exports = router;
