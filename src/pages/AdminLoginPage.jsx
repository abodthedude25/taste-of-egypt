import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/ui/Icons';

export function AdminLoginPage() {
  const { setIsAdmin, setCurrentPage, showNotification, login } = useApp();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check admin credentials
    if (credentials.email === 'admin@tasteofegypt.ca' && credentials.password === 'admin123') {
      login({
        name: 'Admin',
        email: credentials.email,
        provider: 'email'
      });
      setIsAdmin(true);
      setCurrentPage('admin');
      showNotification('Welcome to the Admin Dashboard');
    } else {
      showNotification('Invalid credentials', 'error');
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-card admin-login">
          <div className="login-header">
            <Icons.Dashboard />
            <h1>Staff Portal</h1>
            <p>Access the order management dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="admin@tasteofegypt.ca"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-block">
              Access Dashboard
            </button>
          </form>
          
          {/* Demo Credentials */}
          <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: admin@tasteofegypt.ca</p>
            <p>Password: admin123</p>
          </div>
          
          <button 
            className="back-link" 
            onClick={() => setCurrentPage('login')}
          >
            ← Back to Customer Login
          </button>
        </div>
      </div>
    </main>
  );
}

export default AdminLoginPage;
