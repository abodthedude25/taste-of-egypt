import React from 'react';
import { useApp } from '../context/AppContext';
import { Hero } from '../components/Hero';
import { MenuItemCard } from '../components/MenuItemCard';
import { Icons } from '../components/ui/Icons';

export function HomePage() {
  const { menuItems, setCurrentPage } = useApp();
  const popularItems = menuItems.filter(item => item.popular);

  return (
    <main className="home-page">
      <Hero />
      
      {/* Popular Dishes Section */}
      <section className="popular-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Most Loved</span>
            <h2 className="section-title">Popular Dishes</h2>
            <p className="section-subtitle">Discover our customers' favorites</p>
          </div>
          
          <div className="menu-grid">
            {popularItems.map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
          
          <div className="section-footer">
            <button 
              className="btn btn-outline btn-lg" 
              onClick={() => setCurrentPage('menu')}
            >
              View Full Menu <Icons.ArrowRight />
            </button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>First Time Ordering?</h2>
            <p>Get FREE delivery on your first order when you sign up!</p>
            <button 
              className="btn btn-primary btn-lg" 
              onClick={() => setCurrentPage('login')}
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
