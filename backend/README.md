# Pehchaan Backend API

Backend API for Pehchaan - The Artisan Empowerment Platform. Built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens
- **User Management**: Buyer and Artisan profiles with role-based access
- **Product Management**: CRUD operations for handcrafted products
- **Order Management**: Complete order lifecycle management
- **Regional Support**: State-wise and city-wise filtering
- **Search & Filtering**: Advanced product search with multiple filters
- **Reviews & Ratings**: Product and artisan rating system
- **File Upload**: Image upload support (Cloudinary integration ready)
- **Email & SMS**: Notification system (configurable)
- **Payment Integration**: Razorpay integration ready
- **Security**: Rate limiting, input validation, CORS protection

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pehchaan-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/pehchaan
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   # ... other environment variables
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB locally
   mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | Logout user | Private |
| POST | `/auth/forgot-password` | Send password reset | Public |
| POST | `/auth/reset-password` | Reset password | Public |
| POST | `/auth/verify-email` | Verify email | Public |

### User Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/users/profile` | Get user profile | Private |
| PUT | `/users/profile` | Update profile | Private |
| POST | `/users/change-password` | Change password | Private |
| POST | `/users/become-artisan` | Convert to artisan | Private |
| PUT | `/users/artisan-profile` | Update artisan profile | Private |

### Product Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/products` | Get all products | Public |
| GET | `/products/featured` | Get featured products | Public |
| GET | `/products/:id` | Get single product | Public |
| GET | `/products/search` | Search products | Public |
| GET | `/products/categories` | Get categories | Public |
| POST | `/products/:id/like` | Like product | Private |
| POST | `/products/:id/review` | Add review | Private |

### Artisan Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/artisans` | Get all artisans | Public |
| GET | `/artisans/featured` | Get featured artisans | Public |
| GET | `/artisans/:id` | Get single artisan | Public |
| GET | `/artisans/stats` | Get artisan statistics | Public |

### Order Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/orders` | Create order | Private |
| GET | `/orders` | Get user orders | Private |
| GET | `/orders/:id` | Get single order | Private |
| PUT | `/orders/:id/cancel` | Cancel order | Private |
| POST | `/orders/:id/return` | Request return | Private |

## 🗄️ Database Models

### User Model
- Basic profile information
- Artisan-specific fields
- Authentication data
- Preferences and settings

### Product Model
- Product details and specifications
- Pricing and inventory
- Images and media
- Reviews and ratings
- Regional information

### Order Model
- Order items and pricing
- Customer and shipping details
- Payment information
- Order status and timeline
- Return/refund handling

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/pehchaan` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | JWT expiration | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Optional Services

- **Cloudinary**: Image upload and management
- **Razorpay**: Payment processing
- **SendGrid/SES**: Email notifications
- **Twilio**: SMS notifications
- **Redis**: Caching and sessions

## 🚀 Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name pehchaan-api
pm2 save
pm2 startup
```

### Using Docker
```bash
# Build image
docker build -t pehchaan-backend .

# Run container
docker run -d -p 5000:5000 --name pehchaan-api pehchaan-backend
```

### Environment Setup
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Set up reverse proxy (nginx)
4. Configure SSL certificates
5. Set up monitoring and logging

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Monitoring

- Health check endpoint: `GET /api/health`
- Rate limiting: 100 requests per 15 minutes per IP
- Error logging and monitoring
- Performance metrics

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet.js security headers
- SQL injection prevention
- XSS protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 API Versioning

Current API version: `v1`
- All endpoints are prefixed with `/api`
- Version information in response headers
- Backward compatibility maintained

## 📈 Performance

- Database indexing for optimal queries
- Pagination for large datasets
- Image optimization and CDN ready
- Caching strategies implemented
- Rate limiting to prevent abuse

---

**Built with ❤️ for Indian Artisans**
