const express = require('express');
const fs = require('fs');
const path = require('path');
const Post = require('../models/Post');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get all published posts (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Filter by search or category if provided
    let filter = { isPublished: true };
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Post.countDocuments(filter);

    res.json({ posts, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
});

// Admin: Get all posts (including drafts)
router.get('/admin', authMiddleware, adminOnly, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin posts', error: error.message });
  }
});

// Get single post (public)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || !post.isPublished) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
});

// Create blog post (admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, summary, content, category, tags, image, isPublished } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    const post = new Post({
      title,
      summary: summary || '',
      content,
      category,
      tags: tags || [],
      image,
      isPublished: isPublished || false,
    });

    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
});

// Update blog post (admin only)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, summary, content, category, tags, image, isPublished } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (title) post.title = title;
    if (summary !== undefined) post.summary = summary;
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) post.tags = tags;
    if (image) post.image = image;
    if (isPublished !== undefined) post.isPublished = isPublished;

    await post.save();
    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
});

// Delete blog post (admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete the associated cover image file if it exists
    if (post.image && post.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', post.image);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log(`Successfully deleted image: ${post.image}`);
        } catch (err) {
          console.error(`Failed to delete image file: ${post.image}`, err);
        }
      }
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
});

// Publish/Unpublish toggle (admin only)
router.patch('/:id/publish', authMiddleware, adminOnly, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.isPublished = !post.isPublished;
    await post.save();
    res.json({ message: `Post ${post.isPublished ? 'published' : 'unpublished'}`, post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle publish status', error: error.message });
  }
});

module.exports = router;
