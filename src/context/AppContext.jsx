import React, { createContext, useContext, useState, useEffect } from 'react';
import { menuItems, DELIVERY_FEE, TAX_RATE } from '../data/menuItems';
import { sendOrderConfirmation, sendStatusUpdate, sendAdminNotification } from '../services/emailService';

const AppContext = createContext();

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
  const [currentPage, setCurrentPage] = useState('home');
  const [notification, setNotification] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tasteOfEgypt_user');
    const savedCart = localStorage.getItem('tasteOfEgypt_cart');
    const savedOrders = localStorage.getItem('tasteOfEgypt_orders');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Save data to localStorage when changed
  useEffect(() => {
    if (user) localStorage.setItem('tasteOfEgypt_user', JSON.stringify(user));
    localStorage.setItem('tasteOfEgypt_cart', JSON.stringify(cart));
    localStorage.setItem('tasteOfEgypt_orders', JSON.stringify(orders));
  }, [user, cart, orders]);

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
  const login = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      isFirstOrder: !localStorage.getItem(`tasteOfEgypt_ordered_${userData.email}`),
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    showNotification(
      newUser.isFirstOrder 
        ? 'Welcome! Enjoy FREE delivery on your first order!' 
        : `Welcome back, ${newUser.name}!`
    );
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('tasteOfEgypt_user');
    setCurrentPage('home');
    showNotification('Logged out successfully');
  };

  // Order functions with email integration
  const placeOrder = async (orderDetails) => {
    const totals = getCartTotal(user.isFirstOrder, orderDetails.orderType);
    
    const order = {
      id: `ORD-${Date.now()}`,
      ...orderDetails,
      items: [...cart],
      totals,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
      isFirstOrder: user.isFirstOrder
    };
    
    setOrders(prev => [...prev, order]);
    
    if (user.isFirstOrder) {
      localStorage.setItem(`tasteOfEgypt_ordered_${user.email}`, 'true');
      setUser(prev => ({ ...prev, isFirstOrder: false }));
    }
    
    clearCart();
    
    // Send email notifications (non-blocking)
    sendOrderConfirmation(order).then(result => {
      if (result.success) {
        console.log('✅ Customer confirmation email sent');
      }
    });
    
    sendAdminNotification(order).then(result => {
      if (result.success) {
        console.log('✅ Admin notification email sent');
      }
    });
    
    showNotification('Order placed! Check your email for confirmation.');
    return order;
  };

  const updateOrderStatus = async (orderId, status) => {
    const order = orders.find(o => o.id === orderId);
    
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status, updatedAt: new Date().toISOString() } 
        : o
    ));
    
    // Send status update email to customer (non-blocking)
    if (order) {
      sendStatusUpdate({ ...order, status }, status).then(result => {
        if (result.success) {
          console.log(`✅ Status update email sent for ${orderId}`);
        }
      });
    }
    
    showNotification(`Order ${orderId} ${status}`);
  };

  const value = {
    // User
    user,
    login,
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
    
    // Navigation
    currentPage,
    setCurrentPage,
    
    // Notifications
    notification,
    showNotification,
    
    // Data
    menuItems,
    DELIVERY_FEE,
    TAX_RATE
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
