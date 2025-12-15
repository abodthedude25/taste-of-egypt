import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/ui/Icons';

export function AdminLoginPage() {
  const { adminLogin, setCurrentPage, showNotification } = useApp();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await adminLogin(credentials);
      setCurrentPage('admin');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
      showNotification('Invalid credentials', 'error');
    } finally {
      setLoading(false);
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
          
          {error && (
            <div className="error-message" style={{
              background: '#fee',
              color: '#c00',
              padding: '10px 15px',
              borderRadius: '8px',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="admin@tasteofegypt.ca"
                required
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in...' : 'Access Dashboard'}
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
