import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icons } from '../ui/Icons';

export function Footer() {
  const { setCurrentPage } = useApp();

  return (
    <footer className="footer">
      <div className="footer-pattern"></div>
      <div className="container">
        <div className="footer-content">
          {/* Brand */}
          <div className="footer-brand">
            <div className="logo" onClick={() => setCurrentPage('home')}>
              <div className="logo-icon">
                <Icons.Pyramid />
              </div>
              <div className="logo-text">
                <span className="logo-main">Taste of Egypt</span>
                <span className="logo-sub">YYC</span>
              </div>
            </div>
            <p>Authentic Egyptian cuisine in Calgary</p>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <button onClick={() => setCurrentPage('menu')}>Menu</button>
            <button onClick={() => setCurrentPage('about')}>About Us</button>
            <button onClick={() => setCurrentPage('contact')}>Contact</button>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h4>Contact</h4>
            <p><Icons.Email /> tasteofegyptyyc@gmail.com</p>
            <p><Icons.Phone /> (403) 555-EGYPT</p>
            <p><Icons.MapPin /> Calgary, AB</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Taste of Egypt YYC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
