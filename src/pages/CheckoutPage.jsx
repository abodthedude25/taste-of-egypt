import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/ui/Icons';

export function CheckoutPage() {
  const { cart, user, placeOrder, setCurrentPage, getCartTotal } = useApp();
  const [orderType, setOrderType] = useState('delivery');
  const [formData, setFormData] = useState({
    address: '',
    city: 'Calgary',
    postalCode: '',
    phone: '',
    notes: '',
    preferredDate: '',
    preferredTime: ''
  });

  const { subtotal, deliveryFee, tax, total } = getCartTotal(
    user?.isFirstOrder, 
    orderType
  );

  // Generate available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  const availableTimes = [
    '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', 
    '5:00 PM', '6:00 PM', '7:00 PM'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    placeOrder({
      orderType,
      ...formData,
      subtotal,
      deliveryFee,
      tax,
      total
    });
    setCurrentPage('order-confirmation');
  };

  // Redirect if not logged in or cart is empty
  if (!user) {
    setCurrentPage('login');
    return null;
  }
  
  if (cart.length === 0) {
    setCurrentPage('menu');
    return null;
  }

  return (
    <main className="checkout-page">
      <div className="page-hero small">
        <h1>Checkout</h1>
      </div>
      
      <div className="container">
        <form onSubmit={handleSubmit} className="checkout-layout">
          {/* Checkout Form */}
          <div className="checkout-form">
            {/* Order Type */}
            <section className="checkout-section">
              <h2>Order Type</h2>
              <div className="order-type-selector">
                <button
                  type="button"
                  className={`order-type-btn ${orderType === 'delivery' ? 'active' : ''}`}
                  onClick={() => setOrderType('delivery')}
                >
                  <Icons.Truck />
                  <span>Delivery</span>
                  {user?.isFirstOrder && <span className="free-tag">FREE</span>}
                </button>
                <button
                  type="button"
                  className={`order-type-btn ${orderType === 'pickup' ? 'active' : ''}`}
                  onClick={() => setOrderType('pickup')}
                >
                  <Icons.MapPin />
                  <span>Pickup</span>
                </button>
              </div>
            </section>

            {/* Delivery Address */}
            {orderType === 'delivery' && (
              <section className="checkout-section">
                <h2>Delivery Address</h2>
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" value="Calgary" disabled />
                  </div>
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="T2X 1X1"
                      required
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Pickup Info */}
            {orderType === 'pickup' && (
              <section className="checkout-section pickup-info">
                <h2>Pickup Location</h2>
                <div className="pickup-address">
                  <Icons.MapPin />
                  <div>
                    <strong>Taste of Egypt YYC</strong>
                    <p>Address will be provided upon order confirmation</p>
                  </div>
                </div>
              </section>
            )}

            {/* Schedule */}
            <section className="checkout-section">
              <h2>Schedule Your Order</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Date</label>
                  <select
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    required
                  >
                    <option value="">Select a date</option>
                    {availableDates.map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Preferred Time</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    required
                  >
                    <option value="">Select a time</option>
                    {availableTimes.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Contact Info */}
            <section className="checkout-section">
              <h2>Contact Information</h2>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(403) 555-0123"
                  required
                />
              </div>
              <div className="form-group">
                <label>Special Instructions (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any allergies or special requests?"
                  rows={3}
                />
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-items">
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                {deliveryFee === 0 ? (
                  <span className="free-delivery">FREE</span>
                ) : (
                  <span>${deliveryFee.toFixed(2)}</span>
                )}
              </div>
              <div className="summary-row">
                <span>GST (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="payment-notice">
              <Icons.Email />
              <p>
                <strong>Payment Instructions</strong><br />
                After your order is confirmed, you'll receive an email with e-Transfer instructions.
              </p>
            </div>
            
            <button type="submit" className="btn btn-primary btn-block btn-lg">
              Place Order
            </button>
            
            <p className="checkout-note">
              By placing this order, you agree to receive email notifications about your order status.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CheckoutPage;
