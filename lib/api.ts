// API functions connecting to the backend
import { type Product, type Artisan, type Order, type Post } from './mock-data';

const API_BASE_URL = 'http://localhost:5001/api';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Authentication
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: email, password }),
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role: 'buyer' | 'artisan';
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return response.ok;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.data.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },
  // Products
  getProducts: async (filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    region?: string;
    search?: string;
  }): Promise<Product[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters?.region) params.append('state', filters.region);
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      return data.data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  getProduct: async (id: string): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      
      const data = await response.json();
      return data.data.product || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Artisans
  getArtisans: async (): Promise<Artisan[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/artisans`);
      if (!response.ok) throw new Error('Failed to fetch artisans');
      
      const data = await response.json();
      return data.data.artisans || [];
    } catch (error) {
      console.error('Error fetching artisans:', error);
      return [];
    }
  },

  getArtisan: async (id: string): Promise<Artisan | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/artisans/${id}`);
      if (!response.ok) throw new Error('Failed to fetch artisan');
      
      const data = await response.json();
      return data.data.artisan || null;
    } catch (error) {
      console.error('Error fetching artisan:', error);
      return null;
    }
  },

  // Orders
  getOrders: async (buyerId: string): Promise<Order[]> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      return data.data.orders || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) throw new Error('Failed to create order');
      
      const data = await response.json();
      return data.data.order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Community
  getPosts: async (): Promise<Post[]> => {
    await delay(400);
    return mockPosts;
  },

  getPost: async (id: string): Promise<Post | null> => {
    await delay(300);
    return mockPosts.find(p => p.id === id) || null;
  },

  createPost: async (postData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>): Promise<Post> => {
    await delay(500);
    const newPost: Post = {
      ...postData,
      id: `post${Date.now()}`,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    return newPost;
  },

  // Product Management
  createProduct: async (productData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) throw new Error('Failed to create product');
      
      const data = await response.json();
      return data.data.product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id: string, productData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) throw new Error('Failed to update product');
      
      const data = await response.json();
      return data.data.product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to delete product');
      
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Post Management
  getPosts: async (filters: any = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.author) queryParams.append('author', filters.author);
      if (filters.tags) queryParams.append('tags', filters.tags.join(','));
      if (filters.region) queryParams.append('region', filters.region);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());

      const response = await fetch(`${API_BASE_URL}/posts?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      return data.data.posts || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  getPost: async (postId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      
      const data = await response.json();
      return data.data.post;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  createPost: async (postData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) throw new Error('Failed to create post');
      
      const data = await response.json();
      return data.data.post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  likePost: async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to like post');
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  commentOnPost: async (postId: string, content: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) throw new Error('Failed to comment on post');
      
      const data = await response.json();
      return data.data.comment;
    } catch (error) {
      console.error('Error commenting on post:', error);
      throw error;
    }
  },

  // Analytics (for artisan dashboard)
  getSalesAnalytics: async (artisanId: string) => {
    await delay(400);
    return {
      monthlyData: [
        { month: 'Jan', sales: 12000, orders: 8 },
        { month: 'Feb', sales: 15000, orders: 12 },
        { month: 'Mar', sales: 18000, orders: 15 },
        { month: 'Apr', sales: 22000, orders: 18 },
        { month: 'May', sales: 16000, orders: 11 },
        { month: 'Jun', sales: 25000, orders: 20 },
      ],
      totalRevenue: 108000,
      totalOrders: 84,
      averageOrderValue: 1286,
    };
  },
};