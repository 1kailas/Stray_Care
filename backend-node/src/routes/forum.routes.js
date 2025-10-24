import express from 'express';
import ForumPost from '../models/forumPost.model.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all forum posts
router.get('/', async (req, res, next) => {
  try {
    const { category, limit = 20, page = 1 } = req.query;
    
    const query = {};
    if (category) query.category = category;

    const posts = await ForumPost.find(query)
      .sort({ pinned: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await ForumPost.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create forum post
router.post('/', authenticate, async (req, res, next) => {
  try {
    const postData = {
      ...req.body,
      authorId: req.userId,
      authorName: req.user.name
    };

    const post = new ForumPost(postData);
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
});

// Add comment
router.post('/:id/comments', authenticate, async (req, res, next) => {
  try {
    const { content } = req.body;

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.locked) {
      return res.status(403).json({
        success: false,
        message: 'This post is locked'
      });
    }

    post.comments.push({
      id: new Date().getTime().toString(),
      content,
      authorId: req.userId,
      authorName: req.user.name
    });

    await post.save();

    res.json({
      success: true,
      message: 'Comment added',
      data: post
    });
  } catch (error) {
    next(error);
  }
});

export default router;
