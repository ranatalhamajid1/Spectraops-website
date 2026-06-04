const express = require('express');
const BlogController = require('./controller');
const { authenticateToken, requireRole } = require('../auth/middleware');

const router = express.Router();

// Public routes (for blog readers)
router.get('/', BlogController.getPublishedPosts);
router.get('/post/:slug', BlogController.getPostBySlug);

// Protected routes (for Editors / Content Managers / Administrators)
const editorRoles = ['admin', 'super-admin', 'content-manager'];

router.get('/admin', authenticateToken, requireRole(editorRoles), BlogController.getAllPosts);
router.post('/admin', authenticateToken, requireRole(editorRoles), BlogController.createPost);
router.put('/admin/:id', authenticateToken, requireRole(editorRoles), BlogController.updatePost);
router.delete('/admin/:id', authenticateToken, requireRole(editorRoles), BlogController.deletePost);

module.exports = router;
