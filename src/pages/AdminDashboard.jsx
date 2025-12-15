import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/ui/Icons';

const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];

export function AdminDashboard() {
  const { orders, updateOrderStatus, isAdmin, setCurrentPage, fetchAllOrders, useAPI } = useApp();
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        await fetchAllOrders();
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAdmin) {
      loadOrders();
    }
  }, [isAdmin]);

  // Redirect if not admin
  if (!isAdmin) {
    setCurrentPage('admin-login');
    return null;
  }

  // Get order ID (API uses orderId, localStorage uses id)
  const getOrderId = (order) => order.orderId || order.id;

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
      .reduce((sum, o) => sum + (o.total || 0), 0)
  };

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-header">
          <h1><Icons.Dashboard /> Order Management</h1>
        </div>
        <div className="admin-container">
          <div className="no-orders">
            <p>Loading orders...</p>
          </div>
        </div>
      </main>
    );
  }

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
        
        {/* Refresh Button */}
        <button 
          className="btn btn-secondary" 
          onClick={() => fetchAllOrders()}
          style={{ marginBottom: '1rem' }}
        >
          🔄 Refresh Orders
        </button>
        
        {/* Orders List */}
        <div className="admin-orders">
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <p>No orders found</p>
            </div>
          ) : (
            [...filteredOrders].reverse().map(order => (
              <div key={getOrderId(order)} className={`admin-order-card ${order.status}`}>
                {/* Order Header */}
                <div className="order-card-header">
                  <div className="order-main-info">
                    <span className="order-id">{getOrderId(order)}</span>
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
                    <h4>{order.userName || order.user?.name || 'Customer'}</h4>
                    <p><Icons.Email /> {order.userEmail || order.user?.email}</p>
                    <p><Icons.Phone /> {order.phone}</p>
                    {order.orderType === 'delivery' && order.address && (
                      <p>
                        <Icons.MapPin /> 
                        {typeof order.address === 'object' 
                          ? `${order.address.street}, ${order.address.city} ${order.address.postalCode}`
                          : `${order.address}, ${order.postalCode || ''}`
                        }
                      </p>
                    )}
                  </div>
                  
                  <div className="order-schedule">
                    {order.scheduledTime && (
                      <p><Icons.Clock /> {order.scheduledTime}</p>
                    )}
                    {(order.preferredDate || order.preferredTime) && (
                      <p><Icons.Clock /> {order.preferredDate} at {order.preferredTime}</p>
                    )}
                    <p>
                      {order.orderType === 'delivery' ? <Icons.Truck /> : <Icons.MapPin />}
                      {' '}{order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                    </p>
                    {order.isFirstOrder && (
                      <span className="first-order-tag">🎉 First Order - Free Delivery</span>
                    )}
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="order-items-list">
                  <h5>Order Items:</h5>
                  {order.items.map((item, idx) => (
                    <div key={item.id || item.menuItemId || idx} className="order-item-row">
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
                  <span className="order-total">Total: ${(order.total || 0).toFixed(2)}</span>
                  
                  <div className="status-actions">
                    {order.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => updateOrderStatus(getOrderId(order), 'confirmed')}
                        >
                          <Icons.Check /> Approve & Send Payment Request
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => updateOrderStatus(getOrderId(order), 'cancelled')}
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
                        onChange={(e) => updateOrderStatus(getOrderId(order), e.target.value)}
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
