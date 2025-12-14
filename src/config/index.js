// ============================================
// CONFIGURATION - Replace with your actual keys
// ============================================

// Google OAuth Configuration
// Get your Client ID from: https://console.cloud.google.com/apis/credentials
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

// EmailJS Configuration  
// Sign up at: https://www.emailjs.com/
// 1. Create an account (free tier: 200 emails/month)
// 2. Add an email service (Gmail, Outlook, etc.)
// 3. Create email templates
// 4. Get your keys from the dashboard
export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY',
  templates: {
    orderConfirmation: import.meta.env.VITE_EMAILJS_TEMPLATE_ORDER || 'template_order_confirm',
    orderStatusUpdate: import.meta.env.VITE_EMAILJS_TEMPLATE_STATUS || 'template_status_update',
    adminNotification: import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN || 'template_admin_notify'
  }
};

// Restaurant Configuration
export const RESTAURANT_CONFIG = {
  name: 'Taste of Egypt YYC',
  email: 'orders@tasteofegyptyyc.ca',
  phone: '(403) 555-0123',
  address: '123 Centre Street NW, Calgary, AB T2E 2R4',
  eTransferEmail: 'pay@tasteofegyptyyc.ca'
};

// Check if running with real credentials
export const isConfigured = () => {
  return GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID' && 
         EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID';
};
