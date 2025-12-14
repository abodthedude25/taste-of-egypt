import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/ui/Icons';
import { GOOGLE_CLIENT_ID, isConfigured } from '../config';

export function LoginPage() {
  const { login, setCurrentPage, showNotification } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Handle successful Google login
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      login({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        provider: 'google',
        googleId: decoded.sub
      });
      setCurrentPage('menu');
    } catch (error) {
      console.error('Google login error:', error);
      showNotification('Failed to sign in with Google. Please try again.', 'error');
    }
  };

  // Handle Google login error
  const handleGoogleError = () => {
    showNotification('Google sign-in was cancelled or failed.', 'error');
  };

  // Fallback for development mode without Google OAuth configured
  const handleDevGoogleLogin = () => {
    login({
      name: 'Test User',
      email: 'testuser@gmail.com',
      provider: 'google'
    });
    setCurrentPage('menu');
    showNotification('Logged in with test account (dev mode)', 'info');
  };

  // Handle email/password submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In production, you would validate against a backend
    // For now, we just create/login the user
    login({
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      provider: 'email'
    });
    
    setLoading(false);
    setCurrentPage('menu');
  };

  // Google OAuth wrapper - only render if configured
  const GoogleLoginButton = () => {
    if (!isConfigured()) {
      // Development fallback
      return (
        <button className="btn btn-google" onClick={handleDevGoogleLogin}>
          <Icons.Google />
          Continue with Google (Dev Mode)
        </button>
      );
    }

    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            width="100%"
            text={isSignUp ? "signup_with" : "signin_with"}
            shape="rectangular"
          />
        </div>
      </GoogleOAuthProvider>
    );
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
          <GoogleLoginButton />
          
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
                minLength={6}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
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
