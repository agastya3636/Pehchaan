const express = require('express');
const { query, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/artisans
// @desc    Get all verified artisans with filtering
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('state').optional().isString().withMessage('State must be a string'),
  query('city').optional().isString().withMessage('City must be a string'),
  query('craftType').optional().isString().withMessage('Craft type must be a string'),
  query('experience').optional().isString().withMessage('Experience must be a string'),
  query('sortBy').optional().isIn(['newest', 'rating', 'sales', 'name']).withMessage('Invalid sort option'),
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
    state,
    city,
    craftType,
    experience,
    sortBy = 'newest',
    search
  } = req.query;

  // Build filter object
  const filter = {
    role: 'artisan',
    'artisanProfile.isArtisan': true,
    'artisanProfile.isVerified': true,
    isActive: true,
    isBlocked: false
  };

  if (state && state !== 'All') {
    filter['address.state'] = new RegExp(state, 'i');
  }

  if (city && city !== 'All') {
    filter['address.city'] = new RegExp(city, 'i');
  }

  if (craftType && craftType !== 'All') {
    filter['artisanProfile.craftTypes'] = craftType;
  }

  if (experience && experience !== 'All') {
    filter['artisanProfile.experience'] = experience;
  }

  if (search) {
    filter.$or = [
      { firstName: new RegExp(search, 'i') },
      { lastName: new RegExp(search, 'i') },
      { 'artisanProfile.bio': new RegExp(search, 'i') }
    ];
  }

  // Build sort object
  let sort = {};
  switch (sortBy) {
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'rating':
      sort = { 'artisanProfile.rating.average': -1 };
      break;
    case 'sales':
      sort = { 'artisanProfile.totalSales': -1 };
      break;
    case 'name':
      sort = { firstName: 1 };
      break;
    default:
      sort = { createdAt: -1 };
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const artisans = await User.find(filter)
    .select('-password -refreshTokens -emailVerificationToken -passwordResetToken')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await User.countDocuments(filter);

  res.json({
    status: 'success',
    data: {
      artisans,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalArtisans: total,
        hasNext: skip + artisans.length < total,
        hasPrev: parseInt(page) > 1
      }
    }
  });
}));

// @route   GET /api/artisans/featured
// @desc    Get featured artisans
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;
  
  const artisans = await User.find({
    role: 'artisan',
    'artisanProfile.isArtisan': true,
    'artisanProfile.isVerified': true,
    isActive: true,
    isBlocked: false
  })
    .select('-password -refreshTokens')
    .sort({ 'artisanProfile.rating.average': -1, 'artisanProfile.totalSales': -1 })
    .limit(parseInt(limit));

  res.json({
    status: 'success',
    data: { artisans }
  });
}));

// @route   GET /api/artisans/stats
// @desc    Get artisan statistics
// @access  Public
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await User.aggregate([
    {
      $match: {
        role: 'artisan',
        'artisanProfile.isArtisan': true,
        isActive: true,
        isBlocked: false
      }
    },
    {
      $group: {
        _id: null,
        totalArtisans: { $sum: 1 },
        verifiedArtisans: {
          $sum: { $cond: [{ $eq: ['$artisanProfile.isVerified', true] }, 1, 0] }
        },
        averageRating: { $avg: '$artisanProfile.rating.average' },
        totalSales: { $sum: '$artisanProfile.totalSales' },
        totalEarnings: { $sum: '$artisanProfile.totalEarnings' }
      }
    }
  ]);

  // Get craft type distribution
  const craftTypes = await User.aggregate([
    {
      $match: {
        role: 'artisan',
        'artisanProfile.isArtisan': true,
        isActive: true,
        isBlocked: false
      }
    },
    { $unwind: '$artisanProfile.craftTypes' },
    {
      $group: {
        _id: '$artisanProfile.craftTypes',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  // Get state distribution
  const states = await User.aggregate([
    {
      $match: {
        role: 'artisan',
        'artisanProfile.isArtisan': true,
        isActive: true,
        isBlocked: false
      }
    },
    {
      $group: {
        _id: '$address.state',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.json({
    status: 'success',
    data: {
      stats: stats[0] || {
        totalArtisans: 0,
        verifiedArtisans: 0,
        averageRating: 0,
        totalSales: 0,
        totalEarnings: 0
      },
      craftTypes,
      states
    }
  });
}));

// @route   GET /api/artisans/:id
// @desc    Get single artisan by ID
// @access  Public
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const artisan = await User.findOne({
    _id: req.params.id,
    role: 'artisan',
    'artisanProfile.isArtisan': true,
    isActive: true,
    isBlocked: false
  }).select('-password -refreshTokens -emailVerificationToken -passwordResetToken');

  if (!artisan) {
    return res.status(404).json({
      status: 'error',
      message: 'Artisan not found'
    });
  }

  // Get artisan's products
  const products = await Product.find({
    artisan: req.params.id,
    status: 'active'
  })
    .select('name price images averageRating totalReviews')
    .sort({ createdAt: -1 })
    .limit(12);

  res.json({
    status: 'success',
    data: { 
      artisan,
      products
    }
  });
}));

// @route   GET /api/artisans/:id/products
// @desc    Get artisan's products
// @access  Public
router.get('/:id/products', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Check if artisan exists
  const artisan = await User.findOne({
    _id: req.params.id,
    role: 'artisan',
    'artisanProfile.isArtisan': true,
    isActive: true,
    isBlocked: false
  });

  if (!artisan) {
    return res.status(404).json({
      status: 'error',
      message: 'Artisan not found'
    });
  }

  const products = await Product.find({
    artisan: req.params.id,
    status: 'active'
  })
    .populate('artisan', 'firstName lastName artisanProfile.rating')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Product.countDocuments({
    artisan: req.params.id,
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

// @route   GET /api/artisans/:id/reviews
// @desc    Get artisan reviews
// @access  Public
router.get('/:id/reviews', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Check if artisan exists
  const artisan = await User.findOne({
    _id: req.params.id,
    role: 'artisan',
    'artisanProfile.isArtisan': true,
    isActive: true,
    isBlocked: false
  });

  if (!artisan) {
    return res.status(404).json({
      status: 'error',
      message: 'Artisan not found'
    });
  }

  // Get reviews from artisan's products
  const reviews = await Product.aggregate([
    {
      $match: {
        artisan: req.params.id,
        status: 'active',
        'reviews.0': { $exists: true }
      }
    },
    { $unwind: '$reviews' },
    {
      $lookup: {
        from: 'users',
        localField: 'reviews.user',
        foreignField: '_id',
        as: 'reviewer'
      }
    },
    { $unwind: '$reviewer' },
    {
      $project: {
        _id: '$reviews._id',
        rating: '$reviews.rating',
        comment: '$reviews.comment',
        images: '$reviews.images',
        isVerified: '$reviews.isVerified',
        helpful: '$reviews.helpful',
        createdAt: '$reviews.createdAt',
        reviewer: {
          firstName: '$reviewer.firstName',
          lastName: '$reviewer.lastName',
          profileImage: '$reviewer.profileImage'
        },
        product: {
          name: '$name',
          images: '$images'
        }
      }
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: parseInt(limit) }
  ]);

  const total = await Product.aggregate([
    {
      $match: {
        artisan: req.params.id,
        status: 'active',
        'reviews.0': { $exists: true }
      }
    },
    { $unwind: '$reviews' },
    { $count: 'total' }
  ]);

  res.json({
    status: 'success',
    data: {
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil((total[0]?.total || 0) / parseInt(limit)),
        totalReviews: total[0]?.total || 0
      }
    }
  });
}));

// @route   GET /api/artisans/craft-types
// @desc    Get all craft types
// @access  Public
router.get('/craft-types', asyncHandler(async (req, res) => {
  const craftTypes = await User.distinct('artisanProfile.craftTypes', {
    role: 'artisan',
    'artisanProfile.isArtisan': true,
    'artisanProfile.craftTypes': { $exists: true, $ne: [] }
  });

  res.json({
    status: 'success',
    data: { craftTypes }
  });
}));

// @route   GET /api/artisans/experience-levels
// @desc    Get all experience levels
// @access  Public
router.get('/experience-levels', asyncHandler(async (req, res) => {
  const experienceLevels = await User.distinct('artisanProfile.experience', {
    role: 'artisan',
    'artisanProfile.isArtisan': true,
    'artisanProfile.experience': { $exists: true, $ne: null }
  });

  res.json({
    status: 'success',
    data: { experienceLevels }
  });
}));

// @route   GET /api/artisans/regions
// @desc    Get all regions with artisan counts
// @access  Public
router.get('/regions', asyncHandler(async (req, res) => {
  const regions = await User.aggregate([
    {
      $match: {
        role: 'artisan',
        'artisanProfile.isArtisan': true,
        isActive: true,
        isBlocked: false
      }
    },
    {
      $group: {
        _id: {
          state: '$address.state',
          city: '$address.city'
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

module.exports = router;
