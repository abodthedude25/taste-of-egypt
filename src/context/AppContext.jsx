import React, { createContext, useContext, useState, useEffect } from 'react';
import { menuItems as localMenuItems, DELIVERY_FEE, TAX_RATE } from '../data/menuItems';
import { authAPI, ordersAPI, adminAPI, setToken, removeToken } from '../services/api';

const AppContext = createContext();

// Check if we should use API (backend connected)
const USE_API = import.meta.env.VITE_USE_API === 'true';

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState(localMenuItems);
  const [currentPage, setCurrentPage] = useState('home');
  const [notification, setNotification] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize: Load user from token or localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('tasteOfEgypt_token');
      const savedCart = localStorage.getItem('tasteOfEgypt_cart');
      
      if (savedCart) setCart(JSON.parse(savedCart));
      
      if (token && USE_API) {
        try {
          const { user } = await authAPI.getProfile();
          setUser(user);
          setIsAdmin(user.isAdmin);
          
          // Load orders from API
          if (!user.isAdmin) {
            const { orders } = await ordersAPI.getAll();
            setOrders(orders);
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          removeToken();
        }
      } else if (!USE_API) {
        // Fallback to localStorage for dev mode
        const savedUser = localStorage.getItem('tasteOfEgypt_user');
        const savedOrders = localStorage.getItem('tasteOfEgypt_orders');
        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedOrders) setOrders(JSON.parse(savedOrders));
      }
      
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('tasteOfEgypt_cart', JSON.stringify(cart));
  }, [cart]);

  // Save to localStorage in dev mode
  useEffect(() => {
    if (!USE_API) {
      if (user) localStorage.setItem('tasteOfEgypt_user', JSON.stringify(user));
      localStorage.setItem('tasteOfEgypt_orders', JSON.stringify(orders));
    }
  }, [user, orders]);

  // Notification helpers
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Cart functions
  const addToCart = (item, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    showNotification(`${item.name} added to cart!`);
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(i => 
      i.id === itemId ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = (isFirstOrder = false, orderType = 'delivery') => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = orderType === 'pickup' ? 0 : (isFirstOrder ? 0 : DELIVERY_FEE);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + deliveryFee + tax;
    return { subtotal, deliveryFee, tax, total };
  };

  // Auth functions
  const register = async (userData) => {
    if (USE_API) {
      const { token, user } = await authAPI.register(userData);
      setToken(token);
      setUser(user);
      showNotification(
        user.isFirstOrder 
          ? 'Welcome! Enjoy FREE delivery on your first order!' 
          : `Welcome, ${user.name}!`
      );
      return user;
    } else {
      // Fallback for dev mode
      return login(userData);
    }
  };

  const login = async (credentials) => {
    if (USE_API) {
      const { token, user } = await authAPI.login(credentials);
      setToken(token);
      setUser(user);
      
      // Load user's orders
      const { orders } = await ordersAPI.getAll();
      setOrders(orders);
      
      showNotification(`Welcome back, ${user.name}!`);
      return user;
    } else {
      // Fallback for dev mode (localStorage)
      const newUser = {
        ...credentials,
        id: Date.now().toString(),
        name: credentials.name || credentials.email.split('@')[0],
        isFirstOrder: !localStorage.getItem(`tasteOfEgypt_ordered_${credentials.email}`),
        createdAt: new Date().toISOString()
      };
      setUser(newUser);
      showNotification(
        newUser.isFirstOrder 
          ? 'Welcome! Enjoy FREE delivery on your first order!' 
          : `Welcome back, ${newUser.name}!`
      );
      return newUser;
    }
  };

  const googleLogin = async (googleData) => {
    if (USE_API) {
      const { token, user } = await authAPI.googleLogin(googleData);
      setToken(token);
      setUser(user);
      
      const { orders } = await ordersAPI.getAll();
      setOrders(orders);
      
      showNotification(`Welcome, ${user.name}!`);
      return user;
    } else {
      return login(googleData);
    }
  };

  const adminLogin = async (credentials) => {
    if (USE_API) {
      const { token, user } = await authAPI.adminLogin(credentials);
      setToken(token);
      setUser(user);
      setIsAdmin(true);
      showNotification('Admin login successful');
      return user;
    } else {
      // Dev mode admin check
      if (credentials.email === 'admin@tasteofegypt.ca' && credentials.password === 'admin123') {
        setIsAdmin(true);
        showNotification('Admin login successful');
        return { isAdmin: true };
      }
      throw new Error('Invalid admin credentials');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setOrders([]);
    removeToken();
    localStorage.removeItem('tasteOfEgypt_user');
    setCurrentPage('home');
    showNotification('Logged out successfully');
  };

  // Order functions
  const placeOrder = async (orderDetails) => {
    const totals = getCartTotal(user?.isFirstOrder, orderDetails.orderType);
    
    const orderData = {
      ...orderDetails,
      items: cart.map(item => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      tax: totals.tax,
      total: totals.total,
      isFirstOrder: user?.isFirstOrder
    };
    
    if (USE_API) {
      const { order } = await ordersAPI.create(orderData);
      setOrders(prev => [order, ...prev]);
      
      if (user?.isFirstOrder) {
        setUser(prev => ({ ...prev, isFirstOrder: false }));
      }
      
      clearCart();
      showNotification('Order placed! Check your email for confirmation.');
      return order;
    } else {
      // Dev mode - localStorage
      const order = {
        orderId: `ORD-${Date.now()}`,
        ...orderData,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      setOrders(prev => [order, ...prev]);
      
      if (user?.isFirstOrder) {
        localStorage.setItem(`tasteOfEgypt_ordered_${user.email}`, 'true');
        setUser(prev => ({ ...prev, isFirstOrder: false }));
      }
      
      clearCart();
      showNotification('Order placed! Awaiting confirmation.');
      return order;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    if (USE_API) {
      await adminAPI.updateOrderStatus(orderId, status);
    }
    
    setOrders(prev => prev.map(o => 
      (o.orderId || o.id) === orderId 
        ? { ...o, status, updatedAt: new Date().toISOString() } 
        : o
    ));
    
    showNotification(`Order ${orderId} ${status}`);
  };

  // Admin functions
  const fetchAllOrders = async (filters = {}) => {
    if (USE_API) {
      const { orders } = await adminAPI.getOrders(filters);
      setOrders(orders);
      return orders;
    }
    return orders;
  };

  const getAdminStats = async () => {
    if (USE_API) {
      const { stats } = await adminAPI.getStats();
      return stats;
    }
    // Dev mode stats
    return {
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      todayRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
      totalOrders: orders.length
    };
  };

  const value = {
    // User
    user,
    login,
    register,
    googleLogin,
    adminLogin,
    logout,
    isAdmin,
    setIsAdmin,
    
    // Cart
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    
    // Orders
    orders,
    placeOrder,
    updateOrderStatus,
    fetchAllOrders,
    getAdminStats,
    
    // Navigation
    currentPage,
    setCurrentPage,
    
    // Notifications
    notification,
    showNotification,
    
    // Data
    menuItems,
    DELIVERY_FEE,
    TAX_RATE,
    
    // State
    loading,
    useAPI: USE_API
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
