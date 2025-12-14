import React from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/ui/Icons';

export function OrderConfirmationPage() {
  const { orders, setCurrentPage } = useApp();
  const latestOrder = orders[orders.length - 1];

  if (!latestOrder) {
    setCurrentPage('home');
    return null;
  }

  return (
    <main className="confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          <div className="confirmation-icon">
            <Icons.Check />
          </div>
          
          <h1>Order Placed Successfully!</h1>
          <p className="order-id">
            Order ID: <strong>{latestOrder.id}</strong>
          </p>
          
          <div className="confirmation-details">
            {/* What's Next */}
            <div className="detail-section">
              <h3>What happens next?</h3>
              <ol className="steps-list">
                <li>
                  <span className="step-number">1</span>
                  <div>
                    <strong>Order Review</strong>
                    <p>Our kitchen will review your order and confirm availability</p>
                  </div>
                </li>
                <li>
                  <span className="step-number">2</span>
                  <div>
                    <strong>Confirmation Email</strong>
                    <p>You'll receive an email with order confirmation and e-Transfer details</p>
                  </div>
                </li>
                <li>
                  <span className="step-number">3</span>
                  <div>
                    <strong>Payment</strong>
                    <p>Complete your payment via Interac e-Transfer</p>
                  </div>
                </li>
                <li>
                  <span className="step-number">4</span>
                  <div>
                    <strong>
                      {latestOrder.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                    </strong>
                    <p>
                      {latestOrder.orderType === 'delivery'
                        ? 'Your fresh meal will be delivered to your door'
                        : 'Pick up your order at the scheduled time'}
                    </p>
                  </div>
                </li>
              </ol>
            </div>
            
            {/* Order Details */}
            <div className="detail-section">
              <h3>Order Details</h3>
              <div className="order-info">
                <div className="info-row">
                  <span>Type:</span>
                  <span>
                    {latestOrder.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                  </span>
                </div>
                <div className="info-row">
                  <span>Date:</span>
                  <span>
                    {new Date(latestOrder.preferredDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="info-row">
                  <span>Time:</span>
                  <span>{latestOrder.preferredTime}</span>
                </div>
                <div className="info-row total">
                  <span>Total:</span>
                  <span>${latestOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="confirmation-actions">
            <button 
              className="btn btn-primary" 
              onClick={() => setCurrentPage('orders')}
            >
              View My Orders
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => setCurrentPage('menu')}
            >
              Order More
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderConfirmationPage;
