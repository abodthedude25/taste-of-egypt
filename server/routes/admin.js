import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { sendStatusUpdate } from '../services/emailService.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// @route   GET /api/admin/orders
// @desc    Get all orders (with filters)
// @access  Admin
router.get('/orders', async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      orders
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/orders/:id
// @desc    Get single order (admin view)
// @access  Admin
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id })
      .populate('user', 'name email phone');
    
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
    console.error('Admin get order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Admin
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }
    
    const order = await Order.findOne({ orderId: req.params.id })
      .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    // Update status and timestamp
    order.status = status;
    const timestampField = `${status}At`;
    if (order.schema.paths[timestampField]) {
      order[timestampField] = new Date();
    }
    
    // If confirmed, also mark payment as received
    if (status === 'confirmed') {
      order.paymentStatus = 'received';
    }
    
    await order.save();
    
    // Send status update email to customer
    if (order.user) {
      sendStatusUpdate(order, order.user, status).catch(err => 
        console.error('Failed to send status update email:', err)
      );
    }
    
    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [
      pendingCount,
      confirmedCount,
      preparingCount,
      readyCount,
      todayOrders,
      todayRevenue,
      totalOrders,
      totalRevenue
    ] = await Promise.all([
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'confirmed' }),
      Order.countDocuments({ status: 'preparing' }),
      Order.countDocuments({ status: 'ready' }),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: today }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.countDocuments({ status: { $ne: 'cancelled' } }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);
    
    res.json({
      success: true,
      stats: {
        pending: pendingCount,
        confirmed: confirmedCount,
        preparing: preparingCount,
        ready: readyCount,
        todayOrders,
        todayRevenue: todayRevenue[0]?.total || 0,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
