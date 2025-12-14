# Taste of Egypt YYC 🏺

Authentic Egyptian cuisine ordering website for Calgary, Alberta.

## Quick Start (Development Mode)

```bash
npm install
npm run dev
```

The app works immediately in dev mode with mock authentication. For production, follow the setup guides below.

---

## Production Setup

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Select **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
7. Copy your **Client ID**

### 2. EmailJS Setup

1. Sign up at [EmailJS](https://www.emailjs.com/) (free: 200 emails/month)
2. **Add Email Service:**
   - Dashboard > Email Services > Add New Service
   - Connect your Gmail/Outlook/etc.
   - Note your **Service ID**

3. **Create Email Templates:**

   **Template 1: Order Confirmation** (`template_order_confirm`)
   ```
   Subject: Order {{order_id}} Confirmed - {{restaurant_name}}
   
   Hi {{to_name}},
   
   Thank you for your order!
   
   Order #: {{order_id}}
   Type: {{order_type}}
   
   Items:
   {{order_items}}
   
   Subtotal: {{subtotal}}
   Delivery: {{delivery_fee}}
   Tax: {{tax}}
   Total: {{total}}
   
   {{#if delivery_address}}
   Delivery to: {{delivery_address}}
   {{/if}}
   
   Scheduled: {{scheduled_time}}
   
   💳 PAYMENT INSTRUCTIONS:
   Send e-Transfer to: {{etransfer_email}}
   Reference: {{order_id}}
   
   Questions? Call {{restaurant_phone}}
   
   {{restaurant_name}}
   ```

   **Template 2: Status Update** (`template_status_update`)
   ```
   Subject: Order {{order_id}} - {{new_status}}
   
   Hi {{to_name}},
   
   {{status_message}}
   
   Order #: {{order_id}}
   Status: {{new_status}}
   
   Questions? Call {{restaurant_phone}}
   
   {{restaurant_name}}
   ```

   **Template 3: Admin Notification** (`template_admin_notify`)
   ```
   Subject: 🔔 New Order {{order_id}}
   
   NEW ORDER RECEIVED!
   
   Order #: {{order_id}}
   Customer: {{customer_name}}
   Email: {{customer_email}}
   Phone: {{customer_phone}}
   
   Type: {{order_type}}
   First Order: {{is_first_order}}
   
   Items:
   {{order_items}}
   
   Total: {{total}}
   
   {{#if delivery_address}}
   Deliver to: {{delivery_address}}
   {{/if}}
   
   Scheduled: {{scheduled_time}}
   
   Notes: {{special_instructions}}
   ```

4. Copy your **Public Key** from Account > General

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:
```
VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_TEMPLATE_ORDER=template_order_confirm
VITE_EMAILJS_TEMPLATE_STATUS=template_status_update
VITE_EMAILJS_TEMPLATE_ADMIN=template_admin_notify
```

### 4. Build & Deploy

```bash
npm run build
```

Deploy the `dist/` folder to your hosting (Vercel, Netlify, etc.)

---

## Project Structure

```
src/
├── components/
│   ├── ui/           # Icons, Notification
│   ├── layout/       # Header, Footer
│   ├── Hero.jsx
│   └── MenuItemCard.jsx
├── pages/            # All page components
├── context/          # AppContext (state management)
├── services/         # Email service
├── config/           # API keys configuration
└── data/             # Menu items
```

## Features

- 🍽️ 11 authentic Egyptian dishes
- 🛒 Full cart system
- 📍 Delivery & pickup options
- 🎁 First order free delivery
- 📧 Real email notifications
- 🔐 Google OAuth authentication
- 👨‍💼 Admin dashboard

## Admin Access

- **URL:** Footer > Staff Portal
- **Email:** admin@tasteofegypt.ca
- **Password:** admin123

## Customization

### Update Restaurant Info
Edit `src/config/index.js`:
```javascript
export const RESTAURANT_CONFIG = {
  name: 'Your Restaurant',
  email: 'orders@yourdomain.com',
  phone: '(403) 555-0123',
  address: '123 Main St, Calgary',
  eTransferEmail: 'pay@yourdomain.com'
};
```

### Add Menu Items
Edit `src/data/menuItems.js`

### Styling
Edit `src/index.css` - uses CSS variables for theming

---

## Tech Stack

- React 18
- Vite
- Google OAuth (@react-oauth/google)
- EmailJS (@emailjs/browser)
- CSS (no framework)

---

Made with ❤️ for Egyptian food lovers in Calgary
