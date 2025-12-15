import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { sendOrderConfirmation, sendAdminNotification, sendStatusUpdate } from '../services/emailService.js';

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderId: req.params.id,
      user: req.user._id 
    });
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, [
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('items.*.menuItemId').notEmpty(),
  body('items.*.name').notEmpty(),
  body('items.*.price').isNumeric(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('orderType').isIn(['delivery', 'pickup']),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('subtotal').isNumeric(),
  body('tax').isNumeric(),
  body('total').isNumeric()
], validate, async (req, res) => {
  try {
    const {
      items,
      orderType,
      address,
      phone,
      scheduledTime,
      notes,
      subtotal,
      deliveryFee,
      tax,
      total
    } = req.body;
    
    // Create order
    const order = await Order.create({
      orderId: Order.generateOrderId(),
      user: req.user._id,
      items,
      orderType,
      address: orderType === 'delivery' ? address : undefined,
      phone,
      scheduledTime,
      notes,
      subtotal,
      deliveryFee: deliveryFee || 0,
      tax,
      total,
      isFirstOrder: req.user.isFirstOrder
    });
    
    // Update user's first order status
    if (req.user.isFirstOrder) {
      await User.findByIdAndUpdate(req.user._id, { isFirstOrder: false });
    }
    
    // Send emails (non-blocking)
    sendOrderConfirmation(order, req.user).catch(err => 
      console.error('Failed to send confirmation email:', err)
    );
    
    sendAdminNotification(order, req.user).catch(err => 
      console.error('Failed to send admin notification:', err)
    );
    
    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Cancel order (only if pending)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderId: req.params.id,
      user: req.user._id 
    });
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Can only cancel pending orders' 
      });
    }
    
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();
    
    // Send cancellation email
    sendStatusUpdate(order, req.user, 'cancelled').catch(err => 
      console.error('Failed to send cancellation email:', err)
    );
    
    res.json({
      success: true,
      message: 'Order cancelled',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
