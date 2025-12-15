import nodemailer from 'nodemailer';
import config from '../config/index.js';

// Create transporter
let transporter = null;

const initTransporter = () => {
  if (!config.email.user || !config.email.pass) {
    console.log('⚠️  Email not configured - emails will be logged to console');
    return null;
  }
  
  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false,
    auth: {
      user: config.email.user,
      pass: config.email.pass
    }
  });
};

// Format currency
const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

// Format order items for email
const formatOrderItems = (items) => {
  return items.map(item => 
    `• ${item.quantity}x ${item.name} - ${formatCurrency(item.price * item.quantity)}`
  ).join('\n');
};

// Send email helper
const sendEmail = async (to, subject, html, text) => {
  if (!transporter) {
    transporter = initTransporter();
  }
  
  if (!transporter) {
    console.log('📧 [DEV MODE] Email would be sent:');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body: ${text || 'See HTML'}`);
    return { success: true, dev: true };
  }
  
  try {
    const result = await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      html,
      text
    });
    console.log(`✅ Email sent to ${to}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`❌ Email failed:`, error.message);
    return { success: false, error: error.message };
  }
};

// Send order confirmation to customer
export const sendOrderConfirmation = async (order, user) => {
  const subject = `Order ${order.orderId} Received - ${config.restaurant.name}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1E3A5F 0%, #D4AF37 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">🏺 ${config.restaurant.name}</h1>
      </div>
      
      <div style="padding: 20px; background: #FDF5E6;">
        <h2 style="color: #1E3A5F;">Thank you for your order, ${user.name}!</h2>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>Order #:</strong> ${order.orderId}</p>
          <p><strong>Type:</strong> ${order.orderType === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}</p>
          ${order.scheduledTime ? `<p><strong>Scheduled:</strong> ${order.scheduledTime}</p>` : ''}
        </div>
        
        <h3 style="color: #1E3A5F;">Order Items:</h3>
        <div style="background: white; padding: 15px; border-radius: 8px;">
          ${order.items.map(item => `
            <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee;">
              <span>${item.quantity}x ${item.name}</span>
              <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
          `).join('')}
          
          <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #D4AF37;">
            <div style="display: flex; justify-content: space-between;"><span>Subtotal:</span><span>${formatCurrency(order.subtotal)}</span></div>
            ${order.orderType === 'delivery' ? `<div style="display: flex; justify-content: space-between;"><span>Delivery${order.isFirstOrder ? ' (FREE!)' : ''}:</span><span>${formatCurrency(order.deliveryFee)}</span></div>` : ''}
            <div style="display: flex; justify-content: space-between;"><span>Tax (5%):</span><span>${formatCurrency(order.tax)}</span></div>
            <div style="display: flex; justify-content: space-between; font-size: 1.2em; font-weight: bold; margin-top: 10px;">
              <span>Total:</span><span style="color: #D4AF37;">${formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
        
        ${order.orderType === 'delivery' ? `
          <h3 style="color: #1E3A5F;">Delivery Address:</h3>
          <div style="background: white; padding: 15px; border-radius: 8px;">
            ${order.address.street}<br>
            ${order.address.city}, ${order.address.postalCode}
          </div>
        ` : ''}
        
        <div style="background: #D4AF37; color: #1E3A5F; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <h3 style="margin-top: 0;">💳 Payment Instructions</h3>
          <p>Please send an <strong>e-Transfer</strong> to:</p>
          <p style="font-size: 1.2em; font-weight: bold;">${config.restaurant.eTransferEmail}</p>
          <p>Reference: <strong>${order.orderId}</strong></p>
        </div>
        
        <p style="margin-top: 20px; color: #666;">
          Questions? Call us at ${config.restaurant.phone}
        </p>
      </div>
      
      <div style="background: #1E3A5F; color: white; padding: 15px; text-align: center;">
        <p style="margin: 0;">${config.restaurant.name} | ${config.restaurant.address}</p>
      </div>
    </div>
  `;
  
  const text = `
${config.restaurant.name}

Thank you for your order, ${user.name}!

Order #: ${order.orderId}
Type: ${order.orderType}

Items:
${formatOrderItems(order.items)}

Subtotal: ${formatCurrency(order.subtotal)}
${order.orderType === 'delivery' ? `Delivery: ${formatCurrency(order.deliveryFee)}` : ''}
Tax: ${formatCurrency(order.tax)}
Total: ${formatCurrency(order.total)}

PAYMENT: Send e-Transfer to ${config.restaurant.eTransferEmail}
Reference: ${order.orderId}

Questions? Call ${config.restaurant.phone}
  `;
  
  return sendEmail(user.email, subject, html, text);
};

// Send status update to customer
export const sendStatusUpdate = async (order, user, newStatus) => {
  const statusMessages = {
    confirmed: { emoji: '✅', message: 'Your order has been confirmed and payment received!' },
    preparing: { emoji: '👨‍🍳', message: 'Your delicious Egyptian feast is now being prepared!' },
    ready: { 
      emoji: order.orderType === 'delivery' ? '🚗' : '🏪', 
      message: order.orderType === 'delivery' 
        ? 'Your order is ready and out for delivery!' 
        : 'Your order is ready for pickup!'
    },
    completed: { emoji: '🎉', message: 'Thank you for dining with us! We hope you enjoyed your meal.' },
    cancelled: { emoji: '❌', message: 'Your order has been cancelled. If you have questions, please contact us.' }
  };
  
  const statusInfo = statusMessages[newStatus] || { emoji: '📋', message: `Your order status is now: ${newStatus}` };
  
  const subject = `${statusInfo.emoji} Order ${order.orderId} - ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1E3A5F 0%, #D4AF37 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">🏺 ${config.restaurant.name}</h1>
      </div>
      
      <div style="padding: 20px; background: #FDF5E6; text-align: center;">
        <div style="font-size: 48px; margin: 20px 0;">${statusInfo.emoji}</div>
        <h2 style="color: #1E3A5F;">Order Update</h2>
        <p style="font-size: 1.1em;">${statusInfo.message}</p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; display: inline-block;">
          <p><strong>Order #:</strong> ${order.orderId}</p>
          <p><strong>Status:</strong> <span style="color: #D4AF37; font-weight: bold;">${newStatus.toUpperCase()}</span></p>
        </div>
        
        <p style="color: #666;">Questions? Call ${config.restaurant.phone}</p>
      </div>
    </div>
  `;
  
  return sendEmail(user.email, subject, html);
};

// Send notification to admin about new order
export const sendAdminNotification = async (order, user) => {
  const adminEmail = config.admin.email;
  const subject = `🔔 New Order ${order.orderId} - ${formatCurrency(order.total)}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #E07B53; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">🔔 NEW ORDER</h1>
      </div>
      
      <div style="padding: 20px; background: #f5f5f5;">
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h2 style="margin-top: 0; color: #1E3A5F;">Order ${order.orderId}</h2>
          <p><strong>Total:</strong> <span style="color: #D4AF37; font-size: 1.3em;">${formatCurrency(order.total)}</span></p>
          ${order.isFirstOrder ? '<p style="color: green; font-weight: bold;">🎁 FIRST ORDER - FREE DELIVERY</p>' : ''}
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h3 style="margin-top: 0;">Customer Info</h3>
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h3 style="margin-top: 0;">${order.orderType === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}</h3>
          ${order.orderType === 'delivery' ? `
            <p>${order.address.street}<br>${order.address.city}, ${order.address.postalCode}</p>
          ` : '<p>Customer will pick up</p>'}
          ${order.scheduledTime ? `<p><strong>Scheduled:</strong> ${order.scheduledTime}</p>` : '<p><strong>Time:</strong> ASAP</p>'}
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h3 style="margin-top: 0;">Items</h3>
          ${order.items.map(item => `
            <div style="padding: 5px 0; border-bottom: 1px solid #eee;">
              <strong>${item.quantity}x</strong> ${item.name} - ${formatCurrency(item.price * item.quantity)}
            </div>
          `).join('')}
        </div>
        
        ${order.notes ? `
          <div style="background: #FFF3CD; padding: 15px; border-radius: 8px;">
            <h3 style="margin-top: 0;">📝 Special Instructions</h3>
            <p>${order.notes}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  return sendEmail(adminEmail, subject, html);
};

export default {
  sendOrderConfirmation,
  sendStatusUpdate,
  sendAdminNotification
};
