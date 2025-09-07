const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Order Information
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // Customer Information
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  customerDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },
  
  // Shipping Address
  shippingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    },
    phone: {
      type: String,
      required: true
    },
    landmark: String,
    instructions: String
  },
  
  // Billing Address (if different from shipping)
  billingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    phone: String
  },
  
  // Order Items
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: String,
    productImage: String,
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    artisanName: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    specifications: {
      size: String,
      color: String,
      material: String,
      customizations: String
    }
  }],
  
  // Pricing Breakdown
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    shipping: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  
  // Coupon/Discount Information
  coupon: {
    code: String,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    discountValue: Number,
    appliedAt: Date
  },
  
  // Payment Information
  payment: {
    method: {
      type: String,
      enum: ['razorpay', 'cod', 'upi', 'card', 'netbanking', 'wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending'
    },
    transactionId: String,
    paymentId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number,
    refundReason: String
  },
  
  // Order Status
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'out-for-delivery',
      'delivered',
      'cancelled',
      'returned',
      'refunded'
    ],
    default: 'pending'
  },
  
  // Shipping Information
  shipping: {
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight', 'pickup'],
      default: 'standard'
    },
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date
  },
  
  // Timeline
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Notes and Comments
  notes: {
    customer: String,
    admin: String,
    artisan: String
  },
  
  // Return/Refund Information
  return: {
    isReturnable: {
      type: Boolean,
      default: true
    },
    returnWindow: {
      type: Number,
      default: 7 // days
    },
    returnReason: String,
    returnStatus: {
      type: String,
      enum: ['none', 'requested', 'approved', 'rejected', 'returned', 'refunded']
    },
    returnRequestedAt: Date,
    returnApprovedAt: Date,
    returnCompletedAt: Date,
    returnImages: [String],
    returnNotes: String
  },
  
  // Regional Information
  region: {
    state: String,
    city: String,
    pincode: String
  },
  
  // Timestamps
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total items
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order status display
orderSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'pending': 'Order Pending',
    'confirmed': 'Order Confirmed',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'out-for-delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'returned': 'Returned',
    'refunded': 'Refunded'
  };
  return statusMap[this.status] || this.status;
});

// Indexes for better performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'items.artisan': 1 });
orderSchema.index({ 'shippingAddress.state': 1 });
orderSchema.index({ 'shippingAddress.city': 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `PEH${timestamp}${random}`;
  }
  next();
});

// Pre-save middleware to update timeline
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
      note: `Order status changed to ${this.status}`
    });
  }
  next();
});

// Static method to find orders by customer
orderSchema.statics.findByCustomer = function(customerId, limit = 20) {
  return this.find({ customer: customerId })
    .populate('items.product', 'name images price')
    .populate('items.artisan', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to find orders by artisan
orderSchema.statics.findByArtisan = function(artisanId, limit = 20) {
  return this.find({ 'items.artisan': artisanId })
    .populate('customer', 'firstName lastName email phone')
    .populate('items.product', 'name images price')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get order statistics
orderSchema.statics.getStats = function(filters = {}) {
  return this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Order', orderSchema);
