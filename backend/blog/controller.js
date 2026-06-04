const db = require('../config/database');

class BlogController {
    // ===== PUBLIC PORTAL ENDPOINTS =====

    // Get all published posts (with category/tag filter)
    async getPublishedPosts(req, res) {
        const { category, tag } = req.query;
        let query = 'SELECT p.id, p.title, p.slug, p.category, p.tags, p.published_at, u.full_name as author_name FROM blog_posts p LEFT JOIN admin_users u ON p.author_id = u.id WHERE p.status = \'published\'';
        const params = [];

        if (category) {
            query += ' AND p.category = ?';
            params.push(category);
        }
        
        if (tag) {
            query += ' AND p.tags LIKE ?';
            params.push(`%${tag}%`);
        }

        query += ' ORDER BY p.published_at DESC';

        try {
            const posts = await db.all(query, params);
            return res.json({ success: true, posts });
        } catch (error) {
            console.error('getPublishedPosts error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch blog posts' });
        }
    }

    // Get post details by slug (includes full content)
    async getPostBySlug(req, res) {
        const { slug } = req.params;

        try {
            const post = await db.get(
                `SELECT p.*, u.full_name as author_name 
                 FROM blog_posts p 
                 LEFT JOIN admin_users u ON p.author_id = u.id 
                 WHERE p.slug = ? AND p.status = 'published'`,
                [slug]
            );

            if (!post) {
                return res.status(404).json({ success: false, error: 'Post not found' });
            }

            return res.json({ success: true, post });
        } catch (error) {
            console.error('getPostBySlug error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch post details' });
        }
    }

    // ===== ADMIN PORTAL ENDPOINTS =====

    // Get all posts (draft + published, Admin/Content Manager only)
    async getAllPosts(req, res) {
        try {
            const posts = await db.all(
                `SELECT p.*, u.full_name as author_name 
                 FROM blog_posts p 
                 LEFT JOIN admin_users u ON p.author_id = u.id 
                 ORDER BY p.id DESC`
            );
            return res.json({ success: true, posts });
        } catch (error) {
            console.error('getAllPosts error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch posts' });
        }
    }

    // Create a new post
    async createPost(req, res) {
        const { title, slug, content, category, tags, status } = req.body;
        const authorId = req.user.id;

        if (!title || !slug || !content) {
            return res.status(400).json({ success: false, error: 'Title, slug, and content are required' });
        }

        try {
            // Check if slug unique
            const existing = await db.get('SELECT id FROM blog_posts WHERE slug = ?', [slug]);
            if (existing) {
                return res.status(400).json({ success: false, error: 'Slug must be unique' });
            }

            const publishedAt = status === 'published' ? new Date().toISOString() : null;

            const result = await db.run(
                `INSERT INTO blog_posts (title, slug, content, category, tags, author_id, status, published_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    title,
                    slug.toLowerCase().replace(/\s+/g, '-'),
                    content,
                    category || 'news',
                    tags || '',
                    authorId,
                    status || 'draft',
                    publishedAt
                ]
            );

            return res.status(201).json({
                success: true,
                message: 'Post created successfully',
                postId: result.id
            });

        } catch (error) {
            console.error('createPost error:', error);
            return res.status(500).json({ success: false, error: 'Failed to create post' });
        }
    }

    // Update post
    async updatePost(req, res) {
        const { id } = req.params;
        const { title, slug, content, category, tags, status } = req.body;

        try {
            const post = await db.get('SELECT * FROM blog_posts WHERE id = ?', [id]);
            if (!post) {
                return res.status(404).json({ success: false, error: 'Post not found' });
            }

            const updates = [];
            const params = [];

            if (title) { updates.push('title = ?'); params.push(title); }
            if (slug) { updates.push('slug = ?'); params.push(slug.toLowerCase().replace(/\s+/g, '-')); }
            if (content) { updates.push('content = ?'); params.push(content); }
            if (category) { updates.push('category = ?'); params.push(category); }
            if (tags) { updates.push('tags = ?'); params.push(tags); }
            
            if (status) {
                updates.push('status = ?');
                params.push(status);
                
                // Set published date if status changing to published
                if (status === 'published' && post.status !== 'published') {
                    updates.push('published_at = CURRENT_TIMESTAMP');
                }
            }

            if (updates.length === 0) {
                return res.status(400).json({ success: false, error: 'No fields to update' });
            }

            updates.push('updated_at = CURRENT_TIMESTAMP');
            params.push(id);

            await db.run(
                `UPDATE blog_posts SET ${updates.join(', ')} WHERE id = ?`,
                params
            );

            return res.json({ success: true, message: 'Post updated successfully' });

        } catch (error) {
            console.error('updatePost error:', error);
            return res.status(500).json({ success: false, error: 'Failed to update post' });
        }
    }

    // Delete post
    async deletePost(req, res) {
        const { id } = req.params;

        try {
            const post = await db.get('SELECT * FROM blog_posts WHERE id = ?', [id]);
            if (!post) {
                return res.status(404).json({ success: false, error: 'Post not found' });
            }

            await db.run('DELETE FROM blog_posts WHERE id = ?', [id]);
            return res.json({ success: true, message: 'Post deleted successfully' });
        } catch (error) {
            console.error('deletePost error:', error);
            return res.status(500).json({ success: false, error: 'Failed to delete post' });
        }
    }
}

module.exports = new BlogController();
