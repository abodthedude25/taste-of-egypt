import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import config from '../config/index.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], validate, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      provider: 'email'
    });
    
    // Generate token
    const token = user.generateToken();
    
    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], validate, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !user.password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Generate token
    const token = user.generateToken();
    
    res.json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/google
// @desc    Google OAuth login/register
// @access  Public
router.post('/google', [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().notEmpty(),
  body('googleId').trim().notEmpty()
], validate, async (req, res) => {
  try {
    const { email, name, googleId, picture } = req.body;
    
    // Find or create user
    let user = await User.findOne({ email });
    
    if (user) {
      // Update Google info if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.picture = picture;
        user.provider = 'google';
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        picture,
        provider: 'google'
      });
    }
    
    const token = user.generateToken();
    
    res.json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/admin
// @desc    Admin login
// @access  Public
router.post('/admin', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], validate, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check against configured admin credentials
    if (email === config.admin.email && password === config.admin.password) {
      // Find or create admin user
      let admin = await User.findOne({ email, isAdmin: true });
      
      if (!admin) {
        admin = await User.create({
          name: 'Admin',
          email,
          isAdmin: true,
          provider: 'email'
        });
      }
      
      const token = admin.generateToken();
      
      return res.json({
        success: true,
        token,
        user: admin
      });
    }
    
    res.status(401).json({ 
      success: false, 
      message: 'Invalid admin credentials' 
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, [
  body('name').optional().trim().notEmpty(),
  body('phone').optional().trim()
], validate, async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    
    await user.save();
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
