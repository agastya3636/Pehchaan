const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.firstName').notEmpty().withMessage('First name is required'),
  body('shippingAddress.lastName').notEmpty().withMessage('Last name is required'),
  body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').notEmpty().withMessage('Pincode is required'),
  body('shippingAddress.phone').matches(/^[6-9]\d{9}$/).withMessage('Valid phone number is required'),
  body('payment.method').isIn(['razorpay', 'cod', 'upi', 'card', 'netbanking', 'wallet']).withMessage('Invalid payment method')
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

  const { items, shippingAddress, billingAddress, payment, coupon } = req.body;

  // Validate products and calculate pricing
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      return res.status(400).json({
        status: 'error',
        message: `Product with ID ${item.product} not found`
      });
    }

    if (product.status !== 'active') {
      return res.status(400).json({
        status: 'error',
        message: `Product ${product.name} is not available`
      });
    }

    if (product.inventory.quantity < item.quantity) {
      return res.status(400).json({
        status: 'error',
        message: `Insufficient stock for ${product.name}. Available: ${product.inventory.quantity}`
      });
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      product: product._id,
      productName: product.name,
      productImage: product.primaryImage,
      artisan: product.artisan,
      artisanName: product.artisanName,
      quantity: item.quantity,
      unitPrice: product.price,
      totalPrice: itemTotal,
      specifications: item.specifications || {}
    });
  }

  // Calculate shipping (free shipping over ₹1000)
  const shipping = subtotal >= 1000 ? 0 : 50;

  // Calculate tax (18% GST)
  const tax = Math.round(subtotal * 0.18);

  // Apply coupon discount if provided
  let discount = 0;
  if (coupon && coupon.code) {
    // TODO: Implement coupon validation logic
    if (coupon.code === 'WELCOME10') {
      discount = Math.round(subtotal * 0.1); // 10% discount
    }
  }

  const total = subtotal + shipping + tax - discount;

  // Create order
  const order = new Order({
    customer: req.user._id,
    customerDetails: {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      phone: req.user.phone
    },
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    items: orderItems,
    pricing: {
      subtotal,
      shipping,
      tax,
      discount,
      total,
      currency: 'INR'
    },
    coupon: coupon ? {
      code: coupon.code,
      discountType: 'percentage',
      discountValue: 10,
      appliedAt: new Date()
    } : undefined,
    payment: {
      method: payment.method,
      status: payment.method === 'cod' ? 'pending' : 'processing'
    },
    region: {
      state: shippingAddress.state,
      city: shippingAddress.city,
      pincode: shippingAddress.pincode
    }
  });

  await order.save();

  // Update product inventory
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { 'inventory.quantity': -item.quantity } }
    );
  }

  // TODO: Process payment based on method
  if (payment.method !== 'cod') {
    // TODO: Integrate with Razorpay or other payment gateway
    order.payment.status = 'completed';
    order.payment.paidAt = new Date();
    order.status = 'confirmed';
    order.confirmedAt = new Date();
    await order.save();
  }

  res.status(201).json({
    status: 'success',
    message: 'Order created successfully',
    data: { order }
  });
}));

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { customer: req.user._id };
  if (status && status !== 'All') {
    filter.status = status;
  }

  const orders = await Order.find(filter)
    .populate('items.product', 'name images price')
    .populate('items.artisan', 'firstName lastName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Order.countDocuments(filter);

  res.json({
    status: 'success',
    data: {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    }
  });
}));

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    customer: req.user._id
  })
    .populate('items.product', 'name images price description')
    .populate('items.artisan', 'firstName lastName artisanProfile.rating');

  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }

  res.json({
    status: 'success',
    data: { order }
  });
}));

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel an order
// @access  Private
router.put('/:id/cancel', [
  body('reason').optional().isString().withMessage('Reason must be a string')
], asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findOne({
    _id: req.params.id,
    customer: req.user._id
  });

  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }

  // Check if order can be cancelled
  if (!['pending', 'confirmed', 'processing'].includes(order.status)) {
    return res.status(400).json({
      status: 'error',
      message: 'Order cannot be cancelled at this stage'
    });
  }

  // Update order status
  order.status = 'cancelled';
  order.cancelledAt = new Date();
  order.timeline.push({
    status: 'cancelled',
    timestamp: new Date(),
    note: reason || 'Order cancelled by customer'
  });

  // Restore product inventory
  for (const item of order.items) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { 'inventory.quantity': item.quantity } }
    );
  }

  await order.save();

  res.json({
    status: 'success',
    message: 'Order cancelled successfully',
    data: { order }
  });
}));

// @route   POST /api/orders/:id/return
// @desc    Request order return
// @access  Private
router.post('/:id/return', [
  body('reason').notEmpty().withMessage('Return reason is required'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], asyncHandler(async (req, res) => {
  const { reason, images, notes } = req.body;

  const order = await Order.findOne({
    _id: req.params.id,
    customer: req.user._id
  });

  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }

  // Check if order can be returned
  if (order.status !== 'delivered') {
    return res.status(400).json({
      status: 'error',
      message: 'Only delivered orders can be returned'
    });
  }

  // Check return window (7 days)
  const returnWindow = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  if (Date.now() - new Date(order.deliveredAt) > returnWindow) {
    return res.status(400).json({
      status: 'error',
      message: 'Return window has expired'
    });
  }

  // Check if return already requested
  if (order.return.returnStatus !== 'none') {
    return res.status(400).json({
      status: 'error',
      message: 'Return already requested for this order'
    });
  }

  // Update return status
  order.return.returnStatus = 'requested';
  order.return.returnReason = reason;
  order.return.returnImages = images || [];
  order.return.returnNotes = notes;
  order.return.returnRequestedAt = new Date();

  order.timeline.push({
    status: 'return-requested',
    timestamp: new Date(),
    note: `Return requested: ${reason}`
  });

  await order.save();

  res.json({
    status: 'success',
    message: 'Return request submitted successfully',
    data: { order }
  });
}));

// @route   GET /api/orders/artisan/:artisanId
// @desc    Get orders for artisan
// @access  Private (Artisan only)
router.get('/artisan/:artisanId', asyncHandler(async (req, res) => {
  // Check if user is the artisan
  if (req.user._id.toString() !== req.params.artisanId) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied'
    });
  }

  const { page = 1, limit = 20, status } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { 'items.artisan': req.params.artisanId };
  if (status && status !== 'All') {
    filter.status = status;
  }

  const orders = await Order.find(filter)
    .populate('customer', 'firstName lastName email phone')
    .populate('items.product', 'name images price')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Order.countDocuments(filter);

  res.json({
    status: 'success',
    data: {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    }
  });
}));

// @route   PUT /api/orders/:id/status
// @desc    Update order status (for artisans)
// @access  Private (Artisan only)
router.put('/:id/status', [
  body('status').isIn(['confirmed', 'processing', 'shipped', 'delivered']).withMessage('Invalid status'),
  body('trackingNumber').optional().isString().withMessage('Tracking number must be a string'),
  body('carrier').optional().isString().withMessage('Carrier must be a string'),
  body('note').optional().isString().withMessage('Note must be a string')
], asyncHandler(async (req, res) => {
  const { status, trackingNumber, carrier, note } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }

  // Check if user is involved in this order as artisan
  const isArtisanInOrder = order.items.some(
    item => item.artisan.toString() === req.user._id.toString()
  );

  if (!isArtisanInOrder) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied'
    });
  }

  // Update order status
  order.status = status;
  order.timeline.push({
    status,
    timestamp: new Date(),
    note: note || `Order status updated to ${status}`,
    updatedBy: req.user._id
  });

  // Update specific fields based on status
  if (status === 'shipped') {
    order.shipping.shippedAt = new Date();
    if (trackingNumber) order.shipping.trackingNumber = trackingNumber;
    if (carrier) order.shipping.carrier = carrier;
  }

  if (status === 'delivered') {
    order.shipping.deliveredAt = new Date();
    order.deliveredAt = new Date();
  }

  await order.save();

  res.json({
    status: 'success',
    message: 'Order status updated successfully',
    data: { order }
  });
}));

// @route   GET /api/orders/stats
// @desc    Get order statistics
// @access  Private
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await Order.getStats({ customer: req.user._id });

  res.json({
    status: 'success',
    data: { stats: stats[0] || {} }
  });
}));

module.exports = router;
