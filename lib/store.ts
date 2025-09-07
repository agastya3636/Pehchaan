import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from './api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  role: 'artisan' | 'buyer';
  avatar?: string;
  isArtisan?: boolean;
  artisanProfile?: any;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  artisanName: string;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role: 'buyer' | 'artisan';
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: 'artisan' | 'buyer') => void;
  checkAuth: () => Promise<void>;

  // Cart
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;

  // Language
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;

  // Notifications
  notifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
  }>;
  markNotificationAsRead: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        try {
          const response = await api.login(email, password);
          const userData = {
            ...response.data.user,
            name: `${response.data.user.firstName} ${response.data.user.lastName}`,
          };
          
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(userData));
          
          set({
            user: userData,
            isAuthenticated: true,
          });
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },
      register: async (userData) => {
        try {
          const response = await api.register(userData);
          const newUser = {
            ...response.data.user,
            name: `${response.data.user.firstName} ${response.data.user.lastName}`,
          };
          
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(newUser));
          
          set({
            user: newUser,
            isAuthenticated: true,
          });
          return true;
        } catch (error) {
          console.error('Registration failed:', error);
          return false;
        }
      },
      logout: async () => {
        try {
          await api.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            cartItems: [],
            wishlist: [],
          });
        }
      },
      switchRole: (role) =>
        set((state) => ({
          user: state.user ? { ...state.user, role } : null,
        })),
      checkAuth: async () => {
        try {
          const user = await api.getCurrentUser();
          if (user) {
            const userData = {
              ...user,
              name: `${user.firstName} ${user.lastName}`,
            };
            set({
              user: userData,
              isAuthenticated: true,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      // Cart
      cartItems: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (cartItem) => cartItem.productId === item.productId
          );
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((cartItem) =>
                cartItem.productId === item.productId
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
            };
          }
          return {
            cartItems: [...state.cartItems, { ...item, quantity: 1 }],
          };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ cartItems: [] }),

      // Wishlist
      wishlist: [],
      addToWishlist: (productId) =>
        set((state) => ({
          wishlist: [...state.wishlist, productId],
        })),
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((id) => id !== productId),
        })),

      // Language
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

      // Notifications
      notifications: [
        {
          id: 'not1',
          type: 'order',
          title: 'Order Delivered',
          message: 'Your order has been delivered successfully',
          createdAt: '2024-02-10T10:00:00Z',
          read: false,
        },
        {
          id: 'not2',
          type: 'product',
          title: 'New Product Alert',
          message: 'A new product from your favorite artisan is available',
          createdAt: '2024-02-09T14:30:00Z',
          read: true,
        },
      ],
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
        })),
    }),
    {
      name: 'pehchaan-storage',
    }
  )
);