import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/ui/Icons';

export function LoginPage() {
  const { login, setCurrentPage } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleGoogleLogin = () => {
    // In production, this would integrate with actual Google OAuth
    login({
      name: 'Google User',
      email: 'user@gmail.com',
      provider: 'google'
    });
    setCurrentPage('menu');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      provider: 'email'
    });
    setCurrentPage('menu');
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-icon">
              <Icons.Pyramid />
            </div>
            <h1>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
            <p>
              {isSignUp 
                ? 'Join us for authentic Egyptian cuisine' 
                : 'Sign in to continue ordering'}
            </p>
          </div>
          
          {/* Google Login */}
          <button className="btn btn-google" onClick={handleGoogleLogin}>
            <Icons.Google />
            Continue with Google
          </button>
          
          <div className="divider">
            <span>or</span>
          </div>
          
          {/* Email Form */}
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ahmed Mohamed"
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-block">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>
          
          {/* First Order Promo */}
          {isSignUp && (
            <div className="first-order-promo">
              <Icons.Truck />
              <span>Get FREE delivery on your first order!</span>
            </div>
          )}
          
          {/* Toggle Sign In / Sign Up */}
          <p className="toggle-auth">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
          
          {/* Staff Login Link */}
          <button 
            className="admin-link-btn" 
            onClick={() => setCurrentPage('admin-login')}
          >
            Staff Login →
          </button>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
