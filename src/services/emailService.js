import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, RESTAURANT_CONFIG, isConfigured } from '../config';

// Initialize EmailJS
let initialized = false;

const initEmailJS = () => {
  if (!initialized && isConfigured()) {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    initialized = true;
  }
};

// Format currency
const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

// Format order items for email
const formatOrderItems = (items) => {
  return items.map(item => 
    `${item.quantity}x ${item.name} - ${formatCurrency(item.price * item.quantity)}`
  ).join('\n');
};

// Send order confirmation to customer
export const sendOrderConfirmation = async (order) => {
  initEmailJS();
  
  if (!isConfigured()) {
    console.log('📧 [DEV MODE] Order confirmation email would be sent to:', order.userEmail);
    console.log('Order details:', order);
    return { success: true, dev: true };
  }

  try {
    const templateParams = {
      to_email: order.userEmail,
      to_name: order.userName,
      order_id: order.id,
      order_type: order.orderType === 'delivery' ? 'Delivery' : 'Pickup',
      order_items: formatOrderItems(order.items),
      subtotal: formatCurrency(order.totals.subtotal),
      delivery_fee: order.orderType === 'delivery' ? formatCurrency(order.totals.deliveryFee) : 'N/A',
      tax: formatCurrency(order.totals.tax),
      total: formatCurrency(order.totals.total),
      delivery_address: order.orderType === 'delivery' ? order.address : 'Pickup at restaurant',
      scheduled_time: order.scheduledTime || 'ASAP',
      etransfer_email: RESTAURANT_CONFIG.eTransferEmail,
      restaurant_name: RESTAURANT_CONFIG.name,
      restaurant_phone: RESTAURANT_CONFIG.phone,
      special_instructions: order.notes || 'None'
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.orderConfirmation,
      templateParams
    );

    console.log('✅ Order confirmation sent:', response.status);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Failed to send order confirmation:', error);
    return { success: false, error };
  }
};

// Send status update to customer
export const sendStatusUpdate = async (order, newStatus) => {
  initEmailJS();

  const statusMessages = {
    confirmed: 'Great news! Your order has been confirmed and payment received.',
    preparing: 'Your delicious Egyptian feast is now being prepared!',
    ready: order.orderType === 'delivery' 
      ? 'Your order is ready and out for delivery!' 
      : 'Your order is ready for pickup!',
    completed: 'Thank you for dining with us! We hope you enjoyed your meal.',
    cancelled: 'Your order has been cancelled. If you have questions, please contact us.'
  };

  if (!isConfigured()) {
    console.log('📧 [DEV MODE] Status update email would be sent to:', order.userEmail);
    console.log('New status:', newStatus, '-', statusMessages[newStatus]);
    return { success: true, dev: true };
  }

  try {
    const templateParams = {
      to_email: order.userEmail,
      to_name: order.userName,
      order_id: order.id,
      new_status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
      status_message: statusMessages[newStatus] || `Your order status is now: ${newStatus}`,
      restaurant_name: RESTAURANT_CONFIG.name,
      restaurant_phone: RESTAURANT_CONFIG.phone
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.orderStatusUpdate,
      templateParams
    );

    console.log('✅ Status update sent:', response.status);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Failed to send status update:', error);
    return { success: false, error };
  }
};

// Send notification to admin about new order
export const sendAdminNotification = async (order) => {
  initEmailJS();

  if (!isConfigured()) {
    console.log('📧 [DEV MODE] Admin notification would be sent for order:', order.id);
    return { success: true, dev: true };
  }

  try {
    const templateParams = {
      to_email: RESTAURANT_CONFIG.email,
      order_id: order.id,
      customer_name: order.userName,
      customer_email: order.userEmail,
      customer_phone: order.phone,
      order_type: order.orderType === 'delivery' ? 'Delivery' : 'Pickup',
      order_items: formatOrderItems(order.items),
      total: formatCurrency(order.totals.total),
      delivery_address: order.orderType === 'delivery' ? order.address : 'Pickup',
      scheduled_time: order.scheduledTime || 'ASAP',
      is_first_order: order.isFirstOrder ? 'Yes (FREE DELIVERY)' : 'No',
      special_instructions: order.notes || 'None'
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.adminNotification,
      templateParams
    );

    console.log('✅ Admin notification sent:', response.status);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error);
    return { success: false, error };
  }
};

export default {
  sendOrderConfirmation,
  sendStatusUpdate,
  sendAdminNotification
};
