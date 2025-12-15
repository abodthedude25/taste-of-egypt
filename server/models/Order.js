import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: String
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  
  // Order type
  orderType: {
    type: String,
    enum: ['delivery', 'pickup'],
    required: true
  },
  
  // Delivery address (if delivery)
  address: {
    street: String,
    city: String,
    postalCode: String
  },
  
  // Contact info
  phone: {
    type: String,
    required: true
  },
  
  // Scheduling
  scheduledTime: String,
  
  // Notes
  notes: String,
  
  // Totals
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  
  // First order discount
  isFirstOrder: {
    type: Boolean,
    default: false
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'received', 'refunded'],
    default: 'pending'
  },
  
  // Timestamps for status changes
  confirmedAt: Date,
  preparingAt: Date,
  readyAt: Date,
  completedAt: Date,
  cancelledAt: Date
}, {
  timestamps: true
});

// Generate order ID
orderSchema.statics.generateOrderId = function() {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
};

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderId: 1 });

export default mongoose.model('Order', orderSchema);
