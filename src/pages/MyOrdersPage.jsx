import React from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/ui/Icons';

const statusColors = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  preparing: '#8b5cf6',
  ready: '#10b981',
  completed: '#059669',
  cancelled: '#ef4444'
};

export function MyOrdersPage() {
  const { orders, user, setCurrentPage } = useApp();

  if (!user) {
    setCurrentPage('login');
    return null;
  }

  const userOrders = orders
    .filter(o => o.userId === user.id)
    .reverse();

  return (
    <main className="orders-page">
      <div className="page-hero small">
        <h1>My Orders</h1>
      </div>
      
      <div className="container">
        {userOrders.length === 0 ? (
          <div className="empty-orders">
            <h2>No orders yet</h2>
            <p>Start exploring our delicious menu!</p>
            <button 
              className="btn btn-primary" 
              onClick={() => setCurrentPage('menu')}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {userOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <span className="order-id">{order.id}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <span 
                    className="order-status" 
                    style={{ backgroundColor: statusColors[order.status] }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <div className="order-items">
                  {order.items.map(item => (
                    <div key={item.id} className="order-item">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="order-footer">
                  <div className="order-meta">
                    <span>
                      <Icons.Clock /> {order.preferredDate} at {order.preferredTime}
                    </span>
                    <span>
                      {order.orderType === 'delivery' ? <Icons.Truck /> : <Icons.MapPin />}
                      {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                    </span>
                  </div>
                  <span className="order-total">Total: ${order.total.toFixed(2)}</span>
                </div>
                
                {order.status === 'confirmed' && (
                  <div className="payment-reminder">
                    <Icons.Email />
                    <p>Payment pending. Please check your email for e-Transfer instructions.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyOrdersPage;
