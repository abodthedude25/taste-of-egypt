import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/taste-of-egypt',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtExpire: '7d',
  
  // Email configuration (Gmail example)
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'Taste of Egypt <noreply@tasteofegyptyyc.ca>'
  },
  
  // Restaurant info
  restaurant: {
    name: 'Taste of Egypt YYC',
    phone: '(403) 555-0123',
    address: '123 Centre Street NW, Calgary, AB T2E 2R4',
    eTransferEmail: 'pay@tasteofegyptyyc.ca'
  },
  
  // Admin credentials (change in production!)
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@tasteofegypt.ca',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  }
};
