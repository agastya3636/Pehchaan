const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pehchaan');
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@example.com',
    phone: '9876543210',
    password: 'password123',
    role: 'artisan',
    address: {
      street: '123 Silk Street',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221001',
      country: 'India'
    },
    artisanProfile: {
      isArtisan: true,
      craftTypes: ['Textiles & Embroidery'],
      experience: 'Master Artisan (15+ years)',
      workshopDetails: 'Traditional handloom workshop with 5 looms',
      toolsUsed: ['Handloom', 'Needles', 'Threads', 'Design patterns'],
      materialsUsed: ['Silk', 'Cotton', 'Zari', 'Dyes'],
      bio: 'Master weaver from Varanasi with 20 years of experience in traditional silk weaving',
      socialLinks: {
        instagram: '@priya_silk_art',
        website: 'www.priyasilkart.com'
      },
      isVerified: true,
      verificationStatus: 'verified',
      rating: {
        average: 4.8,
        count: 45
      },
      totalSales: 120,
      totalEarnings: 250000
    },
    isEmailVerified: true,
    isPhoneVerified: true
  },
  {
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '9876543211',
    password: 'password123',
    role: 'artisan',
    address: {
      street: '456 Pottery Lane',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001',
      country: 'India'
    },
    artisanProfile: {
      isArtisan: true,
      craftTypes: ['Pottery & Ceramics'],
      experience: 'Experienced (8-15 years)',
      workshopDetails: 'Family pottery workshop established in 1985',
      toolsUsed: ['Potter wheel', 'Clay tools', 'Kiln', 'Glazes'],
      materialsUsed: ['Clay', 'Terracotta', 'Glazes', 'Natural dyes'],
      bio: 'Third generation potter specializing in traditional Rajasthani pottery',
      socialLinks: {
        instagram: '@rajesh_pottery',
        facebook: 'Rajesh Pottery Art'
      },
      isVerified: true,
      verificationStatus: 'verified',
      rating: {
        average: 4.6,
        count: 32
      },
      totalSales: 85,
      totalEarnings: 180000
    },
    isEmailVerified: true,
    isPhoneVerified: true
  },
  {
    firstName: 'Aisha',
    lastName: 'Khan',
    email: 'aisha.khan@example.com',
    phone: '9876543212',
    password: 'password123',
    role: 'artisan',
    address: {
      street: '789 Jewelry Street',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001',
      country: 'India'
    },
    artisanProfile: {
      isArtisan: true,
      craftTypes: ['Jewelry & Metalwork'],
      experience: 'Master Artisan (15+ years)',
      workshopDetails: 'Traditional jewelry workshop with modern tools',
      toolsUsed: ['Jewelry tools', 'Kundan stones', 'Gold wire', 'Pliers'],
      materialsUsed: ['Gold', 'Silver', 'Kundan stones', 'Pearls'],
      bio: 'Expert in traditional Hyderabadi jewelry and Kundan work',
      socialLinks: {
        instagram: '@aisha_jewelry',
        youtube: 'Aisha Jewelry Art'
      },
      isVerified: true,
      verificationStatus: 'verified',
      rating: {
        average: 4.9,
        count: 28
      },
      totalSales: 95,
      totalEarnings: 320000
    },
    isEmailVerified: true,
    isPhoneVerified: true
  },
  {
    firstName: 'Arjun',
    lastName: 'Patel',
    email: 'arjun.patel@example.com',
    phone: '9876543213',
    password: 'password123',
    role: 'buyer',
    address: {
      street: '321 Modern Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    isEmailVerified: true,
    isPhoneVerified: true
  },
  {
    firstName: 'Sneha',
    lastName: 'Reddy',
    email: 'sneha.reddy@example.com',
    phone: '9876543214',
    password: 'password123',
    role: 'buyer',
    address: {
      street: '654 Garden Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India'
    },
    isEmailVerified: true,
    isPhoneVerified: true
  }
];

const sampleProducts = [
  {
    name: 'Handwoven Silk Saree - Banarasi',
    description: 'Exquisite handwoven Banarasi silk saree with intricate zari work. Perfect for weddings and special occasions. Made with pure silk and traditional weaving techniques.',
    shortDescription: 'Traditional Banarasi silk saree with zari work',
    price: 25000,
    originalPrice: 30000,
    discount: 17,
    category: 'Textiles & Embroidery',
    subcategory: 'Sarees',
    tags: ['silk', 'banarasi', 'wedding', 'traditional', 'zari'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400',
        alt: 'Banarasi Silk Saree',
        isPrimary: true,
        order: 0
      },
      {
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
        alt: 'Saree Detail',
        isPrimary: false,
        order: 1
      }
    ],
    specifications: {
      dimensions: {
        length: 550,
        width: 110,
        height: 2,
        unit: 'cm'
      },
      weight: {
        value: 800,
        unit: 'g'
      },
      material: ['Pure Silk', 'Zari Thread'],
      color: ['Red', 'Gold'],
      technique: ['Handloom', 'Zari Work'],
      careInstructions: 'Dry clean only. Store in muslin cloth.',
      ageGroup: 'adult'
    },
    inventory: {
      sku: 'BAN-SILK-001',
      quantity: 5,
      lowStockThreshold: 2,
      trackInventory: true
    },
    shipping: {
      weight: 800,
      dimensions: {
        length: 30,
        width: 20,
        height: 5
      },
      isFragile: false,
      requiresSpecialHandling: false,
      estimatedDeliveryDays: {
        min: 3,
        max: 7
      }
    },
    status: 'active',
    isFeatured: true,
    isNew: true,
    isHandmade: true,
    isEcoFriendly: true,
    isFairTrade: true,
    region: {
      state: 'Uttar Pradesh',
      city: 'Varanasi',
      pincode: '221001'
    },
    reviews: [
      {
        user: null, // Will be set after users are created
        rating: 5,
        comment: 'Absolutely beautiful saree! The quality is exceptional.',
        isVerified: true,
        helpful: 8,
        createdAt: new Date()
      },
      {
        user: null,
        rating: 4,
        comment: 'Great product, fast delivery. Highly recommended!',
        isVerified: true,
        helpful: 5,
        createdAt: new Date()
      }
    ],
    averageRating: 4.5,
    totalReviews: 2,
    sales: {
      totalSold: 12,
      totalRevenue: 300000,
      lastSold: new Date()
    },
    views: 156,
    likes: 23,
    shares: 8
  },
  {
    name: 'Terracotta Pottery Set - Traditional',
    description: 'Beautiful set of traditional terracotta pottery from Rajasthan. Includes 6 pieces: 2 bowls, 2 plates, 1 jug, and 1 decorative pot. Made using traditional techniques.',
    shortDescription: 'Traditional Rajasthani terracotta pottery set',
    price: 1200,
    originalPrice: 1500,
    discount: 20,
    category: 'Pottery & Ceramics',
    subcategory: 'Terracotta',
    tags: ['terracotta', 'pottery', 'traditional', 'rajasthan', 'handmade'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        alt: 'Terracotta Pottery Set',
        isPrimary: true,
        order: 0
      }
    ],
    specifications: {
      dimensions: {
        length: 25,
        width: 25,
        height: 15,
        unit: 'cm'
      },
      weight: {
        value: 2000,
        unit: 'g'
      },
      material: ['Terracotta Clay', 'Natural Glaze'],
      color: ['Terracotta', 'Brown'],
      technique: ['Hand Thrown', 'Traditional Firing'],
      careInstructions: 'Hand wash only. Avoid extreme temperatures.',
      ageGroup: 'all'
    },
    inventory: {
      sku: 'TER-POT-001',
      quantity: 8,
      lowStockThreshold: 3,
      trackInventory: true
    },
    shipping: {
      weight: 2000,
      dimensions: {
        length: 30,
        width: 30,
        height: 20
      },
      isFragile: true,
      requiresSpecialHandling: true,
      estimatedDeliveryDays: {
        min: 5,
        max: 10
      }
    },
    status: 'active',
    isFeatured: true,
    isNew: false,
    isHandmade: true,
    isEcoFriendly: true,
    isFairTrade: true,
    region: {
      state: 'Rajasthan',
      city: 'Jaipur',
      pincode: '302001'
    },
    reviews: [
      {
        user: null,
        rating: 5,
        comment: 'Beautiful craftsmanship! Perfect for home decoration.',
        isVerified: true,
        helpful: 12,
        createdAt: new Date()
      }
    ],
    averageRating: 4.8,
    totalReviews: 1,
    sales: {
      totalSold: 6,
      totalRevenue: 7200,
      lastSold: new Date()
    },
    views: 89,
    likes: 15,
    shares: 3
  },
  {
    name: 'Kundan Jewelry Set - Traditional',
    description: 'Stunning traditional Kundan jewelry set including necklace, earrings, and bracelet. Handcrafted with authentic Kundan stones and gold work.',
    shortDescription: 'Traditional Kundan jewelry set with necklace and earrings',
    price: 45000,
    originalPrice: 55000,
    discount: 18,
    category: 'Jewelry & Metalwork',
    subcategory: 'Kundan Jewelry',
    tags: ['kundan', 'jewelry', 'gold', 'traditional', 'wedding'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
        alt: 'Kundan Jewelry Set',
        isPrimary: true,
        order: 0
      }
    ],
    specifications: {
      dimensions: {
        length: 40,
        width: 5,
        height: 2,
        unit: 'cm'
      },
      weight: {
        value: 150,
        unit: 'g'
      },
      material: ['Gold', 'Kundan Stones', 'Pearls'],
      color: ['Gold', 'Multi-color'],
      technique: ['Kundan Work', 'Hand Setting'],
      careInstructions: 'Store in jewelry box. Clean with soft cloth.',
      ageGroup: 'adult'
    },
    inventory: {
      sku: 'KUN-JEW-001',
      quantity: 3,
      lowStockThreshold: 1,
      trackInventory: true
    },
    shipping: {
      weight: 150,
      dimensions: {
        length: 20,
        width: 15,
        height: 5
      },
      isFragile: true,
      requiresSpecialHandling: true,
      estimatedDeliveryDays: {
        min: 2,
        max: 5
      }
    },
    status: 'active',
    isFeatured: true,
    isNew: true,
    isHandmade: true,
    isEcoFriendly: false,
    isFairTrade: true,
    region: {
      state: 'Telangana',
      city: 'Hyderabad',
      pincode: '500001'
    },
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
    sales: {
      totalSold: 2,
      totalRevenue: 90000,
      lastSold: new Date()
    },
    views: 67,
    likes: 18,
    shares: 5
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.firstName} ${user.lastName}`);
    }

    // Create products
    console.log('🛍️  Creating products...');
    const createdProducts = [];
    for (const productData of sampleProducts) {
      // Assign artisan to product
      const artisan = createdUsers.find(u => u.role === 'artisan');
      if (artisan) {
        productData.artisan = artisan._id;
        productData.artisanName = `${artisan.firstName} ${artisan.lastName}`;
        productData.artisanLocation = {
          state: artisan.address.state,
          city: artisan.address.city
        };
      }

      // Assign review users
      const buyers = createdUsers.filter(u => u.role === 'buyer');
      if (buyers.length > 0) {
        productData.reviews.forEach((review, index) => {
          if (buyers[index]) {
            review.user = buyers[index]._id;
          }
        });
      }

      const product = new Product(productData);
      await product.save();
      createdProducts.push(product);
      console.log(`✅ Created product: ${product.name}`);
    }

    // Create sample orders
    console.log('📦 Creating sample orders...');
    const buyers = createdUsers.filter(u => u.role === 'buyer');
    const artisans = createdUsers.filter(u => u.role === 'artisan');
    
    if (buyers.length > 0 && createdProducts.length > 0) {
      const order = new Order({
        orderNumber: 'PEH' + Date.now().toString().slice(-8),
        customer: buyers[0]._id,
        customerDetails: {
          firstName: buyers[0].firstName,
          lastName: buyers[0].lastName,
          email: buyers[0].email,
          phone: buyers[0].phone
        },
        shippingAddress: {
          firstName: buyers[0].firstName,
          lastName: buyers[0].lastName,
          street: buyers[0].address.street,
          city: buyers[0].address.city,
          state: buyers[0].address.state,
          pincode: buyers[0].address.pincode,
          country: 'India',
          phone: buyers[0].phone
        },
        items: [{
          product: createdProducts[0]._id,
          productName: createdProducts[0].name,
          productImage: createdProducts[0].images[0].url,
          artisan: createdProducts[0].artisan,
          artisanName: createdProducts[0].artisanName,
          quantity: 1,
          unitPrice: createdProducts[0].price,
          totalPrice: createdProducts[0].price
        }],
        pricing: {
          subtotal: createdProducts[0].price,
          shipping: 0,
          tax: Math.round(createdProducts[0].price * 0.18),
          discount: 0,
          total: createdProducts[0].price + Math.round(createdProducts[0].price * 0.18),
          currency: 'INR'
        },
        payment: {
          method: 'razorpay',
          status: 'completed',
          paidAt: new Date()
        },
        status: 'delivered',
        shipping: {
          method: 'standard',
          trackingNumber: 'TRK' + Date.now(),
          carrier: 'BlueDart',
          shippedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        region: {
          state: buyers[0].address.state,
          city: buyers[0].address.city,
          pincode: buyers[0].address.pincode
        },
        timeline: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            note: 'Order placed'
          },
          {
            status: 'confirmed',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
            note: 'Order confirmed'
          },
          {
            status: 'shipped',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            note: 'Order shipped'
          },
          {
            status: 'delivered',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            note: 'Order delivered'
          }
        ]
      });

      await order.save();
      console.log(`✅ Created order: ${order.orderNumber}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${createdUsers.length} users`);
    console.log(`   - ${createdProducts.length} products`);
    console.log(`   - 1 order`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(() => {
  seedDatabase();
});
