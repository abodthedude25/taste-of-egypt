import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/ui/Icons';

export function ContactPage() {
  const { showNotification } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    showNotification("Message sent! We'll get back to you soon.");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <main className="contact-page">
      <div className="page-hero">
        <div className="hieroglyphics-pattern"></div>
        <h1>Contact Us</h1>
        <p>We'd love to hear from you</p>
      </div>
      
      <div className="container">
        <div className="contact-layout">
          {/* Contact Info */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              Have questions about our menu or want to place a large order? 
              Reach out to us!
            </p>
            
            <div className="contact-methods">
              <div className="contact-method">
                <Icons.Email />
                <div>
                  <h4>Email</h4>
                  <p>tasteofegyptyyc@gmail.com</p>
                </div>
              </div>
              <div className="contact-method">
                <Icons.Phone />
                <div>
                  <h4>Phone</h4>
                  <p>(403) 555-EGYPT</p>
                </div>
              </div>
              <div className="contact-method">
                <Icons.MapPin />
                <div>
                  <h4>Location</h4>
                  <p>Calgary, Alberta</p>
                </div>
              </div>
            </div>
            
            <div className="business-hours">
              <h3>Order Hours</h3>
              <p>Tuesday - Sunday: 11am - 8pm</p>
              <p>Monday: Closed</p>
              <p className="note">* Orders require 24-48 hours notice</p>
            </div>
          </div>
          
          {/* Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send a Message</h2>
            
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-block">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ContactPage;
