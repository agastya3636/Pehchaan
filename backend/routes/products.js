const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Product = require('../models/Product');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('state').optional().isString().withMessage('State must be a string'),
  query('city').optional().isString().withMessage('City must be a string'),
  query('sortBy').optional().isIn(['newest', 'oldest', 'price-low', 'price-high', 'rating', 'popular']).withMessage('Invalid sort option'),
  query('featured').optional().isBoolean().withMessage('Featured must be boolean'),
  query('search').optional().isString().withMessage('Search must be a string')
], optionalAuth, asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const {
    page = 1,
    limit = 20,
    category,
    minPrice,
    maxPrice,
    state,
    city,
    sortBy = 'newest',
    featured,
    search
  } = req.query;

  // Build filter object
  const filter = {
    status: 'active',
    'inventory.quantity': { $gt: 0 }
  };

  if (category && category !== 'All') {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  if (state && state !== 'All') {
    filter['region.state'] = new RegExp(state, 'i');
  }

  if (city && city !== 'All') {
    filter['region.city'] = new RegExp(city, 'i');
  }

  if (featured === 'true') {
    filter.isFeatured = true;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  // Build sort object
  let sort = {};
  switch (sortBy) {
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'oldest':
      sort = { createdAt: 1 };
      break;
    case 'price-low':
      sort = { price: 1 };
      break;
    case 'price-high':
      sort = { price: -1 };
      break;
    case 'rating':
      sort = { averageRating: -1 };
      break;
    case 'popular':
      sort = { views: -1 };
      break;
    default:
      sort = { createdAt: -1 };
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const products = await Product.find(filter)
    .populate('artisan', 'firstName lastName artisanProfile.rating artisanProfile.isVerified')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Product.countDocuments(filter);

  res.json({
    status: 'success',
    data: {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: parseInt(page) > 1
      }
    }
  });
}));

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;
  
  const products = await Product.findFeatured(parseInt(limit));

  res.json({
    status: 'success',
    data: { products }
  });
}));

// @route   GET /api/products/categories
// @desc    Get all product categories
// @access  Public
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  
  res.json({
    status: 'success',
    data: { categories }
  });
}));

// @route   GET /api/products/regions
// @desc    Get all regions with product counts
// @access  Public
router.get('/regions', asyncHandler(async (req, res) => {
  const regions = await Product.aggregate([
    {
      $match: {
        status: 'active',
        'inventory.quantity': { $gt: 0 }
      }
    },
    {
      $group: {
        _id: {
          state: '$region.state',
          city: '$region.city'
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 50
    }
  ]);

  res.json({
    status: 'success',
    data: { regions }
  });
}));

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('artisan', 'firstName lastName artisanProfile artisanProfile.rating artisanProfile.isVerified');

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  // Increment view count
  product.views += 1;
  await product.save();

  res.json({
    status: 'success',
    data: { product }
  });
}));

// @route   GET /api/products/slug/:slug
// @desc    Get single product by slug
// @access  Public
router.get('/slug/:slug', optionalAuth, asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('artisan', 'firstName lastName artisanProfile artisanProfile.rating artisanProfile.isVerified');

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  // Increment view count
  product.views += 1;
  await product.save();

  res.json({
    status: 'success',
    data: { product }
  });
}));

// @route   GET /api/products/artisan/:artisanId
// @desc    Get products by artisan
// @access  Public
router.get('/artisan/:artisanId', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const products = await Product.find({
    artisan: req.params.artisanId,
    status: 'active'
  })
    .populate('artisan', 'firstName lastName artisanProfile.rating')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Product.countDocuments({
    artisan: req.params.artisanId,
    status: 'active'
  });

  res.json({
    status: 'success',
    data: {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total
      }
    }
  });
}));

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const products = await Product.findByCategory(req.params.category, parseInt(limit));

  res.json({
    status: 'success',
    data: { products }
  });
}));

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;

  if (!q) {
    return res.status(400).json({
      status: 'error',
      message: 'Search query is required'
    });
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const products = await Product.search(q, {
    status: 'active',
    'inventory.quantity': { $gt: 0 }
  })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Product.countDocuments({
    $text: { $search: q },
    status: 'active',
    'inventory.quantity': { $gt: 0 }
  });

  res.json({
    status: 'success',
    data: {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total
      }
    }
  });
}));

// @route   POST /api/products/:id/like
// @desc    Like/unlike a product
// @access  Private
router.post('/:id/like', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  // TODO: Implement like functionality with user tracking
  product.likes += 1;
  await product.save();

  res.json({
    status: 'success',
    message: 'Product liked',
    data: { likes: product.likes }
  });
}));

// @route   POST /api/products/:id/review
// @desc    Add product review
// @access  Private
router.post('/:id/review', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().withMessage('Comment must be a string')
], asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  // Check if user already reviewed this product
  const existingReview = product.reviews.find(
    review => review.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    return res.status(400).json({
      status: 'error',
      message: 'You have already reviewed this product'
    });
  }

  // Add review
  product.reviews.push({
    user: req.user._id,
    rating,
    comment,
    isVerified: true // TODO: Implement verification logic
  });

  await product.save();

  res.json({
    status: 'success',
    message: 'Review added successfully',
    data: { 
      averageRating: product.averageRating,
      totalReviews: product.totalReviews
    }
  });
}));

// @route   GET /api/products/:id/reviews
// @desc    Get product reviews
// @access  Public
router.get('/:id/reviews', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const product = await Product.findById(req.params.id)
    .select('reviews averageRating totalReviews')
    .populate('reviews.user', 'firstName lastName profileImage');

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  const reviews = product.reviews
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(skip, skip + parseInt(limit));

  res.json({
    status: 'success',
    data: {
      reviews,
      averageRating: product.averageRating,
      totalReviews: product.totalReviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(product.reviews.length / parseInt(limit)),
        totalReviews: product.reviews.length
      }
    }
  });
}));

module.exports = router;
