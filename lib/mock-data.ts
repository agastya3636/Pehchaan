export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  video?: string;
  artisanId: string;
  artisanName: string;
  artisanVerified: boolean;
  category: string;
  region: string;
  stock: number;
  tags: string[];
  createdAt: string;
}

export interface Artisan {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  verified: boolean;
  region: string;
  specialties: string[];
  avatar: string;
  rating: number;
  totalSales: number;
  joinedAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  products: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Handwoven Silk Saree',
    description: 'Beautiful traditional silk saree with intricate golden threadwork, perfect for festivals and special occasions.',
    price: 8500,
    image: 'https://images.pexels.com/photos/9558249/pexels-photo-9558249.jpeg',
    artisanId: 'art1',
    artisanName: 'Rajesh Kumar',
    artisanVerified: true,
    category: 'Textiles',
    region: 'Varanasi',
    stock: 5,
    tags: ['silk', 'handwoven', 'traditional', 'wedding'],
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Ceramic Tea Set',
    description: 'Hand-painted ceramic tea set with traditional motifs, includes 6 cups and matching saucers.',
    price: 2200,
    image: 'https://images.pexels.com/photos/6479642/pexels-photo-6479642.jpeg',
    artisanId: 'art2',
    artisanName: 'Priya Sharma',
    artisanVerified: true,
    category: 'Pottery',
    region: 'Jaipur',
    stock: 12,
    tags: ['ceramic', 'handpainted', 'tea', 'traditional'],
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Wooden Jewelry Box',
    description: 'Intricately carved wooden jewelry box with multiple compartments and traditional patterns.',
    price: 1800,
    image: 'https://images.pexels.com/photos/5370618/pexels-photo-5370618.jpeg',
    artisanId: 'art3',
    artisanName: 'Vikram Singh',
    artisanVerified: false,
    category: 'Woodwork',
    region: 'Jodhpur',
    stock: 8,
    tags: ['wood', 'carved', 'jewelry', 'storage'],
    createdAt: '2024-01-25T09:15:00Z'
  },
  {
    id: '4',
    name: 'Embroidered Cushion Covers',
    description: 'Set of 4 vibrant cushion covers with traditional mirror work and embroidery.',
    price: 1200,
    image: 'https://images.pexels.com/photos/6969792/pexels-photo-6969792.jpeg',
    artisanId: 'art4',
    artisanName: 'Sunita Devi',
    artisanVerified: true,
    category: 'Textiles',
    region: 'Gujarat',
    stock: 15,
    tags: ['embroidery', 'cushion', 'home-decor', 'mirror-work'],
    createdAt: '2024-02-01T16:45:00Z'
  },
  {
    id: '5',
    name: 'Brass Wall Hanging',
    description: 'Traditional brass wall hanging with intricate engravings depicting cultural motifs.',
    price: 3500,
    image: 'https://images.pexels.com/photos/8965831/pexels-photo-8965831.jpeg',
    artisanId: 'art5',
    artisanName: 'Mohammad Ali',
    artisanVerified: true,
    category: 'Metalwork',
    region: 'Moradabad',
    stock: 6,
    tags: ['brass', 'wall-hanging', 'traditional', 'home-decor'],
    createdAt: '2024-02-05T11:20:00Z'
  },
  {
    id: '6',
    name: 'Leather Handbag',
    description: 'Handcrafted leather handbag with traditional tooling and modern design elements.',
    price: 4200,
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
    artisanId: 'art6',
    artisanName: 'Arjun Patel',
    artisanVerified: false,
    category: 'Leatherwork',
    region: 'Kolhapur',
    stock: 10,
    tags: ['leather', 'handbag', 'handcrafted', 'fashion'],
    createdAt: '2024-02-10T13:10:00Z'
  }
];

export const mockArtisans: Artisan[] = [
  {
    id: 'art1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 9876543210',
    bio: 'Master weaver with 25 years of experience in silk saree production. Specialized in traditional Banarasi patterns.',
    verified: true,
    region: 'Varanasi',
    specialties: ['Silk Weaving', 'Traditional Patterns', 'Banarasi Sarees'],
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    rating: 4.8,
    totalSales: 156,
    joinedAt: '2023-06-15T00:00:00Z'
  },
  {
    id: 'art2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 9876543211',
    bio: 'Traditional potter creating beautiful ceramic pieces inspired by Rajasthani culture.',
    verified: true,
    region: 'Jaipur',
    specialties: ['Pottery', 'Ceramic Art', 'Traditional Painting'],
    avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg',
    rating: 4.9,
    totalSales: 89,
    joinedAt: '2023-08-20T00:00:00Z'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ord1',
    buyerId: 'buyer1',
    products: [
      {
        productId: '1',
        name: 'Handwoven Silk Saree',
        price: 8500,
        quantity: 1,
        image: 'https://images.pexels.com/photos/9558249/pexels-photo-9558249.jpeg'
      }
    ],
    total: 8500,
    status: 'delivered',
    createdAt: '2024-01-20T10:00:00Z',
    shippingAddress: {
      name: 'Anita Desai',
      address: '123 MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      phone: '+91 9876543212'
    }
  }
];

export const mockPosts: Post[] = [
  {
    id: 'post1',
    title: 'Traditional Weaving Techniques: Preserving Our Heritage',
    content: 'In this post, I want to share some insights about traditional weaving techniques that have been passed down through generations...',
    authorId: 'art1',
    authorName: 'Rajesh Kumar',
    authorAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    tags: ['weaving', 'traditional', 'heritage'],
    likes: 24,
    comments: [
      {
        id: 'com1',
        content: 'Thank you for sharing this valuable knowledge!',
        authorId: 'buyer1',
        authorName: 'Anita Desai',
        authorAvatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg',
        createdAt: '2024-02-01T12:00:00Z'
      }
    ],
    createdAt: '2024-01-30T15:30:00Z'
  }
];

export const mockNotifications = [
  {
    id: 'not1',
    type: 'order',
    title: 'Order Delivered',
    message: 'Your order #ord1 has been delivered successfully',
    createdAt: '2024-02-10T10:00:00Z',
    read: false
  },
  {
    id: 'not2',
    type: 'product',
    title: 'New Product from Favorite Artisan',
    message: 'Rajesh Kumar has added a new product to their collection',
    createdAt: '2024-02-09T14:30:00Z',
    read: true
  }
];