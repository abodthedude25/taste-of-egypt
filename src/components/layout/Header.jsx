import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Icons } from '../ui/Icons';

export function Header() {
  const { cart, user, setCurrentPage, currentPage, isAdmin, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo" onClick={() => setCurrentPage('home')}>
          <div className="logo-icon">
            <Icons.Pyramid />
          </div>
          <div className="logo-text">
            <span className="logo-main">Taste of Egypt</span>
            <span className="logo-sub">YYC</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
          {isAdmin && (
            <button
              className={`nav-link admin-link ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={() => handleNavClick('admin')}
            >
              <Icons.Dashboard /> Dashboard
            </button>
          )}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {user ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setCurrentPage('orders')}>
                <Icons.User />
                <span className="user-name">{user.name.split(' ')[0]}</span>
              </button>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          ) : (
            <button className="login-btn" onClick={() => setCurrentPage('login')}>
              <Icons.User /> Sign In
            </button>
          )}
          
          <button className="cart-btn" onClick={() => setCurrentPage('cart')}>
            <Icons.Cart />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
          
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
