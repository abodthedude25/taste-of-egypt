import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/ui/Icons';
import { GOOGLE_CLIENT_ID, isConfigured } from '../config';

export function LoginPage() {
  const { login, register, googleLogin, setCurrentPage, showNotification } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle successful Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');
      const decoded = jwtDecode(credentialResponse.credential);
      
      await googleLogin({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        googleId: decoded.sub
      });
      
      setCurrentPage('menu');
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || 'Failed to sign in with Google');
      showNotification('Failed to sign in with Google', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login error
  const handleGoogleError = () => {
    showNotification('Google sign-in was cancelled or failed.', 'error');
  };

  // Fallback for development mode without Google OAuth configured
  const handleDevGoogleLogin = async () => {
    try {
      setLoading(true);
      await googleLogin({
        name: 'Test User',
        email: 'testuser@gmail.com',
        provider: 'google'
      });
      setCurrentPage('menu');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle email/password submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      } else {
        await login({
          email: formData.email,
          password: formData.password
        });
      }
      setCurrentPage('menu');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth wrapper - only render if configured
  const GoogleLoginButton = () => {
    if (!isConfigured()) {
      return (
        <button 
          className="btn btn-google" 
          onClick={handleDevGoogleLogin}
          disabled={loading}
        >
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
          
          {/* Error message */}
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
                  disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
            <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }}>
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
