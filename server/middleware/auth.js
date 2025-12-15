import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/index.js';

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized - no token' 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Get user from token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized - invalid token' 
    });
  }
};

// Admin only middleware
export const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
};

export default { protect, adminOnly };
