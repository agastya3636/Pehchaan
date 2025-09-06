const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Pehchaan API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Mock data endpoints for testing
app.get('/api/products', (req, res) => {
  const mockProducts = [
    {
      id: '1',
      name: 'Handwoven Silk Saree',
      description: 'Beautiful handwoven silk saree from Varanasi',
      price: 2500,
      category: 'Textiles & Embroidery',
      images: ['https://via.placeholder.com/300x400'],
      artisan: {
        name: 'Priya Sharma',
        location: 'Varanasi, Uttar Pradesh'
      },
      rating: 4.5,
      reviews: 12
    },
    {
      id: '2',
      name: 'Terracotta Pottery Set',
      description: 'Traditional terracotta pottery from Rajasthan',
      price: 800,
      category: 'Pottery & Ceramics',
      images: ['https://via.placeholder.com/300x400'],
      artisan: {
        name: 'Rajesh Kumar',
        location: 'Jaipur, Rajasthan'
      },
      rating: 4.8,
      reviews: 8
    }
  ];
  
  res.json({
    status: 'success',
    data: { products: mockProducts }
  });
});

app.get('/api/artisans', (req, res) => {
  const mockArtisans = [
    {
      id: '1',
      firstName: 'Priya',
      lastName: 'Sharma',
      location: 'Varanasi, Uttar Pradesh',
      craftTypes: ['Textiles & Embroidery'],
      rating: 4.5,
      totalSales: 45
    },
    {
      id: '2',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      location: 'Jaipur, Rajasthan',
      craftTypes: ['Pottery & Ceramics'],
      rating: 4.8,
      totalSales: 32
    }
  ];
  
  res.json({
    status: 'success',
    data: { artisans: mockArtisans }
  });
});

// Auth endpoints (mock)
app.post('/api/auth/register', (req, res) => {
  res.json({
    status: 'success',
    message: 'User registered successfully (mock)',
    data: {
      user: {
        id: 'mock-user-1',
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: 'buyer'
      },
      token: 'mock-jwt-token'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    status: 'success',
    message: 'Login successful (mock)',
    data: {
      user: {
        id: 'mock-user-1',
        firstName: 'Test',
        lastName: 'User',
        email: req.body.identifier,
        role: 'buyer'
      },
      token: 'mock-jwt-token'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Pehchaan Backend API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Note: This is a mock server for testing. Install MongoDB for full functionality.`);
});

module.exports = app;
