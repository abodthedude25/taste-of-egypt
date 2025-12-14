# Taste of Egypt YYC 🏺

Authentic Egyptian cuisine ordering website for Calgary, Alberta.

## Project Structure

```
taste-of-egypt-final/
├── public/
│   └── images/           # Menu item images
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   │   ├── Icons.jsx
│   │   │   └── Notification.jsx
│   │   ├── layout/       # Layout components
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── Hero.jsx
│   │   └── MenuItemCard.jsx
│   ├── pages/            # Page components
│   │   ├── HomePage.jsx
│   │   ├── MenuPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrderConfirmationPage.jsx
│   │   ├── MyOrdersPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── AdminLoginPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AboutPage.jsx
│   │   └── ContactPage.jsx
│   ├── context/
│   │   └── AppContext.jsx  # Global state management
│   ├── data/
│   │   └── menuItems.js    # Menu data & constants
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # All styles
├── index.html
├── package.json
└── vite.config.js
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:5173`

## Features

### Customer Features
- 🍽️ Browse authentic Egyptian menu (11 items)
- 🛒 Add items to cart with quantity controls
- 📍 Delivery or pickup options
- 📅 Schedule orders in advance
- 🎁 First order gets FREE delivery
- 📧 Email notifications (console logged)
- 📋 View order history

### Admin Features
- 📊 Dashboard with live stats
- ✅ Approve/decline pending orders
- 🔄 Update order status workflow
- 🔍 Filter orders by status

### Admin Login
- **URL:** Click "Staff Portal" in footer
- **Email:** admin@tasteofegypt.ca
- **Password:** admin123

## Order Status Flow

```
pending → confirmed → preparing → ready → completed
    ↓
cancelled
```

## Customization

### Menu Items
Edit `src/data/menuItems.js` to add/modify menu items.

### Styling
All styles are in `src/index.css` with CSS variables:
- `--egyptian-gold`: #D4AF37
- `--nile-blue`: #1E3A5F
- `--desert-sand`: #F5E6D3
- `--papyrus`: #FDF5E6
- `--terracotta`: #E07B53

### Adding Pages
1. Create new file in `src/pages/`
2. Export from `src/pages/index.js`
3. Add route in `src/App.jsx`

## Production Deployment

Before deploying to production:

1. **Google OAuth:** Replace mock auth with real Google OAuth
2. **Email Service:** Integrate SendGrid, Mailgun, or similar
3. **Database:** Add backend with real database
4. **Payment:** Add payment verification for e-Transfer

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

---

Made with ❤️ for Egyptian food lovers in Calgary
