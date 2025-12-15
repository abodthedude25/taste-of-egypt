# Taste of Egypt YYC 🏺

Full-stack Egyptian cuisine ordering application for Calgary, Alberta.

## Tech Stack

**Frontend:** React 18, Vite, Google OAuth  
**Backend:** Node.js, Express, MongoDB, JWT  
**Email:** Nodemailer (server-side)

---

## Quick Start (Development)

### Option 1: Frontend Only (No Backend)
```bash
# Install and run frontend
npm install
npm run dev
```
Works immediately with localStorage - no database needed.

### Option 2: Full Stack
```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start backend
cd server
npm install
cp .env.example .env  # Edit with your values
npm run dev

# Terminal 3: Start frontend
cd ..
cp .env.example .env
# Set VITE_USE_API=true in .env
npm install
npm run dev
```

---

## Project Structure

```
taste-of-egypt-final/
├── src/                    # Frontend (React)
│   ├── components/         # UI components
│   ├── pages/              # Page components
│   ├── context/            # Global state (AppContext)
│   ├── services/           # API client
│   ├── config/             # Frontend config
│   └── data/               # Menu data
├── server/                 # Backend (Node.js)
│   ├── config/             # Database & app config
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── services/           # Email service
└── public/                 # Static assets
```

---

## Backend Setup

### 1. MongoDB Setup

**Local MongoDB:**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt install mongodb
sudo systemctl start mongodb
```

**MongoDB Atlas (Cloud):**
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/taste-of-egypt`

### 2. Configure Server Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/taste-of-egypt

# JWT (generate a secure random string!)
JWT_SECRET=your-very-long-random-secret-key-here

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Admin
ADMIN_EMAIL=admin@tasteofegypt.ca
ADMIN_PASSWORD=change-this-password
```

### 3. Gmail App Password Setup

1. Enable 2-Factor Authentication on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Use this password as `EMAIL_PASS`

### 4. Start the Server

```bash
cd server
npm install
npm run dev
```

Server runs on `http://localhost:5000`

---

## Frontend Setup

### 1. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Enable API mode
VITE_USE_API=true
VITE_API_URL=http://localhost:5000/api

# Google OAuth (optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 2. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → APIs & Services → Credentials
3. Create OAuth Client ID (Web application)
4. Add authorized origins:
   - `http://localhost:5173`
   - `https://yourdomain.com` (production)
5. Copy Client ID to `.env`

### 3. Start Frontend

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/admin` | Admin login |
| GET | `/api/auth/me` | Get current user |

### Orders (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get user's orders |
| POST | `/api/orders` | Create new order |
| DELETE | `/api/orders/:id` | Cancel pending order |

### Admin (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/orders` | Get all orders |
| PUT | `/api/admin/orders/:id/status` | Update order status |
| GET | `/api/admin/stats` | Get dashboard stats |

### Menu (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Get all menu items |
| GET | `/api/menu/categories` | Get categories |

---

## Features

### Customer Features
- 🍽️ Browse 11 authentic Egyptian dishes
- 🛒 Shopping cart with quantity controls
- 📍 Delivery or pickup options
- 📅 Schedule orders in advance
- 🎁 FREE delivery on first order
- 📧 Email confirmations
- 📋 Order history

### Admin Features
- 📊 Real-time dashboard stats
- ✅ Approve/decline orders
- 🔄 Update order status
- 📧 Automatic customer notifications
- 🔍 Filter orders by status

---

## Email Notifications

Customers receive emails when:
1. **Order placed** - Confirmation with payment instructions
2. **Order confirmed** - Payment received
3. **Order preparing** - Kitchen started
4. **Order ready** - Ready for pickup/delivery
5. **Order completed** - Thank you message
6. **Order cancelled** - Cancellation notice

Admins receive:
- New order notifications

---

## Deployment

### Backend (Render, Railway, etc.)

1. Push code to GitHub
2. Create new Web Service
3. Set environment variables
4. Deploy

### Frontend (Vercel, Netlify)

```bash
npm run build
# Deploy dist/ folder
```

Set environment variables:
```
VITE_USE_API=true
VITE_API_URL=https://your-api.com/api
VITE_GOOGLE_CLIENT_ID=your_client_id
```

---

## Admin Access

**URL:** Footer → "Staff Portal"  
**Default credentials:**
- Email: `admin@tasteofegypt.ca`
- Password: `admin123`

⚠️ Change these in production via `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars.

---

## Development Modes

| Mode | Backend | Auth | Data Storage |
|------|---------|------|--------------|
| `VITE_USE_API=false` | Not required | Mock | localStorage |
| `VITE_USE_API=true` | Required | JWT | MongoDB |

---

Made with ❤️ for Egyptian food lovers in Calgary
