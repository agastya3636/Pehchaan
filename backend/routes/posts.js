const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Validation rules
const createPostValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('content').trim().notEmpty().withMessage('Content is required').isLength({ max: 2000 }).withMessage('Content must be less than 2000 characters'),
  body('category').optional().isIn(['general', 'craft', 'technique', 'story', 'question', 'announcement']).withMessage('Invalid category'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('images').optional().isArray().withMessage('Images must be an array')
];

const commentValidation = [
  body('content').trim().notEmpty().withMessage('Comment content is required').isLength({ max: 500 }).withMessage('Comment must be less than 500 characters')
];

// @route   GET /api/posts
// @desc    Get all posts with pagination and filters
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    author,
    tags,
    region,
    search,
    sort = 'newest'
  } = req.query;

  const filters = {};
  if (category) filters.category = category;
  if (author) filters.author = author;
  if (tags) filters.tags = tags.split(',');
  if (region) filters.region = region;
  if (search) filters.search = search;

  const result = await Post.getPosts(filters, parseInt(page), parseInt(limit));

  res.json({
    status: 'success',
    data: result
  });
}));

// @route   GET /api/posts/:id
// @desc    Get single post by ID
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'firstName lastName avatar')
    .populate('comments.author', 'firstName lastName avatar')
    .populate('likes.user', 'firstName lastName')
    .populate('shares.user', 'firstName lastName');

  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post not found'
    });
  }

  // Increment view count
  post.viewCount += 1;
  await post.save();

  res.json({
    status: 'success',
    data: { post }
  });
}));

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authenticateToken, createPostValidation, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { title, content, images = [], tags = [], category = 'general' } = req.body;

  const postData = {
    author: req.user.id,
    authorName: `${req.user.firstName} ${req.user.lastName}`,
    authorAvatar: req.user.avatar || null,
    title,
    content,
    images,
    tags,
    category,
    region: {
      state: req.user.address?.state || 'Maharashtra',
      city: req.user.address?.city || 'Mumbai',
      pincode: req.user.address?.pincode || '400001'
    }
  };

  const post = new Post(postData);
  await post.save();

  await post.populate('author', 'firstName lastName avatar');

  res.status(201).json({
    status: 'success',
    message: 'Post created successfully',
    data: { post }
  });
}));

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private (Author only)
router.put('/:id', authenticateToken, createPostValidation, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post not found'
    });
  }

  // Check if user is the author
  if (post.author.toString() !== req.user.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to update this post'
    });
  }

  const { title, content, images, tags, category } = req.body;

  post.title = title || post.title;
  post.content = content || post.content;
  post.images = images || post.images;
  post.tags = tags || post.tags;
  post.category = category || post.category;

  await post.save();

  res.json({
    status: 'success',
    message: 'Post updated successfully',
    data: { post }
  });
}));

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (Author only)
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post not found'
    });
  }

  // Check if user is the author
  if (post.author.toString() !== req.user.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to delete this post'
    });
  }

  await Post.findByIdAndDelete(req.params.id);

  res.json({
    status: 'success',
    message: 'Post deleted successfully'
  });
}));

// @route   POST /api/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/:id/like', authenticateToken, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post not found'
    });
  }

  const existingLike = post.likes.find(like => like.user.toString() === req.user.id);

  if (existingLike) {
    // Unlike
    post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
  } else {
    // Like
    post.likes.push({ user: req.user.id });
  }

  await post.save();

  res.json({
    status: 'success',
    message: existingLike ? 'Post unliked' : 'Post liked',
    data: {
      liked: !existingLike,
      likeCount: post.likeCount
    }
  });
}));

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comment', authenticateToken, commentValidation, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post not found'
    });
  }

  const { content } = req.body;

  const comment = {
    author: req.user.id,
    authorName: `${req.user.firstName} ${req.user.lastName}`,
    authorAvatar: req.user.avatar || null,
    content
  };

  post.comments.push(comment);
  await post.save();

  res.status(201).json({
    status: 'success',
    message: 'Comment added successfully',
    data: { comment }
  });
}));

// @route   POST /api/posts/:id/share
// @desc    Share a post
// @access  Private
router.post('/:id/share', authenticateToken, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post not found'
    });
  }

  // Check if already shared by this user
  const existingShare = post.shares.find(share => share.user.toString() === req.user.id);
  if (existingShare) {
    return res.status(400).json({
      status: 'error',
      message: 'Post already shared by this user'
    });
  }

  post.shares.push({ user: req.user.id });
  await post.save();

  res.json({
    status: 'success',
    message: 'Post shared successfully',
    data: {
      shareCount: post.shareCount
    }
  });
}));

// @route   GET /api/posts/trending
// @desc    Get trending posts
// @access  Public
router.get('/trending', asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const posts = await Post.find({ status: 'published' })
    .populate('author', 'firstName lastName avatar')
    .sort({ engagementScore: -1, createdAt: -1 })
    .limit(parseInt(limit))
    .lean();

  res.json({
    status: 'success',
    data: { posts }
  });
}));

// @route   GET /api/posts/featured
// @desc    Get featured posts
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const posts = await Post.find({ 
    status: 'published', 
    isFeatured: true 
  })
    .populate('author', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .lean();

  res.json({
    status: 'success',
    data: { posts }
  });
}));

module.exports = router;
