const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -refreshTokens');
  
  res.json({
    status: 'success',
    data: { user }
  });
}));

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender'),
  body('preferences.language').optional().isIn(['en', 'hi']).withMessage('Invalid language'),
  body('preferences.currency').optional().isIn(['INR', 'USD', 'EUR']).withMessage('Invalid currency')
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

  const allowedUpdates = [
    'firstName', 'lastName', 'dateOfBirth', 'gender', 'address', 'preferences'
  ];
  
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select('-password -refreshTokens');

  res.json({
    status: 'success',
    message: 'Profile updated successfully',
    data: { user }
  });
}));

// @route   POST /api/users/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
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

  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');
  
  // Check current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      status: 'error',
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    status: 'success',
    message: 'Password changed successfully'
  });
}));

// @route   POST /api/users/upload-profile-image
// @desc    Upload profile image
// @access  Private
router.post('/upload-profile-image', asyncHandler(async (req, res) => {
  // TODO: Implement file upload with multer and cloudinary
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({
      status: 'error',
      message: 'Image URL is required'
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profileImage: imageUrl },
    { new: true }
  ).select('-password -refreshTokens');

  res.json({
    status: 'success',
    message: 'Profile image updated successfully',
    data: { user }
  });
}));

// @route   POST /api/users/become-artisan
// @desc    Convert user to artisan
// @access  Private
router.post('/become-artisan', [
  body('craftTypes').isArray().withMessage('Craft types must be an array'),
  body('experience').notEmpty().withMessage('Experience is required'),
  body('workshopDetails').optional().trim(),
  body('toolsUsed').optional().isArray().withMessage('Tools used must be an array'),
  body('materialsUsed').optional().isArray().withMessage('Materials used must be an array'),
  body('bio').optional().trim()
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

  const {
    craftTypes,
    experience,
    workshopDetails,
    toolsUsed,
    materialsUsed,
    bio
  } = req.body;

  // Check if user is already an artisan
  if (req.user.role === 'artisan' || req.user.artisanProfile?.isArtisan) {
    return res.status(400).json({
      status: 'error',
      message: 'User is already an artisan'
    });
  }

  // Update user to artisan
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      role: 'artisan',
      'artisanProfile.isArtisan': true,
      'artisanProfile.craftTypes': craftTypes,
      'artisanProfile.experience': experience,
      'artisanProfile.workshopDetails': workshopDetails,
      'artisanProfile.toolsUsed': toolsUsed || [],
      'artisanProfile.materialsUsed': materialsUsed || [],
      'artisanProfile.bio': bio,
      'artisanProfile.verificationStatus': 'pending'
    },
    { new: true, runValidators: true }
  ).select('-password -refreshTokens');

  res.json({
    status: 'success',
    message: 'Artisan application submitted successfully',
    data: { user }
  });
}));

// @route   PUT /api/users/artisan-profile
// @desc    Update artisan profile
// @access  Private
router.put('/artisan-profile', [
  body('craftTypes').optional().isArray().withMessage('Craft types must be an array'),
  body('experience').optional().notEmpty().withMessage('Experience cannot be empty'),
  body('workshopDetails').optional().trim(),
  body('toolsUsed').optional().isArray().withMessage('Tools used must be an array'),
  body('materialsUsed').optional().isArray().withMessage('Materials used must be an array'),
  body('bio').optional().trim(),
  body('socialLinks.website').optional().isURL().withMessage('Invalid website URL'),
  body('socialLinks.instagram').optional().isURL().withMessage('Invalid Instagram URL'),
  body('socialLinks.facebook').optional().isURL().withMessage('Invalid Facebook URL'),
  body('socialLinks.youtube').optional().isURL().withMessage('Invalid YouTube URL')
], asyncHandler(async (req, res) => {
  // Check if user is an artisan
  if (req.user.role !== 'artisan' && !req.user.artisanProfile?.isArtisan) {
    return res.status(403).json({
      status: 'error',
      message: 'User is not an artisan'
    });
  }

  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const allowedUpdates = [
    'craftTypes', 'experience', 'workshopDetails', 'toolsUsed', 
    'materialsUsed', 'bio', 'socialLinks'
  ];
  
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[`artisanProfile.${key}`] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select('-password -refreshTokens');

  res.json({
    status: 'success',
    message: 'Artisan profile updated successfully',
    data: { user }
  });
}));

// @route   GET /api/users/artisan-profile
// @desc    Get artisan profile
// @access  Private
router.get('/artisan-profile', asyncHandler(async (req, res) => {
  // Check if user is an artisan
  if (req.user.role !== 'artisan' && !req.user.artisanProfile?.isArtisan) {
    return res.status(403).json({
      status: 'error',
      message: 'User is not an artisan'
    });
  }

  res.json({
    status: 'success',
    data: { 
      artisanProfile: req.user.artisanProfile 
    }
  });
}));

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', [
  body('password').notEmpty().withMessage('Password is required for account deletion')
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

  const { password } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');
  
  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({
      status: 'error',
      message: 'Password is incorrect'
    });
  }

  // Soft delete - deactivate account
  user.isActive = false;
  user.isBlocked = true;
  user.blockedReason = 'Account deleted by user';
  await user.save();

  res.json({
    status: 'success',
    message: 'Account deleted successfully'
  });
}));

// @route   GET /api/users/notifications
// @desc    Get user notifications
// @access  Private
router.get('/notifications', asyncHandler(async (req, res) => {
  // TODO: Implement notifications system
  res.json({
    status: 'success',
    data: { 
      notifications: [] 
    }
  });
}));

// @route   PUT /api/users/notifications/preferences
// @desc    Update notification preferences
// @access  Private
router.put('/notifications/preferences', [
  body('email').optional().isBoolean().withMessage('Email preference must be boolean'),
  body('sms').optional().isBoolean().withMessage('SMS preference must be boolean'),
  body('push').optional().isBoolean().withMessage('Push preference must be boolean')
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

  const { email, sms, push } = req.body;
  const updates = {};

  if (email !== undefined) updates['preferences.notifications.email'] = email;
  if (sms !== undefined) updates['preferences.notifications.sms'] = sms;
  if (push !== undefined) updates['preferences.notifications.push'] = push;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true }
  ).select('-password -refreshTokens');

  res.json({
    status: 'success',
    message: 'Notification preferences updated successfully',
    data: { user }
  });
}));

module.exports = router;
