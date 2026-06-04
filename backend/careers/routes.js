const express = require('express');
const CareersController = require('./controller');
const { authenticateToken, requireRole } = require('../auth/middleware');

const router = express.Router();

// Public routes (for job candidates)
router.get('/jobs', CareersController.getActiveJobs);
router.post('/apply', CareersController.submitApplication);

// Protected routes (for HR / Administrators)
router.get('/admin/jobs', authenticateToken, requireRole(['admin', 'super-admin', 'hr']), CareersController.getAllJobs);
router.post('/admin/jobs', authenticateToken, requireRole(['admin', 'super-admin', 'hr']), CareersController.createJob);
router.put('/admin/jobs/:id', authenticateToken, requireRole(['admin', 'super-admin', 'hr']), CareersController.updateJob);

router.get('/admin/applications', authenticateToken, requireRole(['admin', 'super-admin', 'hr']), CareersController.getApplications);
router.put('/admin/applications/:id/status', authenticateToken, requireRole(['admin', 'super-admin', 'hr']), CareersController.updateApplicationStatus);

// Dashboard compatible endpoints (non-admin prefix, supports PUT/PATCH)
router.get('/applications', authenticateToken, requireRole(['admin', 'super-admin', 'hr']), CareersController.getApplications);
router.put('/applications/:id/status', authenticateToken, requireRole(['admin', 'super-admin', 'hr']), CareersController.updateApplicationStatus);
router.patch('/applications/:id/status', authenticateToken, requireRole(['admin', 'super-admin', 'hr']), CareersController.updateApplicationStatus);

module.exports = router;
