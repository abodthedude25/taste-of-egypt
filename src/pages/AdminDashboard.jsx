import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/ui/Icons';

const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];

export function AdminDashboard() {
  const { orders, updateOrderStatus, isAdmin, setCurrentPage } = useApp();
  const [filter, setFilter] = useState('all');

  // Redirect if not admin
  if (!isAdmin) {
    setCurrentPage('admin-login');
    return null;
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  // Calculate stats
  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    revenue: orders
      .filter(o => ['confirmed', 'preparing', 'ready', 'completed'].includes(o.status))
      .reduce((sum, o) => sum + o.total, 0)
  };

  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1><Icons.Dashboard /> Order Management</h1>
        <p>Manage incoming orders and track status</p>
      </div>
      
      <div className="admin-container">
        {/* Stats Cards */}
        <div className="admin-stats">
          <div className="stat-card pending">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card confirmed">
            <span className="stat-value">{stats.confirmed}</span>
            <span className="stat-label">Confirmed</span>
          </div>
          <div className="stat-card preparing">
            <span className="stat-value">{stats.preparing}</span>
            <span className="stat-label">Preparing</span>
          </div>
          <div className="stat-card revenue">
            <span className="stat-value">${stats.revenue.toFixed(0)}</span>
            <span className="stat-label">Revenue</span>
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="admin-filters">
          {['all', 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="filter-count">
                  {orders.filter(o => o.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {/* Orders List */}
        <div className="admin-orders">
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <p>No orders found</p>
            </div>
          ) : (
            [...filteredOrders].reverse().map(order => (
              <div key={order.id} className={`admin-order-card ${order.status}`}>
                {/* Order Header */}
                <div className="order-card-header">
                  <div className="order-main-info">
                    <span className="order-id">{order.id}</span>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  <span className="order-time">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                
                {/* Order Body */}
                <div className="order-card-body">
                  <div className="customer-info">
                    <h4>{order.userName}</h4>
                    <p><Icons.Email /> {order.userEmail}</p>
                    <p><Icons.Phone /> {order.phone}</p>
                    {order.orderType === 'delivery' && (
                      <p><Icons.MapPin /> {order.address}, {order.postalCode}</p>
                    )}
                  </div>
                  
                  <div className="order-schedule">
                    <p>
                      <Icons.Clock /> {order.preferredDate} at {order.preferredTime}
                    </p>
                    <p>
                      {order.orderType === 'delivery' ? <Icons.Truck /> : <Icons.MapPin />}
                      {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                    </p>
                    {order.isFirstOrder && (
                      <span className="first-order-tag">🎉 First Order - Free Delivery</span>
                    )}
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="order-items-list">
                  <h5>Order Items:</h5>
                  {order.items.map(item => (
                    <div key={item.id} className="order-item-row">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.notes && (
                    <div className="order-notes">
                      <strong>Notes:</strong> {order.notes}
                    </div>
                  )}
                </div>
                
                {/* Order Footer with Actions */}
                <div className="order-card-footer">
                  <span className="order-total">Total: ${order.total.toFixed(2)}</span>
                  
                  <div className="status-actions">
                    {order.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        >
                          <Icons.Check /> Approve & Send Payment Request
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        >
                          Decline
                        </button>
                      </>
                    )}
                    
                    {order.status !== 'pending' && 
                     order.status !== 'completed' && 
                     order.status !== 'cancelled' && (
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="status-select"
                      >
                        {statusFlow.map(s => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;
