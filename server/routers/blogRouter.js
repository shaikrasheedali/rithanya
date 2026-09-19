const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

// Public
router.get('/', blogController.getBlogs);
router.get('/:slug', blogController.getBlogBySlug);

// Admin CMS
router.post('/', authenticate, requirePermission('blogs'), blogController.createBlog);
router.put('/:id', authenticate, requirePermission('blogs'), blogController.updateBlog);
router.delete('/:id', authenticate, requirePermission('blogs'), blogController.deleteBlog);

module.exports = router;
